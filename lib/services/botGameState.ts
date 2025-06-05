import redis from "@/lib/db/redis";
import { logger } from "../logger";

export interface PlayerDetails {
  id: string;
  uid: string;
  email: string;
  rating: number;
  photo: string;
}

export interface GameState {
  gameId: string;
  user: PlayerDetails;
  // Board state represented in FEN notation.
  boardState: string;
  moves: object[];
  status: "waiting" | "draw" | "checkmate" | "stalemate" | "resigned";
  currentTurn: "w" | "b";
  createdAt: number;
  updatedAt: number;
}

export async function saveGameState(state: GameState): Promise<void> {
  state.updatedAt = Date.now();
  const key = `botGameState:${state.gameId}`;
  await redis.set(key, JSON.stringify(state));
}

export async function getGameState(gameId: string): Promise<GameState | null> {
  const key = `botGameState:${gameId}`;
  const data = await redis.get(key);
  if (data) {
    try {
      return JSON.parse(data) as GameState;
    } catch (error) {
      logger.error("Failed to parse game state:", error);
      return null;
    }
  }
  return null;
}

export async function removeBotGameState(gameId: string): Promise<void> {
  const key = `botGameState:${gameId}`;
  await redis.del(key);
}
