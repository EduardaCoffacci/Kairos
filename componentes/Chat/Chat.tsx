"use client";

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
  const [chatOpen, setChatOpen] = useState(false);
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

  const addMessage = useCallback((incoming: Message) => {
    setMessages((current) => {
      if (current.some((item) => item._id === incoming._id)) {
        return current;
      }

      return [...current, incoming];
    });
  }, []);

  // Recupera uma conversa existente, se houver.
  // Se não houver, aguarda o visitante informar o nome.
  useEffect(() => {
    let cancelled = false;

    async function initializeChat() {
      setLoading(true);
      setError("");
      setClosedNotice("");

      try {
        let visitorId = localStorage.getItem(CHAT_CONFIG.visitorStorageKey);

        if (!visitorId) {
          visitorId = `visitante-${crypto.randomUUID()}`;
          localStorage.setItem(CHAT_CONFIG.visitorStorageKey, visitorId);
        }

        const conversationId = localStorage.getItem(
          CHAT_CONFIG.conversationStorageKey,
        );

        const visitorToken = localStorage.getItem(
          CHAT_CONFIG.visitorTokenStorageKey,
        );

        let activeConversation: Conversation | null = null;

        if (conversationId && visitorToken) {
          try {
            const savedConversation = await fetchVisitorConversation(
              conversationId,
              visitorToken,
            );

            if (
              savedConversation._id === conversationId &&
              savedConversation.visitorId === visitorId &&
              savedConversation.status === "open"
            ) {
              activeConversation = savedConversation;
            }
          } catch (err) {
            console.warn("Falha ao recuperar a conversa:", err);
          }
        }

        if (cancelled) return;

        // Não cria conversa automaticamente.
        // O visitante precisa informar o nome primeiro.
        if (!activeConversation || !visitorToken) {
          localStorage.removeItem(CHAT_CONFIG.conversationStorageKey);
          localStorage.removeItem(CHAT_CONFIG.visitorTokenStorageKey);

          setConversation(null);
          setMessages([]);
          return;
        }

        setConversation(activeConversation);

        // Carrega o histórico usando o token do visitante.
        const history = await fetchConversationMessages(
          activeConversation._id,
          visitorToken,
        );

        if (cancelled) return;

        setMessages(history);
      } catch (err) {
        console.error("Erro ao iniciar chat:", err);

        if (!cancelled) {
          setError(
            "Não foi possível conectar ao atendimento. Tente novamente.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeChat();

    return () => {
      cancelled = true;
    };
  }, []);

  // Cria a conversa somente depois que o visitante informa o nome.
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
  }, [messages, chatOpen, closedNotice]);

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
    <div className="fixed bottom-6 right-6 z-50">
      {chatOpen && (
        <div className="absolute bottom-24 right-0 flex h-[460px] max-h-[calc(100dvh-140px)] w-[320px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Cabeçalho */}
          <div className="flex shrink-0 items-center gap-3 bg-[var(--kairos-orange)] p-4 text-white">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white">
              <Image
                src="/atendente.jpg"
                alt="Atendente da Kairos"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Atendimento Kairos</p>

              <p className="flex items-center gap-1.5 text-xs text-white/90">
                <span
                  className={`h-2 w-2 rounded-full ${
                    conversation?.status === "closed"
                      ? "bg-red-300"
                      : socketReady
                        ? "bg-green-400"
                        : "bg-yellow-300"
                  }`}
                />

                {loading
                  ? "Preparando atendimento..."
                  : conversation?.status === "closed"
                    ? "Atendimento encerrado"
                    : socketReady
                      ? "Conectado ao atendimento"
                      : conversation
                        ? "Conectando..."
                        : "Vamos conversar?"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setChatOpen(false)}
              aria-label="Fechar janela de atendimento"
              className="flex h-8 w-8 items-center justify-center rounded-full text-2xl transition hover:bg-black/10"
            >
              ×
            </button>
          </div>

          {!conversation ? (
            /* Identificação do visitante */
            <form
              onSubmit={startConversation}
              className="flex flex-1 flex-col justify-center gap-4 bg-gray-50 p-5"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Olá! Seja bem-vindo à Kairos Industrial!
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Para iniciar o atendimento, informe seu nome.
                </p>
              </div>

              <div>
                <label
                  htmlFor="visitor-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Seu nome
                </label>

                <input
                  id="visitor-name"
                  type="text"
                  value={visitorName}
                  onChange={(event) => setVisitorName(event.target.value)}
                  placeholder="Digite seu nome"
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  required
                  disabled={loading || startingNewConversation}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-[var(--kairos-orange)] disabled:bg-gray-100"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs text-red-600">
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
                className="w-full rounded-xl bg-[var(--kairos-orange)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {startingNewConversation
                  ? "Iniciando atendimento..."
                  : "Iniciar atendimento"}
              </button>
            </form>
          ) : (
            <>
              {/* Histórico de mensagens */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
                <div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm leading-relaxed text-gray-800 shadow-sm">
                  Olá, {conversation.name}! Seja bem-vindo(a) à Kairos
                  Industrial! 👋
                  <p className="mt-2">
                    Como podemos ajudar você? Envie sua mensagem e nossa equipe
                    poderá responder por aqui.
                  </p>
                </div>

                {loading && (
                  <p className="text-center text-xs text-gray-500">
                    Preparando atendimento...
                  </p>
                )}

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
                        className={`max-w-[90%] rounded-2xl p-3 text-sm ${
                          item.sender === "visitor"
                            ? "rounded-tr-sm bg-[var(--kairos-orange)] text-white"
                            : "rounded-tl-sm bg-white text-gray-800 shadow-sm"
                        }`}
                      >
                        <p className="mb-1 text-[10px] opacity-70">
                          {item.sender === "visitor"
                            ? "Você"
                            : "Atendimento Kairos"}
                        </p>

                        <p className="whitespace-pre-wrap break-words">
                          {item.content}
                        </p>

                        <p className="mt-1 text-right text-[10px] opacity-60">
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

              {/* Aviso de atendimento finalizado */}
              {conversation.status === "closed" && (
                <div
                  role="status"
                  className="shrink-0 border-t border-gray-200 bg-white p-4"
                >
                  <div className="flex flex-col items-center rounded-xl bg-gray-50 px-3 py-4 text-center">
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900">
                      Atendimento finalizado
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {closedNotice ||
                        "Nossa equipe encerrou este atendimento. Agradecemos pelo contato!"}
                    </p>

                    <p className="mt-3 text-xs text-gray-500">
                      Precisa de mais alguma coisa?
                    </p>

                    <button
                      type="button"
                      onClick={startNewConversation}
                      disabled={startingNewConversation || loading}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--kairos-orange)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Iniciar novo atendimento
                    </button>
                  </div>
                </div>
              )}

              {/* Mensagens de erro */}
              {error && (
                <p
                  role="alert"
                  className="shrink-0 bg-red-50 px-3 py-2 text-xs text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Campo para enviar mensagens */}
              {conversation.status !== "closed" && (
                <form
                  onSubmit={sendMessage}
                  className="flex shrink-0 gap-2 border-t border-gray-100 bg-white p-3"
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
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[var(--kairos-orange)] disabled:bg-gray-100"
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
                    className="rounded-xl bg-[var(--kairos-orange)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? "..." : "Enviar"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}

      {/* Botão flutuante */}
      <div className="relative ml-auto w-fit">
        <button
          type="button"
          onClick={() => setChatOpen((open) => !open)}
          aria-label={chatOpen ? "Fechar atendimento" : "Abrir atendimento"}
          aria-expanded={chatOpen}
          className="relative flex h-[58px] w-[58px] items-center justify-center transition-transform duration-300 hover:scale-105 sm:h-[65px] sm:w-[65px] lg:h-[75px] lg:w-[75px]"
        >
          <div className="sombra-abrindo relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-[var(--kairos-orange)] shadow-lg">
            <Image
              src="/atendente.jpg"
              alt="Atendimento da Kairos"
              fill
              sizes="(max-width: 640px) 58px, (max-width: 1024px) 65px, 75px"
              className="object-cover"
            />
          </div>
        </button>

        <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500 sm:h-4 sm:w-4" />
      </div>
    </div>
  );
}
