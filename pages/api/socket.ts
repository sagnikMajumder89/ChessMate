import { Server } from 'socket.io'
import { Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as NetServer } from 'http'
import redis from '@/lib/redis'
import { admin } from '@/lib/firebase/firebaseAdmin';
import { logger } from '@/lib/logger';
import { checkUser } from '@/lib/socket/auth';

interface SocketServer extends NextApiResponse {
    socket: Socket & {
        server: {
            io?: Server
        }
    }
}

interface MatchmakingEntry {
    userId: string;
    socketId: string;
    rating: number;
    time: number;
    rated: boolean;
}

// const RATING_TOLERANCE = 100;
// const MATCHMAKING_TTL = 300;

const SocketHandler = (req: NextApiRequest, res: SocketServer) => {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server as unknown as NetServer)
        res.socket.server.io = io

        io.use(async (socket, next) => {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication token missing"));
            }

            try {
                const decodedToken = await admin.auth().verifyIdToken(token);
                const userDB = await checkUser({ uid: decodedToken.uid, email: (decodedToken.email as string) });
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

        io.on('connection', socket => {
            socket.on("find-game", async (settings: MatchmakingEntry) => {
                console.log("find-game", settings, socket.data.user);
            });
        })
    }
    res.end()
}

export default SocketHandler

