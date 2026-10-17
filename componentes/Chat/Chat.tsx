"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { io, type Socket } from "socket.io-client";

type Conversation = {
  _id: string;
  visitorId: string;
  status: "open" | "closed";
};

type Message = {
  _id: string;
  conversationId: string | { _id: string };
  sender: "visitor" | "admin";
  content: string;
  createdAt: string;
};

type CreateConversationResponse = {
  conversation: Conversation;
  visitorToken: string;
};

type SocketResponse = {
  success?: boolean;
  message?: Message | string;
  error?: string;
};

type ConversationClosedPayload = {
  conversationId: string;
  message: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://kairos-api-kca6.onrender.com");

const VISITOR_STORAGE_KEY = "kairos-chat-visitor-id";
const CONVERSATION_STORAGE_KEY = "kairos-chat-conversation-id";
const VISITOR_TOKEN_STORAGE_KEY = "kairos-chat-visitor-token";

function getConversationId(message: Message): string {
  return typeof message.conversationId === "string"
    ? message.conversationId
    : message.conversationId._id;
}

export default function AtendenteWhatsApp() {
  const [chatOpen, setChatOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
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

  // Cria ou recupera a conversa do visitante.
  useEffect(() => {
    let cancelled = false;

    async function initializeChat() {
      setLoading(true);
      setError("");
      setClosedNotice("");

      try {
        let visitorId = localStorage.getItem(VISITOR_STORAGE_KEY);

        if (!visitorId) {
          visitorId = `visitante-${crypto.randomUUID()}`;
          localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
        }

        let conversationId = localStorage.getItem(CONVERSATION_STORAGE_KEY);

        let visitorToken = localStorage.getItem(VISITOR_TOKEN_STORAGE_KEY);

        let activeConversation: Conversation | null = null;

        // Recupera a conversa existente usando o ID e o token.
        if (conversationId && visitorToken) {
          try {
            const response = await fetch(
              `${API_URL}/chat/visitor/conversations/${encodeURIComponent(
                conversationId,
              )}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ visitorToken }),
              },
            );

            if (response.ok) {
              const savedConversation: Conversation = await response.json();

              if (
                savedConversation._id === conversationId &&
                savedConversation.visitorId === visitorId &&
                savedConversation.status === "open"
              ) {
                activeConversation = savedConversation;
              }
            } else {
              console.warn(
                "Não foi possível recuperar a conversa:",
                response.status,
              );
            }
          } catch (err) {
            console.warn("Falha ao recuperar a conversa:", err);
          }
        }

        if (cancelled) return;

        // Cria uma nova conversa se não houver uma válida.
        if (!activeConversation) {
          localStorage.removeItem(CONVERSATION_STORAGE_KEY);
          localStorage.removeItem(VISITOR_TOKEN_STORAGE_KEY);

          const response = await fetch(`${API_URL}/chat/conversations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ visitorId }),
          });

          if (!response.ok) {
            const details = await response.text();

            console.error("Erro ao criar conversa:", response.status, details);

            throw new Error(
              `Não foi possível iniciar o atendimento (HTTP ${response.status}).`,
            );
          }

          const result: CreateConversationResponse = await response.json();

          if (!result.conversation?._id || !result.visitorToken) {
            throw new Error(
              "A API não retornou a conversa e o token esperados.",
            );
          }

          activeConversation = result.conversation;
          conversationId = result.conversation._id;
          visitorToken = result.visitorToken;

          localStorage.setItem(CONVERSATION_STORAGE_KEY, conversationId);

          localStorage.setItem(VISITOR_TOKEN_STORAGE_KEY, visitorToken);
        }

        if (cancelled) return;

        setConversation(activeConversation);

        // Carrega o histórico autenticado.
        const historyResponse = await fetch(
          `${API_URL}/chat/visitor/conversations/${encodeURIComponent(
            activeConversation._id,
          )}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ visitorToken }),
          },
        );

        if (!historyResponse.ok) {
          throw new Error(
            `Não foi possível carregar o histórico (HTTP ${historyResponse.status}).`,
          );
        }

        const history: Message[] = await historyResponse.json();

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

  // Conecta o visitante à sala autenticada do Socket.IO.
  useEffect(() => {
    if (!conversation || conversation.status !== "open") {
      return;
    }

    const conversationId = conversation._id;
    const visitorToken = localStorage.getItem(VISITOR_TOKEN_STORAGE_KEY);

    if (!visitorToken) {
      socketRef.current = null;

      queueMicrotask(() => {
        setError("Autorização não encontrada. Recarregue o atendimento.");
      });

      return;
    }

    const socket = io(API_URL, {
      transports: ["websocket"],
      timeout: 10000,
      reconnection: false,
    });

    socketRef.current = socket;

    console.log("Socket criado:", socket);
    console.log("Socket URL:", API_URL);

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

    // Recebe o aviso enviado pelo backend quando o atendimento é encerrado.
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

  // Inicia uma nova conversa sem atualizar a página.
  async function startNewConversation() {
    if (startingNewConversation) return;

    setStartingNewConversation(true);
    setError("");

    try {
      let visitorId = localStorage.getItem(VISITOR_STORAGE_KEY);

      if (!visitorId) {
        visitorId = `visitante-${crypto.randomUUID()}`;
        localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
      }

      const response = await fetch(`${API_URL}/chat/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visitorId }),
      });

      if (!response.ok) {
        const details = await response.text();

        console.error(
          "Erro ao iniciar nova conversa:",
          response.status,
          details,
        );

        throw new Error(
          `Não foi possível iniciar um novo atendimento (HTTP ${response.status}).`,
        );
      }

      const result: CreateConversationResponse = await response.json();

      if (!result.conversation?._id || !result.visitorToken) {
        throw new Error(
          "A API não retornou a nova conversa e o token esperados.",
        );
      }

      // Salva somente os dados da nova conversa.
      localStorage.setItem(CONVERSATION_STORAGE_KEY, result.conversation._id);

      localStorage.setItem(VISITOR_TOKEN_STORAGE_KEY, result.visitorToken);

      // Limpa a interface da conversa anterior.
      setMessages([]);
      setMessage("");
      setClosedNotice("");
      setError("");
      setSocketReady(false);
      setSending(false);

      // A mudança de conversa ativa a conexão Socket.IO da nova sala.
      setConversation(result.conversation);
    } catch (err) {
      console.error("Erro ao iniciar novo atendimento:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível iniciar um novo atendimento. Tente novamente.",
      );
    } finally {
      setStartingNewConversation(false);
    }
  }

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
                      : "Conectando..."}
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

          {/* Histórico de mensagens */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            <div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm leading-relaxed text-gray-800 shadow-sm">
              Olá! Seja bem-vindo à Kairos Industrial! 👋
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
                    item.sender === "visitor" ? "justify-end" : "justify-start"
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
                      {new Date(item.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

            <div ref={bottomRef} />
          </div>

          {/* Aviso de atendimento finalizado */}
          {conversation?.status === "closed" && (
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
                  {startingNewConversation ? (
                    "Iniciando atendimento..."
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
                      </svg>
                      Iniciar novo atendimento
                    </>
                  )}
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
          {conversation?.status !== "closed" && (
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
                  !conversation ||
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
                  !conversation ||
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
