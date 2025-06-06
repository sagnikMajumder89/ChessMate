import { Server, Socket } from "socket.io";
import {
  getGameState,
  moveGameToDB,
  saveGameState,
} from "../services/gameState";
import { Chess } from "chess.js";
import { stopTimeSync, triggerTimeSync } from "../services/timeSync";

interface Move {
  from: string;
  to: string;
  promotion?: string;
}

const moveHandler = async (io: Server, socket: Socket, move: Move) => {
  const gameId = socket.data.gameId;
  if (!gameId) {
    socket.emit("error", "GameId is missing");
    return;
  }
  const gameState = await getGameState(gameId);
  if (!gameState) {
    socket.emit("error", "Game not found");
    return;
  }

  const isWhiteTurn = gameState.currentTurn === "w";
  const isPlayerWhite = gameState.players.white.uid === socket.data.user.uid;

  if ((isWhiteTurn && !isPlayerWhite) || (!isWhiteTurn && isPlayerWhite)) {
    socket.emit("invalidMove", { message: "Not your turn" });
    return;
  }

  const game = new Chess(gameState.boardState);

  const result = game.move({
    from: move.from,
    to: move.to,
    promotion: move.promotion || "q",
  });

  if (!result) {
    socket.emit("invalidMove", { move, error: "Illegal move" });
    return;
  }

  const newMove = {
    from: move.from,
    to: move.to,
    promotion: move.promotion || "q",
  };
  gameState.boardState = game.fen();
  gameState.moves.push(newMove);
  gameState.currentTurn = game.turn();
  gameState.lastMoveTimestamp = Date.now();

  if (game.isGameOver()) {
    stopTimeSync(gameId);
    gameState.status = "finished";
    await moveGameToDB(gameId);
  }
  await saveGameState(gameState);
  triggerTimeSync(gameId);
  socket.to(gameId).emit("move", newMove);
};

export default moveHandler;
