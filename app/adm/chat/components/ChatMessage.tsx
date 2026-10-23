
type Message = {
  _id: string;
  conversationId: string;
  sender: "visitor" | "admin";
  content: string;
  createdAt: string;
};

type ChatMessagesProps = {
  messages: Message[];
  conversationId: string | null;
  conversationName: string;
  loading: boolean;
};

export default function ChatMessages({
  messages,
  conversationId,
  conversationName,
  loading,
}: ChatMessagesProps) {
  const conversationMessages = messages.filter(
    (message) => message.conversationId === conversationId,
  );

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
      {!conversationId && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-zinc-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5m-7 6-3 1 1-4a8 8 0 1 1 3 3Z"
                />
              </svg>
            </div>

            <p className="text-center text-zinc-500">
              Selecione uma conversa na coluna esquerda.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-sm text-zinc-400">Carregando mensagens...</p>
      )}

      {conversationId && !loading && conversationMessages.length === 0 && (
        <p className="text-sm text-zinc-400">
          Nenhuma mensagem nesta conversa.
        </p>
      )}

      {!loading &&
        conversationMessages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md rounded-xl px-4 py-3 ${
                message.sender === "admin"
                  ? "bg-[#e04f11] text-white"
                  : "bg-zinc-800 text-white"
              }`}
            >
              <p className="mb-1 text-xs opacity-70">
                {message.sender === "admin" ? "Atendente" : conversationName}
              </p>

              <p className="whitespace-pre-wrap break-words text-sm">
                {message.content}
              </p>

              <p className="mt-2 text-right text-xs opacity-60">
                {new Date(message.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
