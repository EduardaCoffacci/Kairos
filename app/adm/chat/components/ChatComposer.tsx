
"use client";

type ChatComposerProps = {
  message: string;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  disabled: boolean;
  sending: boolean;
  closingConversation: boolean;
  conversationSelected: boolean;
  conversationClosed: boolean;
};

export default function ChatComposer({
  message,
  onMessageChange,
  onSend,
  disabled,
  sending,
  closingConversation,
  conversationSelected,
  conversationClosed,
}: ChatComposerProps) {
  const isDisabled =
    disabled ||
    !conversationSelected ||
    conversationClosed ||
    sending ||
    closingConversation;

  return (
    <div className="border-t border-white/10 p-3 sm:p-4">
      <form
        className="flex gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder={
            !conversationSelected
              ? "Selecione uma conversa primeiro"
              : conversationClosed
                ? "Esta conversa foi encerrada"
                : "Digite sua mensagem..."
          }
          disabled={isDisabled}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-[#e04f11] disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!message.trim() || isDisabled}
          className="rounded-lg bg-[#e04f11] px-4 py-3 font-medium hover:opacity-90 disabled:opacity-50 sm:px-6"
        >
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
