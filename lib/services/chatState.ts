import redis from "../db/redis";
import { logger } from "../logger";
import { getGameState } from "./gameState";

export const createNewChat = async (gameId: string, userId: string) => {
  const game = await getGameState(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  if (game.players.white.uid !== userId && game.players.black.uid !== userId) {
    throw new Error("User is not a participant in this game");
  }

  const key = `chat:${gameId}`;
  const chat = await redis.get(key);
  if (!chat) {
    await redis.set(key, JSON.stringify([]));
    return [];
  } else {
    return JSON.parse(chat) as { uid: string; text: string }[];
  }
};

export const getChatMessages = async (gameId: string) => {
  const key = `chat:${gameId}`;
  const chat = await redis.get(key);
  if (!chat) {
    return [];
  }
  try {
    return JSON.parse(chat) as { uid: string; text: string }[];
  } catch (error) {
    logger.error("Failed to parse chat messages:", error);
    return [];
  }
};

export const addChatMessage = async (
  gameId: string,
  userId: string,
  message: string
) => {
  const key = `chat:${gameId}`;
  const chat = await redis.get(key);
  if (!chat) {
    throw new Error("Chat not initialized for this game");
  }

  const messages = JSON.parse(chat) as { uid: string; text: string }[];
  messages.push({ uid: userId, text: message });
  await redis.set(key, JSON.stringify(messages));
};
