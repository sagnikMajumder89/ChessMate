import 'module-alias/register';
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import redis from "./lib/db/redis";
import { logger } from "./lib/logger";
import { findGame } from "./lib/socket/findGame";
import moveHandler from "./lib/socket/moveHandler";
import { admin } from "./lib/firebase/firebaseAdmin";
import { checkUser } from "./lib/socket/auth";
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

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            const userDB = await checkUser({ uid: decodedToken.uid, email: decodedToken.email as string });

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
    io.on('connection', (socket) => {
        socket.on("find-game", (data) => findGame(io, socket, data));
        socket.on("move", (data) => moveHandler(io, socket, data));
        socket.on("disconnect", async () => {
            if (socket.data.matchKey && socket.data.matchEntry) {
                await redis.zrem(socket.data.matchKey, socket.data.matchEntry);
            }
            logger.info("User disconnected:", socket.id);
        });
    })

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