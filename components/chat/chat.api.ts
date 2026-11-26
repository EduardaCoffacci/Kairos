
import { CHAT_CONFIG } from "./chat.constants";

import type {
  Conversation,
  Message,
  CreateConversationResponse,
} from "./chat.types";


const API_URL = CHAT_CONFIG.apiUrl;

// Criar uma nova conversa
export async function createChatConversation(
  visitorId: string,
  name: string,
): Promise<CreateConversationResponse> {
  const response = await fetch(`${API_URL}/chat/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      visitorId,
      name,
    }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível criar a conversa.");
  }

  return response.json();
}




// Recuperar uma conversa existente do visitante
export async function fetchVisitorConversation(
  conversationId: string,
  visitorToken: string,
): Promise<Conversation> {
  const response = await fetch(
    `${API_URL}/chat/visitor/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorToken,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Não foi possível recuperar a conversa.");
  }

  return response.json();
}




// Buscar o histórico de mensagens da conversa
export async function fetchConversationMessages(
  conversationId: string,
  visitorToken: string,
): Promise<Message[]> {
  const response = await fetch(
    `${API_URL}/chat/visitor/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorToken,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar as mensagens.");
  }

  return response.json();
}
