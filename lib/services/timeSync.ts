import { Server } from "socket.io";
import { getGameState, moveGameToDB, saveGameState } from "./gameState";
import { getCurrentTime, setCurrentTime } from "./timeService";

interface GameTracker {
  intervalId: NodeJS.Timeout;
  sendNextSync: boolean;
}

const trackers: Record<string, GameTracker> = {};
const lockers: Record<string, boolean> = {};

export function startTimeSync(io: Server, gameId: string) {
  if (trackers[gameId]) {
    return;
  }

  trackers[gameId] = {
    sendNextSync: false,
    intervalId: setInterval(async () => {
      if (lockers[gameId]) {
        return; // Skip this iteration if the game is locked
      }
      lockers[gameId] = true; // Lock the game to prevent concurrent access
      const game = await getCurrentTime(gameId);
      if (!game) return;

      const now = Date.now();
      const elapsed = now - game.timeStamp - 1000;

      if (game.currentTurn === "w") {
        game["w"] += elapsed;
        if (game["w"] >= game.baseTime * 1000) {
          io.to(gameId).emit("game-over", "Time’s up!");
          const cGame = await getGameState(gameId);
          if (!cGame) return;
          cGame.status = "finished";
          await saveGameState(cGame);
          await moveGameToDB(gameId);
          clearInterval(trackers[gameId].intervalId);
          delete trackers[gameId];
          return;
        }
      } else {
        game["b"] += elapsed;
        if (game["b"] >= game.baseTime * 1000) {
          io.to(gameId).emit("game-over", "Time’s up!");
          const cGame = await getGameState(gameId);
          if (!cGame) return;
          cGame.status = "finished";
          await saveGameState(cGame);
          await moveGameToDB(gameId);
          clearInterval(trackers[gameId].intervalId);
          delete trackers[gameId];
          return;
        }
      }
      if (trackers[gameId].sendNextSync) {
        game.currentTurn = game.currentTurn === "w" ? "b" : "w";
        io.to(gameId).emit("time-sync", {
          w: game["w"],
          b: game["b"],
          timeStamp: now,
        });
        trackers[gameId].sendNextSync = false;
      }

      game.timeStamp = now;
      await setCurrentTime(gameId, game);
      lockers[gameId] = false; // Unlock the game after processing
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
