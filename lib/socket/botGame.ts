import { getGameState, saveGameState } from "@/lib/game/botGameState";
import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import { getBestMoveForPosition } from "../game/botService";
import { Chess } from "chess.js";
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

  if (settings.color === "b") {
    const game = new Chess(initialFen);
    const move = await getBestMoveForPosition(initialFen);
    game.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion || "q",
    });

    const updatedFen = game.fen();
    await saveGameState({
      gameId: newGameId,
      user,
      boardState: updatedFen,
      moves: [
        {
          from: move.from,
          to: move.to,
          promotion: move.promotion || "q",
        },
      ],
      status: "waiting",
      currentTurn: "w",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    io.to(socket.id).emit("bot-move", {
      from: move.from,
      to: move.to,
      promotion: move.promotion || "q",
    });
  }
};

interface MoveData {
  from: string;
  to: string;
  promotion?: string;
  color: string;
  piece: string;
  after: string;
  before: string;
  lan: string;
  san: string;
  flags: string;
}

export const handleMove = async (
  io: Server,
  socket: Socket,
  data: MoveData
) => {
  const gameId = socket.data.gameId;
  if (!gameId) {
    socket.emit("error", "GameId is missing");
    return;
  }

  const gameData = await getGameState(gameId);

  if (!gameData) {
    socket.emit("error", "Game not found");
    return;
  }

  gameData.moves.push({
    from: data.from,
    to: data.to,
    promotion: data.promotion || "q",
  });
  gameData.boardState = data.after;
  // Get Bot move from stockfish
  const move = await getBestMoveForPosition(gameData.boardState);
  const game = new Chess(gameData.boardState);
  game.move({
    from: move.from,
    to: move.to,
    promotion: move.promotion || "q",
  });
  gameData.boardState = game.fen();
  gameData.moves.push({
    from: move.from,
    to: move.to,
    promotion: move.promotion || "q",
  });
  await saveGameState(gameData);
  io.to(socket.id).emit("bot-move", move);
  gameData.updatedAt = Date.now();
};
