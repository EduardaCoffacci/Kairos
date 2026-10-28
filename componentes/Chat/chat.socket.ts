
import { io, type Socket } from "socket.io-client";

import { CHAT_CONFIG } from "./chat.constants";

export function createChatSocket(): Socket {
  return io(CHAT_CONFIG.apiUrl, {
    transports: ["websocket"],
    timeout: 10000,
    reconnection: false,
  });
}
