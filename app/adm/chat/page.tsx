"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import ConversationList from "./components/ConversationList";
import ChatMessages from "./components/ChatMessage";
import ChatComposer from "./components/ChatComposer";

import { API_URL, REFRESH_INTERVAL } from "./chat-admin.constants";

import type {
  Conversation,
  ConversationFilter,
  Message,
  UnreadCount,
} from "./chat-admin.types";

export default function ChatAdminPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  const [conversationFilter, setConversationFilter] =
    useState<ConversationFilter>("all");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [closingConversation, setClosingConversation] = useState(false);
  const [error, setError] = useState("");

  const selectedConversationRef = useRef<Conversation | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Verifica a sessão usando o cookie HttpOnly.
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        window.localStorage.removeItem("kairos_admin_token");

        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!cancelled) {
          setIsAuthenticated(response.ok);
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setAuthChecked(true);
          setLoadingConversations(false);
        }
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Redireciona para o login quando não há sessão válida.
  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.replace("/adm/login");
    }
  }, [authChecked, isAuthenticated, router]);

  // Limpa os dados privados do painel.
  const clearAdminData = useCallback(() => {
    requestIdRef.current += 1;
    selectedConversationRef.current = null;

    setConversations([]);
    setSelectedConversation(null);
    setMessages([]);
    setUnreadCounts({});
    setMessage("");
    setConversationFilter("all");
    setLoadingMessages(false);
    setSending(false);
    setClosingConversation(false);
  }, []);

  // Todas as requisições administrativas usam o cookie.
  const authenticatedFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);

      if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setError("Sua sessão expirou. Entre novamente.");
        clearAdminData();

        throw new Error("Sessão inválida ou expirada.");
      }

      if (response.status === 403) {
        throw new Error("Você não tem permissão para acessar este recurso.");
      }

      return response;
    },
    [clearAdminData],
  );

  // Logout.
  async function handleLogout() {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("O servidor não confirmou o encerramento da sessão.");
      }
    } catch (err) {
      console.error("Erro ao encerrar sessão no servidor:", err);
    } finally {
      setIsAuthenticated(false);
      setError("");
      setAuthChecked(true);
      setLoadingConversations(false);
      clearAdminData();

      router.replace("/adm/login");
    }
  }

  // Atualiza os contadores de mensagens não lidas.
  const refreshUnreadCounts = useCallback(async () => {
    try {
      const response = await authenticatedFetch("/chat/unread-counts");

      if (!response.ok) {
        throw new Error("Não foi possível consultar as mensagens não lidas.");
      }

      const data: UnreadCount[] = await response.json();
      const counts: Record<string, number> = {};

      for (const item of data) {
        if (item.count > 0) {
          counts[item.conversationId] = item.count;
        }
      }

      setUnreadCounts(counts);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "Sessão inválida ou expirada."
      ) {
        console.error("Erro ao atualizar contadores:", err);
      }
    }
  }, [authenticatedFetch]);

  // Atualiza a lista de conversas.
  const refreshConversations = useCallback(async () => {
    try {
      const response = await authenticatedFetch("/chat/conversations");

      if (!response.ok) {
        throw new Error("Não foi possível carregar as conversas.");
      }

      const data: Conversation[] = await response.json();

      data.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      setConversations(data);

      const selected = selectedConversationRef.current;

      if (selected) {
        const updated = data.find((item) => item._id === selected._id);

        if (updated) {
          selectedConversationRef.current = updated;
          setSelectedConversation(updated);
        } else {
          selectedConversationRef.current = null;
          setSelectedConversation(null);
          setMessages([]);
        }
      }

      setError("");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "Sessão inválida ou expirada."
      ) {
        console.error("Erro ao atualizar conversas:", err);
        setError((current) => current || err.message);
      }
    } finally {
      setLoadingConversations(false);
    }
  }, [authenticatedFetch]);

  // Carrega as mensagens da conversa selecionada.
  const refreshSelectedMessages = useCallback(
    async (conversationId: string, requestId: number) => {
      const response = await authenticatedFetch(
        `/chat/admin/conversations/${conversationId}/messages`,
      );

      if (!response.ok) {
        throw new Error("Não foi possível carregar as mensagens.");
      }

      const data: Message[] = await response.json();

      if (
        requestId !== requestIdRef.current ||
        selectedConversationRef.current?._id !== conversationId
      ) {
        return;
      }

      setMessages((current) => {
        const byId = new Map<string, Message>();

        for (const item of current) {
          if (item.conversationId === conversationId) {
            byId.set(item._id, item);
          }
        }

        for (const item of data) {
          byId.set(item._id, item);
        }

        return [...byId.values()].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
    },
    [authenticatedFetch],
  );

  // Atualização periódica.
  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;

    void refreshConversations();
    void refreshUnreadCounts();

    const interval = window.setInterval(() => {
      void refreshConversations();
      void refreshUnreadCounts();

      const selected = selectedConversationRef.current;

      if (selected) {
        void refreshSelectedMessages(selected._id, requestIdRef.current).catch(
          (err) => {
            if (
              err instanceof Error &&
              err.message !== "Sessão inválida ou expirada."
            ) {
              console.error("Erro ao atualizar mensagens:", err);
            }
          },
        );
      }
    }, REFRESH_INTERVAL);

    return () => window.clearInterval(interval);
  }, [
    authChecked,
    isAuthenticated,
    refreshConversations,
    refreshUnreadCounts,
    refreshSelectedMessages,
  ]);

  // Seleciona uma conversa e marca suas mensagens como lidas.
  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      const requestId = ++requestIdRef.current;

      selectedConversationRef.current = conversation;
      setSelectedConversation(conversation);
      setMessages([]);
      setMessage("");
      setLoadingMessages(true);
      setError("");

      try {
        await refreshSelectedMessages(conversation._id, requestId);

        const response = await authenticatedFetch(
          `/chat/conversations/${conversation._id}/read`,
          { method: "PATCH" },
        );

        if (!response.ok) {
          throw new Error("Não foi possível registrar a leitura.");
        }

        await refreshUnreadCounts();
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        if (
          err instanceof Error &&
          err.message !== "Sessão inválida ou expirada."
        ) {
          console.error("Erro ao abrir conversa:", err);
          setError(err.message);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingMessages(false);
        }
      }
    },
    [authenticatedFetch, refreshSelectedMessages, refreshUnreadCounts],
  );

  // Envia uma mensagem do administrador.
  async function sendMessage() {
    const content = message.trim();
    const conversation = selectedConversation;

    if (
      !content ||
      !conversation ||
      conversation.status !== "open" ||
      sending ||
      closingConversation
    ) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await authenticatedFetch("/chat/admin/messages", {
        method: "POST",
        body: JSON.stringify({
          conversationId: conversation._id,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível enviar a mensagem.");
      }

      setMessage("");

      await refreshSelectedMessages(conversation._id, requestIdRef.current);
      await refreshConversations();
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "Sessão inválida ou expirada."
      ) {
        console.error("Erro ao enviar mensagem:", err);
        setError(err.message);
      }
    } finally {
      setSending(false);
    }
  }

  // Encerra uma conversa.
  async function closeConversation() {
    const conversation = selectedConversation;

    if (
      !conversation ||
      conversation.status !== "open" ||
      closingConversation ||
      sending
    ) {
      return;
    }

    if (!window.confirm("Tem certeza de que deseja encerrar esta conversa?")) {
      return;
    }

    setClosingConversation(true);
    setError("");

    try {
      const response = await authenticatedFetch(
        `/chat/conversations/${conversation._id}/close`,
        { method: "PATCH" },
      );

      if (!response.ok) {
        throw new Error("Não foi possível encerrar a conversa.");
      }

      await refreshConversations();
      setMessage("");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "Sessão inválida ou expirada."
      ) {
        console.error("Erro ao encerrar conversa:", err);
        setError(err.message);
      }
    } finally {
      setClosingConversation(false);
    }
  }

  // Exibe uma tela simples durante a verificação da sessão.
  if (!authChecked || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-zinc-400">
          {!authChecked
            ? "Verificando sessão..."
            : "Redirecionando para o login..."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-3 text-white sm:p-6">
      <div className="mx-auto flex h-[calc(100vh-24px)] max-w-7xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950 sm:h-[calc(100vh-48px)]">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?._id ?? null}
          unreadCounts={unreadCounts}
          conversationFilter={conversationFilter}
          loading={loadingConversations}
          onFilterChange={setConversationFilter}
          onSelectConversation={(conversation) =>
            void selectConversation(conversation)
          }
          onLogout={() => void handleLogout()}
        />

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
            <div className="min-w-0">
              <h2 className="truncate font-semibold">
                {selectedConversation
                  ? selectedConversation.name
                  : "Painel de atendimento"}
              </h2>

              <p className="text-sm text-zinc-400">
                {selectedConversation
                  ? selectedConversation.status === "open"
                    ? "Conversa aberta"
                    : "Conversa encerrada"
                  : "Selecione uma conversa para visualizar o histórico."}
              </p>
            </div>

            {selectedConversation?.status === "open" && (
              <button
                type="button"
                onClick={() => void closeConversation()}
                disabled={closingConversation || sending}
                className="shrink-0 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 sm:px-4"
              >
                {closingConversation ? "Encerrando..." : "Encerrar"}
              </button>
            )}
          </header>

          <ChatMessages
            messages={messages}
            conversationId={selectedConversation?._id ?? null}
            conversationName={selectedConversation?.name ?? "Cliente"}
            loading={loadingMessages}
          />

          {error && (
            <p
              role="alert"
              className="border-t border-red-500/20 px-4 py-2 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {selectedConversation?.status === "closed" && (
            <div className="border-t border-white/10 bg-zinc-900/60 px-4 py-3 text-center">
              <p className="text-sm text-zinc-400">
                Esta conversa foi encerrada. O envio de mensagens está
                desabilitado.
              </p>
            </div>
          )}

          <ChatComposer
            message={message}
            onMessageChange={setMessage}
            onSend={() => void sendMessage()}
            disabled={false}
            sending={sending}
            closingConversation={closingConversation}
            conversationSelected={Boolean(selectedConversation)}
            conversationClosed={selectedConversation?.status === "closed"}
          />
        </section>
      </div>
    </main>
  );
}
