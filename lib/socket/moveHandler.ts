import { Server, Socket } from "socket.io";
import {
  getGameState,
  moveGameToDB,
  saveGameState,
} from "../services/gameState";
import { Chess } from "chess.js";

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

  const currTime = Date.now();
  const consumedTime = currTime - gameState.lastMoveTimestamp;
  if (gameState.currentTurn === "w") {
    gameState.players.white.timeConsumed += consumedTime;
  } else {
    gameState.players.black.timeConsumed += consumedTime;
  }
  const newMove = {
    from: move.from,
    to: move.to,
    promotion: move.promotion || "q",
  };
  gameState.boardState = game.fen();
  gameState.moves.push(newMove);
  gameState.currentTurn = game.turn();
  gameState.lastMoveTimestamp = currTime;

  if (game.isGameOver()) {
    gameState.status = "finished";
    io.to(gameId).emit("gameOver", { message: "Game Over" });
    await moveGameToDB(gameId);
  }

  await saveGameState(gameState);

  socket.to(gameId).emit("move", newMove);
};

export default moveHandler;
