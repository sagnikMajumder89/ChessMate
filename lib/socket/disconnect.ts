import { Socket } from "socket.io";
import redis from "../db/redis";
import { removeBotGameState } from "../game/botGameState";
import { markOffline } from "../game/gameState";

export default async function disconnect(socket: Socket) {
  //   Bot game cleanup
  if (socket.data.gameId) {
    await removeBotGameState(socket.data.gameId);
  }

  //   Mark user as offline & delete game if abandoned
  if (socket.data.uid) {
    await markOffline(socket.data.uid);
  }

  //   Remove user from active finding games
  if (socket.data.matchKey && socket.data.matchEntry) {
    await redis.zrem(socket.data.matchKey, socket.data.matchEntry);
  }
}
