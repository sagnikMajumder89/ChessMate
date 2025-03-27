import { Server } from "socket.io";
import { createServer } from "http";
import { admin } from "@/lib/firebase/firebaseAdmin";
import { logger } from "@/lib/logger";
import { checkUser } from "@/lib/socket/auth";
import redis from "@/lib/db/redis";
import { findGame } from "@/lib/socket/findGame";
import moveHandler from "@/lib/socket/moveHandler";

const PORT = process.env.SOCKET_PORT;

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "https://chessmate.bytebuilderz.xyz",
        methods: ["GET", "POST"],
    },
});

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
        };

        next();
    } catch (error) {
        logger.error("Authentication error:", error);
        next(new Error("Authentication failed"));
    }
});

io.on("connection", (socket) => {
    logger.info("New user connected:", socket.id);

    socket.on("find-game", (data) => findGame(io, socket, data));
    socket.on("move", (data) => moveHandler(io, socket, data));

    socket.on("disconnect", async () => {
        if (socket.data.matchKey && socket.data.matchEntry) {
            await redis.zrem(socket.data.matchKey, socket.data.matchEntry);
        }
        logger.info("User disconnected:", socket.id);
    });
});

// Start the server
httpServer.listen(PORT, () => {
    logger.info(`🚀 WebSocket Server running on port ${PORT}`);
});
