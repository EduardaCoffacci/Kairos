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
  conversationId:
    | string
    | {
        _id: string;
      };
  sender: "visitor" | "admin";
  content: string;
  readByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};


export type CreateConversationResponse = {
  conversation: Conversation;
  visitorToken: string;
};

export type SocketResponse = {
  success?: boolean;
  message?: Message | string;
  error?: string;
};

export type ConversationClosedPayload = {
  conversationId: string;
  message: string;
};
