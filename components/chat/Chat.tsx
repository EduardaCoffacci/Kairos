"use client";
import { useChat } from "@/app/context/ChatContext";

import {
  createChatConversation,
  fetchVisitorConversation,
  fetchConversationMessages,
} from "./chat.api";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createChatSocket } from "./chat.socket";
import { CHAT_CONFIG } from "./chat.constants";
import { getConversationId } from "./chat.utils";
import type { Socket } from "socket.io-client";
import type {
  Conversation,
  Message,
  SocketResponse,
  ConversationClosedPayload,
} from "./chat.types";

export default function AtendenteWhatsApp() {
  const { isChatOpen, setIsChatOpen } = useChat();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [startingNewConversation, setStartingNewConversation] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [error, setError] = useState("");
  const [closedNotice, setClosedNotice] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Evita mensagens duplicadas.
  const addMessage = useCallback((incoming: Message) => {
    setMessages((current) => {
      if (current.some((item) => item._id === incoming._id)) {
        return current;
      }

      return [...current, incoming];
    });
  }, []);

  // Recupera uma conversa existente, se houver.
  useEffect(() => {
    let cancelled = false;

    async function initializeChat() {
      setLoading(true);
      setError("");
      setClosedNotice("");

      try {
        const visitorId =
          localStorage.getItem(CHAT_CONFIG.visitorStorageKey) ||
          `visitante-${crypto.randomUUID()}`;

        localStorage.setItem(CHAT_CONFIG.visitorStorageKey, visitorId);

        const conversationId = localStorage.getItem(
          CHAT_CONFIG.conversationStorageKey,
        );
        const visitorToken = localStorage.getItem(
          CHAT_CONFIG.visitorTokenStorageKey,
        );

        let activeConversation: Conversation | null = null;

        if (conversationId && visitorToken) {
          try {
            const saved = await fetchVisitorConversation(
              conversationId,
              visitorToken,
            );

            if (
              saved._id === conversationId &&
              saved.visitorId === visitorId &&
              saved.status === "open"
            ) {
              activeConversation = saved;
            }
          } catch (err) {
            console.warn("Falha ao recuperar a conversa:", err);
          }
        }

        if (cancelled) return;

        if (!activeConversation || !visitorToken) {
          localStorage.removeItem(CHAT_CONFIG.conversationStorageKey);
          localStorage.removeItem(CHAT_CONFIG.visitorTokenStorageKey);
          setConversation(null);
          setMessages([]);
          return;
        }

        setConversation(activeConversation);

        const history = await fetchConversationMessages(
          activeConversation._id,
          visitorToken,
        );

        if (!cancelled) setMessages(history);
      } catch (err) {
        console.error("Erro ao iniciar chat:", err);

        if (!cancelled) {
          setError(
            "Não foi possível conectar ao atendimento. Tente novamente.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initializeChat();

    return () => {
      cancelled = true;
    };
  }, []);

  // Cria a conversa depois que o visitante informa o nome.
  async function startConversation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = visitorName.trim();

    if (name.length < 2) {
      setError("Informe seu nome com pelo menos 2 caracteres.");
      return;
    }

    if (startingNewConversation) return;

    setStartingNewConversation(true);
    setError("");

    try {
      let visitorId = localStorage.getItem(CHAT_CONFIG.visitorStorageKey);

      if (!visitorId) {
        visitorId = `visitante-${crypto.randomUUID()}`;
        localStorage.setItem(CHAT_CONFIG.visitorStorageKey, visitorId);
      }

      const result = await createChatConversation(visitorId, name);

      if (!result.conversation?._id || !result.visitorToken) {
        throw new Error("A API não retornou a conversa e o token esperados.");
      }

      localStorage.setItem(
        CHAT_CONFIG.conversationStorageKey,
        result.conversation._id,
      );

      localStorage.setItem(
        CHAT_CONFIG.visitorTokenStorageKey,
        result.visitorToken,
      );

      setMessages([]);
      setMessage("");
      setClosedNotice("");
      setSocketReady(false);
      setConversation(result.conversation);
    } catch (err) {
      console.error("Erro ao iniciar atendimento:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível iniciar o atendimento. Tente novamente.",
      );
    } finally {
      setStartingNewConversation(false);
    }
  }

  // Solicita o nome novamente antes de criar outra conversa.
  function startNewConversation() {
    if (startingNewConversation) return;

    localStorage.removeItem(CHAT_CONFIG.conversationStorageKey);
    localStorage.removeItem(CHAT_CONFIG.visitorTokenStorageKey);

    setConversation(null);
    setMessages([]);
    setMessage("");
    setVisitorName("");
    setClosedNotice("");
    setError("");
    setSocketReady(false);
    setSending(false);
  }

  // Conecta o visitante à sala autenticada do Socket.IO.
  useEffect(() => {
    if (!conversation || conversation.status !== "open") {
      return;
    }

    const conversationId = conversation._id;
    const visitorToken = localStorage.getItem(
      CHAT_CONFIG.visitorTokenStorageKey,
    );

    if (!visitorToken) {
      socketRef.current = null;

      queueMicrotask(() => {
        setError("Autorização não encontrada. Recarregue o atendimento.");
      });

      return;
    }

    const socket = createChatSocket();

    socketRef.current = socket;

    function joinRoom() {
      socket.emit(
        "joinConversation",
        {
          conversationId,
          visitorToken,
        },
        (response: SocketResponse) => {
          if (socketRef.current !== socket) return;

          if (response?.success) {
            setSocketReady(true);
            setError("");
          } else {
            setSocketReady(false);
            setError(
              typeof response?.message === "string"
                ? response.message
                : "Não foi possível entrar na conversa.",
            );
          }
        },
      );
    }

    function handleNewMessage(incoming: Message) {
      if (getConversationId(incoming) !== conversationId) {
        return;
      }

      addMessage(incoming);
    }

    function handleConversationClosed(payload: ConversationClosedPayload) {
      if (payload?.conversationId !== conversationId) {
        return;
      }

      setConversation((current) => {
        if (!current || current._id !== conversationId) {
          return current;
        }

        return {
          ...current,
          status: "closed",
        };
      });

      setClosedNotice(
        payload.message || "Este atendimento foi encerrado pela equipe.",
      );

      setError("");
      setSocketReady(false);
      setMessage("");
      setSending(false);
    }

    function handleConnectError(err: Error) {
      console.error("Socket.IO — mensagem:", err.message);
      console.error("Socket.IO — erro completo:", err);

      setSocketReady(false);
      setError("Conexão em tempo real indisponível.");
    }

    socket.on("connect", joinRoom);
    socket.on("newMessage", handleNewMessage);
    socket.on("conversationClosed", handleConversationClosed);
    socket.on("connect_error", handleConnectError);

    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.off("newMessage", handleNewMessage);
      socket.off("conversationClosed", handleConversationClosed);
      socket.off("connect_error", handleConnectError);

      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [conversation, addMessage]);

  // Mantém a visualização na mensagem mais recente.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isChatOpen, closedNotice]);

  // Envia mensagens pelo Socket.IO.
  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = message.trim();
    const currentConversation = conversation;
    const socket = socketRef.current;

    if (!content || !currentConversation || sending) {
      return;
    }

    if (currentConversation.status !== "open") {
      setClosedNotice(
        "Este atendimento não está mais disponível. Inicie um novo atendimento para continuar.",
      );
      return;
    }

    if (!socket?.connected || !socketReady) {
      setError("Conectando ao atendimento. Tente novamente em instantes.");
      return;
    }

    setSending(true);
    setError("");

    socket.timeout(10000).emit(
      "sendMessage",
      {
        conversationId: currentConversation._id,
        content,
      },
      (err: Error | null, response: SocketResponse) => {
        setSending(false);

        if (err || !response?.success) {
          const responseMessage =
            typeof response?.message === "string" ? response.message : "";

          const conversationUnavailable = [
            "Conversa encerrada ou autorização inválida.",
            "Token inválido ou conversa fechada.",
            "Este atendimento foi encerrado pela equipe.",
          ].includes(responseMessage);

          if (conversationUnavailable) {
            setConversation((current) => {
              if (!current || current._id !== currentConversation._id) {
                return current;
              }

              return {
                ...current,
                status: "closed",
              };
            });

            setClosedNotice(
              "Este atendimento não está mais disponível. Inicie um novo atendimento para continuar.",
            );

            setError("");
            setSocketReady(false);
            setMessage("");
            return;
          }

          setError(
            err
              ? "Não foi possível enviar a mensagem. Verifique sua conexão e tente novamente."
              : responseMessage ||
                  "Não foi possível enviar a mensagem. Tente novamente.",
          );

          return;
        }

        setMessage("");

        if (
          response.message &&
          typeof response.message === "object" &&
          "_id" in response.message
        ) {
          addMessage(response.message as Message);
        }
      },
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans sm:bottom-6 sm:right-6">
      {/* Janela do atendimento */}
      {isChatOpen && (
        <div className="absolute bottom-[82px] right-0 flex h-[min(620px,calc(100dvh-120px))] w-[370px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-[390px]">
          {/* Cabeçalho */}
          <header className="flex shrink-0 items-center gap-3 bg-[var(--kairos-orange)] px-5 py-4 text-white">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/80">
              <Image
                src="/atendente.jpg"
                alt="Atendimento Kairos"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold tracking-wide">
                Kairos Industrial
              </h2>

              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    conversation?.status === "closed"
                      ? "bg-red-300"
                      : socketReady
                        ? "bg-green-300"
                        : "bg-yellow-300"
                  }`}
                />

                <span className="text-xs text-white/90">
                  {loading
                    ? "Preparando atendimento..."
                    : conversation?.status === "closed"
                      ? "Atendimento encerrado"
                      : socketReady
                        ? "Online • Atendimento conectado"
                        : conversation
                          ? "Conectando..."
                          : "Atendimento ao cliente"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              aria-label="Fechar atendimento"
              className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-white/90 transition hover:bg-white/15 hover:text-white"
            >
              ×
            </button>
          </header>

          {/* Identificação do visitante */}
          {!conversation ? (
            <form
              onSubmit={startConversation}
              className="flex flex-1 flex-col justify-center gap-5 bg-gray-50 p-6"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-8 w-8 text-[var(--kairos-orange)]"
                  >
                    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4-.9L3 21l1.9-5.5a8.4 8.4 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8v.5Z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Olá! Seja bem-vindo.
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Estamos prontos para ajudar você. Informe seu nome para
                  iniciar o atendimento.
                </p>
              </div>

              <div>
                <label
                  htmlFor="visitor-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Como podemos chamar você?
                </label>

                <input
                  id="visitor-name"
                  type="text"
                  value={visitorName}
                  onChange={(event) => setVisitorName(event.target.value)}
                  placeholder="Digite seu nome completo"
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  required
                  disabled={loading || startingNewConversation}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--kairos-orange)] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-xs text-red-600"
                >
                  {error}
                </p>
              )}

              {loading && (
                <p className="text-center text-xs text-gray-500">
                  Verificando atendimento anterior...
                </p>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  startingNewConversation ||
                  visitorName.trim().length < 2
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--kairos-orange)] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {startingNewConversation
                  ? "Iniciando atendimento..."
                  : "Iniciar atendimento"}
              </button>

              <p className="text-center text-xs text-gray-400">
                Atendimento oficial • Kairos Industrial
              </p>
            </form>
          ) : (
            <>
              {/* Área das mensagens */}
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#F5F6F8] p-4">
                {/* Mensagem de boas-vindas */}
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-gray-100 bg-white p-3.5 shadow-sm">
                    <p className="mb-1 text-xs font-bold text-[var(--kairos-orange)]">
                      Atendimento Kairos
                    </p>

                    <p className="text-sm leading-relaxed text-gray-700">
                      Olá, {conversation.name}! Seja bem-vindo(a) à Kairos
                      Industrial! 👋
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      Como podemos ajudar você? Envie sua mensagem e nossa
                      equipe poderá responder por aqui.
                    </p>

                    <p className="mt-2 text-right text-[10px] text-gray-400">
                      Atendimento
                    </p>
                  </div>
                </div>

                {loading && (
                  <p className="text-center text-xs text-gray-500">
                    Carregando mensagens...
                  </p>
                )}

                {/* Mensagens */}
                {!loading &&
                  messages.map((item) => (
                    <div
                      key={item._id}
                      className={`flex ${
                        item.sender === "visitor"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                          item.sender === "visitor"
                            ? "rounded-tr-sm bg-[var(--kairos-orange)] text-white"
                            : "rounded-tl-sm border border-gray-100 bg-white text-gray-800"
                        }`}
                      >
                        <p
                          className={`mb-1 text-[11px] font-semibold ${
                            item.sender === "visitor"
                              ? "text-white/75"
                              : "text-[var(--kairos-orange)]"
                          }`}
                        >
                          {item.sender === "visitor"
                            ? "Você"
                            : "Atendimento Kairos"}
                        </p>

                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {item.content}
                        </p>

                        <p
                          className={`mt-2 text-right text-[10px] ${
                            item.sender === "visitor"
                              ? "text-white/65"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(item.createdAt).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  ))}

                <div ref={bottomRef} />
              </div>

              {/* Atendimento encerrado */}
              {conversation.status === "closed" && (
                <div className="shrink-0 border-t border-gray-100 bg-white p-4">
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-6 w-6 text-green-600"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    </div>

                    <h3 className="font-bold text-gray-900">
                      Atendimento finalizado
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {closedNotice ||
                        "Nossa equipe encerrou este atendimento. Agradecemos pelo contato!"}
                    </p>

                    <button
                      type="button"
                      onClick={startNewConversation}
                      disabled={startingNewConversation || loading}
                      className="mt-4 w-full rounded-xl bg-[var(--kairos-orange)] px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50"
                    >
                      Iniciar novo atendimento
                    </button>
                  </div>
                </div>
              )}

              {/* Erros */}
              {error && (
                <p
                  role="alert"
                  className="shrink-0 border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Campo de envio */}
              {conversation.status !== "closed" && (
                <form
                  onSubmit={sendMessage}
                  className="flex shrink-0 items-center gap-2 border-t border-gray-100 bg-white p-3"
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Digite sua mensagem..."
                    maxLength={2000}
                    disabled={
                      loading ||
                      conversation.status !== "open" ||
                      !socketReady ||
                      sending
                    }
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--kairos-orange)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={
                      !message.trim() ||
                      loading ||
                      sending ||
                      conversation.status !== "open" ||
                      !socketReady
                    }
                    aria-label="Enviar mensagem"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--kairos-orange)] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? (
                      <span className="text-sm">...</span>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Rodapé */}
          <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-2 text-center">
            <p className="text-[10px] tracking-wide text-gray-400">
              Atendimento • Kairos Industrial
            </p>
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label={isChatOpen ? "Fechar atendimento" : "Abrir atendimento"}
        aria-expanded={isChatOpen}
        className="relative ml-auto flex h-[62px] w-[62px] items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 sm:h-[68px] sm:w-[68px]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-[var(--kairos-orange)] shadow-xl">
          <Image
            src="/atendente.jpg"
            alt="Atendimento da Kairos"
            fill
            sizes="68px"
            className="object-cover"
          />
        </div>

        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
      </button>
    </div>
  );
}
