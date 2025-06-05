import { Server, Socket } from "socket.io";
import {
  addChatMessage,
  createNewChat,
  getChatMessages,
} from "../services/chatState";
import { logger } from "../logger";

export const handleChatConnect = async (socket: Socket, data: any) => {
  const { gameId } = data;

  if (!gameId) {
    socket.emit("connect-error", "Game ID is required to join chat");
    return;
  }

  try {
    const chats = await createNewChat(gameId, socket.data.user.uid);
    socket.emit("connect-chat", { chats });

    // Join the chat room for the specific game
    socket.join(`chat:${gameId}`);
  } catch (error) {
    logger.error("Error connecting to chat:", error);
    socket.emit("connect-error", "Failed to connect to chat service");
  }
};

export const handleNewMessage = async (socket: Socket, data: any) => {
  const { gameId, message } = data;

  if (!gameId || !message) {
    socket.emit("message-error", "Game ID and message are required");
    return;
  }

  try {
    await addChatMessage(gameId, socket.data.user.uid, message);
    socket.to(`chat:${gameId}`).emit("chat-message", {
      uid: socket.data.user.uid,
      text: message,
    });
  } catch (error) {
    logger.error("Error sending chat message:", error);
    socket.emit("message-error", "Failed to send chat message");
  }
};

export const initSendChat = async (socket: Socket, data: any) => {
  const { gameId } = data;
  if (!gameId) {
    socket.emit("message-error", "Game ID is required to initialize chat");
    return;
  }

  const chat = await getChatMessages(gameId);
  if (chat) {
    socket.emit("init-chat", chat);
    return;
  }
};
