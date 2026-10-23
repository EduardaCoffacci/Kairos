export const CHAT_CONFIG = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://kairos-api-kca6.onrender.com"),

  visitorStorageKey: "kairos-chat-visitor-id",
  conversationStorageKey: "kairos-chat-conversation-id",
  visitorTokenStorageKey: "kairos-chat-visitor-token",
};