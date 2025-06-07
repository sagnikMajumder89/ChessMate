import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { logger } from "./lib/logger";
import { findGame } from "./lib/socket/findGame";
import moveHandler from "./lib/socket/moveHandler";
import { admin } from "./lib/firebase/firebaseAdmin";
import { checkUser } from "./lib/socket/auth";
import { handleMove, setupGame } from "./lib/socket/botGame";
import disconnect from "./lib/socket/disconnect";
import {
  handleChatConnect,
  handleNewMessage,
  initSendChat,
} from "./lib/socket/chatService";
const port = parseInt(process.env.PORT || "4000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();
const hostname = process.env.HOSTNAME || "localhost";
app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    if (token === "guest") {
      socket.data.user = {
        id: socket.id,
        uid: socket.id,
        email: null,
        rating: 0,
        photo: "",
      };
      return next();
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userDB = await checkUser(decodedToken);

      socket.data.user = {
        id: userDB!.id,
        uid: decodedToken.uid,
        email: decodedToken.email,
        rating: userDB!.rating,
        photo: decodedToken.picture || "",
      };

      next();
    } catch (error) {
      logger.error("Socket Authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });
  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // User related events
    socket.on("find-game", (data) => findGame(io, socket, data));
    socket.on("move", (data) => moveHandler(io, socket, data));

    // Bot related events
    socket.on("find-bot-game", (data) => setupGame(io, socket, data));
    socket.on("bot-move", (data) => handleMove(io, socket, data));

    // Chat related events
    socket.on("join-chat", (data) => handleChatConnect(socket, data));
    socket.on("init-chat", (data) => initSendChat(socket, data));
    socket.on("chat-message", (data) => handleNewMessage(socket, data));
    socket.on("disconnect", async () => {
      await disconnect(socket);
      logger.info(`User disconnected: + ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      logger.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      if (process.env.NODE_ENV !== "production")
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
