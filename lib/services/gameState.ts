// lib/gameState.ts
import redis from "@/lib/db/redis";
import { logger } from "../logger";
import { prisma } from "../db/prisma";
import { GameStatus } from "@prisma/client";
import { stopTimeSync } from "./timeSync";

// Define the shape of a player in the game state.
export interface PlayerDetails {
  id: string;
  uid: string;
  online: boolean;
  email: string;
  rating: number;
  baseTime: number;
  color: "w" | "b";
  timeConsumed: number;
}

export interface GameState {
  gameId: string;
  players: {
    white: PlayerDetails;
    black: PlayerDetails;
  };
  // Board state represented in FEN notation.
  boardState: string;
  moves: object[];
  status: "waiting" | "abandon" | "finished";
  currentTurn: "w" | "b";
  lastMoveTimestamp: number;
  rated: boolean;
  increment: number;
  createdAt: number;
  updatedAt: number;
}

export async function saveGameState(state: GameState): Promise<void> {
  state.updatedAt = Date.now();
  const key = `gameState:${state.gameId}`;
  await redis.set(key, JSON.stringify(state));
  await redis.set(`userGame:${state.players.white.uid}`, state.gameId);
  await redis.set(`userGame:${state.players.black.uid}`, state.gameId);
}

export async function getGameState(gameId: string): Promise<GameState | null> {
  const key = `gameState:${gameId}`;
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

export async function getGameStateByUser(
  uid: string
): Promise<GameState | null> {
  const gameId = await redis.get(`userGame:${uid}`);
  if (!gameId) return null;
  return getGameState(gameId);
}

export async function markOffline(uid: string): Promise<void> {
  const key = `userGame:${uid}`;

  const gameId = await redis.get(key);

  if (gameId) {
    const gameState = await getGameState(gameId);
    if (gameState) {
      const player = gameState.players.white.uid === uid ? "white" : "black";
      gameState.players[player].online = false;
      await saveGameState(gameState);
      await deleteGameOnAbandon(gameId);
    }
  }
}

async function deleteGameOnAbandon(gameId: string): Promise<void> {
  const gameState = await getGameState(gameId);
  const chatKey = `chat:${gameId}`;
  stopTimeSync(gameId);
  if (
    gameState &&
    !gameState.players.white.online &&
    !gameState.players.black.online
  ) {
    await redis.del(chatKey);
    await removeUserMapping(gameState.players.white.uid);
    await removeUserMapping(gameState.players.black.uid);
    await removeGameState(gameId);
  }
}

export async function removeUserMapping(uid: string): Promise<void> {
  const key = `userGame:${uid}`;

  await redis.del(key);
}

export async function removeGameState(gameId: string): Promise<void> {
  const key = `gameState:${gameId}`;
  await redis.del(key);
}
export async function moveGameToDB(gameId: string): Promise<void> {
  try {
    const gameState = await getGameState(gameId);
    if (!gameState) {
      logger.error(`Game state not found for gameId: ${gameId}`);
      return;
    }
    await removeUserMapping(gameState.players.white.uid);
    await removeUserMapping(gameState.players.black.uid);
    await removeGameState(gameId);
    await prisma.game.create({
      data: {
        id: gameState.gameId,
        whitePlayerId: gameState.players.white.id,
        blackPlayerId: gameState.players.black.id,
        boardState: gameState.boardState,
        moves: JSON.stringify(gameState.moves),
        status: gameState.status.toUpperCase() as GameStatus,
        currentTurn: gameState.currentTurn,
        lastMoveTimestamp: gameState.lastMoveTimestamp,
        rated: gameState.rated,
        increment: gameState.increment,
      },
    });
  } catch (e) {
    logger.error(`Error moving game to DB: ${e}`);
    return;
  }
}
