// lib/gameState.ts
import redis from "@/lib/db/redis";

// Define the shape of a player in the game state.
export interface PlayerDetails {
    id: string;
    uid: string;
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
    status: "waiting" | "in-progress" | "finished";
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
            console.error("Failed to parse game state:", error);
            return null;
        }
    }
    return null;
}

export async function getGameStateByUser(uid: string): Promise<GameState | null> {
    const gameId = await redis.get(`userGame:${uid}`);
    if (!gameId) return null;
    return getGameState(gameId);
}


export async function removeGameState(gameId: string): Promise<void> {
    const key = `gameState:${gameId}`;
    await redis.del(key);
}

export function getRemainingTime(player: PlayerDetails, lastMoveTimestamp: number): number {
    const elapsed = Date.now() - lastMoveTimestamp;
    return Math.max(player.baseTime - player.timeConsumed - elapsed, 0);
}
