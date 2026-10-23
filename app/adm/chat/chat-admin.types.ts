
export type Conversation = {
  _id: string;
  visitorId: string;
  name: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  _id: string;
  conversationId: string;
  sender: "visitor" | "admin";
  content: string;
  createdAt: string;
};

export type UnreadCount = {
  conversationId: string;
  count: number;
};

export type ConversationFilter = "all" | "open" | "closed" | "unread";
