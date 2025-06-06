import { Server } from "socket.io";
import { getGameState, saveGameState, moveGameToDB } from "./gameState";

interface GameTracker {
  intervalId: NodeJS.Timeout;
  sendNextSync: boolean;
}

const trackers: Record<string, GameTracker> = {};


export function startTimeSync(io: Server, gameId: string) {
  if (trackers[gameId]) {
    return; 
  }

  trackers[gameId] = {
    sendNextSync: false,
    intervalId: setInterval(async () => {
      const game = await getGameState(gameId);
      if (!game) return;

      const now = Date.now();
      const elapsed = now - game.lastMoveTimestamp;

      if (game.currentTurn === "w") {
        game.players.white.timeConsumed += elapsed;
        if (game.players.white.timeConsumed >= game.players.white.baseTime * 1000) {
          io.to(gameId).emit("game-over", "Time’s up!");
          game.players.white.timeConsumed = game.players.white.baseTime * 1000 + 1000;
          game.status = "finished";
          await saveGameState(game);
          await moveGameToDB(gameId);
          clearInterval(trackers[gameId].intervalId);
          delete trackers[gameId];
          return;
        }
      } else {
        game.players.black.timeConsumed += elapsed;
        if (game.players.black.timeConsumed >= game.players.black.baseTime * 1000) {
          io.to(gameId).emit("game-over", "Time’s up!");
          game.players.black.timeConsumed = game.players.black.baseTime * 1000 + 1000;
          game.status = "finished";
          await moveGameToDB(gameId);
          await saveGameState(game);
          clearInterval(trackers[gameId].intervalId);
          delete trackers[gameId];
          return;
        }
      }

      if (trackers[gameId].sendNextSync) {
        io.to(gameId).emit("time-sync", {
          w: game.players.white.timeConsumed,
          b: game.players.black.timeConsumed,
          timeStamp: now,
        });
        trackers[gameId].sendNextSync = false;
      }

      game.lastMoveTimestamp = now;
      await saveGameState(game);
    }, 1000),
  };
}

export function triggerTimeSync(gameId: string) {
  if (trackers[gameId]) {
    trackers[gameId].sendNextSync = true;
  }
}

export function stopTimeSync(gameId: string) {
  if (trackers[gameId]) {
    clearInterval(trackers[gameId].intervalId);
    delete trackers[gameId];
  }
}
