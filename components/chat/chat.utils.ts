import type { Message } from "./chat.types";

export function getConversationId(message: Message): string {
  return typeof message.conversationId === "string"
    ? message.conversationId
    : message.conversationId._id;
}