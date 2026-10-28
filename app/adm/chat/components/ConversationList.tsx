
import {
  Badge,
  Chip,
  Tab,
  Tabs,
} from "@mui/material";

type Conversation = {
  _id: string;
  visitorId: string;
  name: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
};

type ConversationFilter = "all" | "open" | "closed" | "unread";

type ConversationListProps = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  unreadCounts: Record<string, number>;
  conversationFilter: ConversationFilter;
  loading: boolean;
  onFilterChange: (filter: ConversationFilter) => void;
  onSelectConversation: (conversation: Conversation) => void;
  onLogout: () => void;
};

export default function ConversationList({
  conversations,
  selectedConversationId,
  unreadCounts,
  conversationFilter,
  loading,
  onFilterChange,
  onSelectConversation,
  onLogout,
}: ConversationListProps) {
  const totalUnread = Object.values(unreadCounts).reduce(
    (total, count) => total + count,
    0,
  );

  const openCount = conversations.filter(
    (conversation) => conversation.status === "open",
  ).length;

  const closedCount = conversations.filter(
    (conversation) => conversation.status === "closed",
  ).length;

  const unreadConversationCount = Object.values(unreadCounts).filter(
    (count) => count > 0,
  ).length;

  const filters: {
    id: ConversationFilter;
    label: string;
    count: number;
  }[] = [
    { id: "all", label: "Todas", count: conversations.length },
    { id: "open", label: "Abertas", count: openCount },
    { id: "closed", label: "Fechadas", count: closedCount },
    {
      id: "unread",
      label: "Não lidas",
      count: unreadConversationCount,
    },
  ];

  const filteredConversations = conversations.filter((conversation) => {
    if (conversationFilter === "open") {
      return conversation.status === "open";
    }

    if (conversationFilter === "closed") {
      return conversation.status === "closed";
    }

    if (conversationFilter === "unread") {
      return (unreadCounts[conversation._id] ?? 0) > 0;
    }

    return true;
  });

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-hidden border-r border-white/10 sm:w-80">
      {/* Cabeçalho */}
      <div className="border-b border-white/10 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Kairos Atendimento</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Central de conversas
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
          >
            Sair
          </button>
        </div>

        {totalUnread > 0 && (
          <p className="mt-3 text-sm font-medium text-[#e04f11]">
            {totalUnread} mensagem(ns) não lida(s)
          </p>
        )}
      </div>

      {/* Filtros com Material UI */}
      <div className="border-b border-white/10">
        <Tabs
          value={conversationFilter}
          onChange={(_, newValue: ConversationFilter) =>
            onFilterChange(newValue)
          }
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Filtrar conversas"
          sx={{
            minHeight: 48,
            "& .MuiTabs-indicator": {
              backgroundColor: "#e04f11",
              height: 3,
            },
            "& .MuiTab-root": {
              minWidth: "auto",
              minHeight: 48,
              px: 1.5,
              color: "#a1a1aa",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "none",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#ffffff",
            },
            "& .MuiTabs-scrollButtons": {
              color: "#d4d4d8",
            },
          }}
        >
          {filters.map((filter) => (
            <Tab
              key={filter.id}
              value={filter.id}
              label={
                <Badge
                  badgeContent={filter.count}
                  showZero
                  sx={{
                    "& .MuiBadge-badge": {
                      position: "static",
                      transform: "none",
                      marginLeft: "8px",
                      minWidth: 20,
                      height: 20,
                      px: 0.5,
                      borderRadius: "10px",
                      backgroundColor:
                        conversationFilter === filter.id
                          ? "#e04f11"
                          : "rgba(255,255,255,0.12)",
                      color: "#ffffff",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    },
                  }}
                >
                  {filter.label}
                </Badge>
              }
            />
          ))}
        </Tabs>
      </div>

      {/* Lista de conversas */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {loading && (
          <p className="p-3 text-sm text-zinc-400">
            Carregando conversas...
          </p>
        )}

        {!loading && filteredConversations.length === 0 && (
          <p className="p-3 text-sm text-zinc-400">
            {conversations.length === 0
              ? "Nenhuma conversa encontrada."
              : "Nenhuma conversa corresponde a este filtro."}
          </p>
        )}

        {filteredConversations.map((conversation) => {
          const unread = unreadCounts[conversation._id] ?? 0;
          const isSelected =
            selectedConversationId === conversation._id;

          return (
            <div
              key={conversation._id}
              className={`rounded-lg border transition ${
                isSelected
                  ? "border-[#e04f11]/60 bg-[#e04f11]/10"
                  : "border-transparent bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start gap-2 p-3">
                <button
                  type="button"
                  onClick={() => onSelectConversation(conversation)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate font-medium">
                      {conversation.name || "Cliente"}
                    </p>

                    {unread > 0 && (
                      <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-[#e04f11] px-2 text-xs font-bold">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <Chip
                      label={
                        conversation.status === "open"
                          ? "Aberta"
                          : "Fechada"
                      }
                      size="small"
                      sx={{
                        height: 22,
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        backgroundColor:
                          conversation.status === "open"
                            ? "rgba(52,211,153,0.12)"
                            : "rgba(161,161,170,0.12)",
                        color:
                          conversation.status === "open"
                            ? "#6ee7b7"
                            : "#a1a1aa",
                        border: "1px solid",
                        borderColor:
                          conversation.status === "open"
                            ? "rgba(52,211,153,0.25)"
                            : "rgba(161,161,170,0.2)",
                      }}
                    />

                  </div>

                  <p className="mt-2 text-xs text-zinc-500">
                    Atualizada às{" "}
                    {new Date(conversation.updatedAt).toLocaleTimeString(
                      "pt-BR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
