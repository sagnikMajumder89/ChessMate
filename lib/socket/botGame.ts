import { saveGameState } from "@/lib/game/botGameState";
import { v4 as uuidv4 } from "uuid";
import redis from "@/lib/db/redis";
import { Server, Socket } from "socket.io";

interface BotGameEntry {
  level: number;
  color: string;
}

interface User {
  id: string;
  uid: string;
  email: string;
  rating: number;
  photo: string;
}

export const setupGame = async (
  io: Server,
  socket: Socket,
  settings: BotGameEntry
) => {
  const user: User = socket.data.user;
  const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const initialMoves: object[] = [];
  const newGameId = uuidv4();
  socket.data.gameId = newGameId;
  io.to(socket.id).emit("bot-game-started", {
    id: newGameId,
    level: settings.level,
    color: settings.color,
    fen: initialFen,
    moves: initialMoves,
    currentTurn: "w",
  });

  await saveGameState({
    gameId: newGameId,
    user,
    boardState: initialFen,
    moves: initialMoves,
    status: "waiting",
    currentTurn: "w",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
};
