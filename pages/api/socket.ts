import { Server } from 'socket.io'
import { Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as NetServer } from 'http'
import { admin } from '@/lib/firebase/firebaseAdmin';
import { logger } from '@/lib/logger';
import { checkUser } from '@/lib/socket/auth';
import redis from '@/lib/db/redis'
import { findGame } from '@/lib/socket/findGame';
import moveHandler from '@/lib/socket/moveHandler';


interface SocketServer extends NextApiResponse {
    socket: Socket & {
        server: {
            io?: Server
        }
    }
}

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

            socket.on("find-game", (data) => findGame(io, socket, data));
            socket.on("move", (data) => moveHandler(io, socket, data));
            socket.on('disconnect', async () => {
                if (socket.data.matchKey && socket.data.matchEntry) {
                    await redis.zrem(socket.data.matchKey, socket.data.matchEntry);
                }
            });
        })
    }
    res.end()
}

export default SocketHandler

