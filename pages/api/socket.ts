import { Server } from 'socket.io'
import { Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as NetServer } from 'http'
import { admin } from '@/lib/firebase/firebaseAdmin';
import { logger } from '@/lib/logger';
import { checkUser } from '@/lib/socket/auth';
import redis from '@/lib/db/redis'
import { getGameStateByUser, saveGameState } from '@/lib/game/gameState';
import { v4 as uuidv4 } from 'uuid';

interface SocketServer extends NextApiResponse {
    socket: Socket & {
        server: {
            io?: Server
        }
    }
}

interface MatchmakingEntry {
    time: number;
    increment: number;
    rated: boolean;
}

interface User {
    id: string;
    uid: string;
    email: string;
    rating: number;

}

interface StoredEntry {
    socketId: string;
    id: string;
    uid: string;
    email: string;
    rating: number;
}

const RATING_THRESHOLD = 100;

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
                const user: User = socket.data.user;


                const currGame = await getGameStateByUser(user.uid);
                if (currGame) {
                    const opponent = currGame.players.white.uid === user.uid ? currGame.players.black : currGame.players.white;
                    const you = currGame.players.white.uid === user.uid ? currGame.players.white : currGame.players.black;
                    io.to(socket.id).emit("match-found", {
                        id: currGame.gameId,
                        user: you,
                        opponent,
                        fen: currGame.boardState,
                        moves: currGame.moves,
                        currentTurn: currGame.currentTurn,
                        rated: currGame.rated,
                        increment: currGame.increment
                    });
                    return;
                }


                const matchKey = `matchmaking:${settings.time}:${settings.increment}:${settings.rated}`;
                socket.data.matchKey = matchKey;

                const minRating = user.rating - RATING_THRESHOLD;
                const maxRating = user.rating + RATING_THRESHOLD;

                const potentialMatches = await redis.zrangebyscore(matchKey, minRating, maxRating);

                if (potentialMatches.length > 0) {

                    const matchedEntryStr = potentialMatches[0];
                    await redis.zrem(matchKey, matchedEntryStr);
                    const matchedEntry: StoredEntry = JSON.parse(matchedEntryStr);


                    const newGameId = uuidv4();
                    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
                    const initialMoves: string[] = [];
                    const initialTurn: "w" | "b" = "w";
                    const white = {
                        id: user.id,
                        uid: user.uid,
                        email: user.email,
                        rating: user.rating,
                        baseTime: settings.time,
                        color: "w" as "w" | "b",
                        timeConsumed: 0,
                    }
                    const black = {
                        id: matchedEntry.id,
                        uid: matchedEntry.uid,
                        email: matchedEntry.email,
                        rating: matchedEntry.rating,
                        baseTime: settings.time,
                        color: "b" as "w" | "b",
                        timeConsumed: 0,
                    }

                    io.to(socket.id).emit("match-found", {
                        id: newGameId,
                        user: white,
                        opponent: black,
                        fen: initialFen,
                        moves: initialMoves,
                        currentTurn: initialTurn,
                        rated: settings.rated,
                        increment: settings.increment
                    });


                    io.to(matchedEntry.socketId).emit("match-found", {
                        id: newGameId,
                        user: black,
                        opponent: white,
                        fen: initialFen,
                        moves: initialMoves,
                        currentTurn: initialTurn,
                        rated: settings.rated,
                        increment: settings.increment
                    });


                    await saveGameState({
                        gameId: newGameId,
                        players: {
                            white,
                            black
                        },
                        boardState: initialFen,
                        moves: initialMoves,
                        status: "waiting",
                        currentTurn: initialTurn,
                        lastMoveTimestamp: Date.now(),
                        rated: settings.rated,
                        increment: settings.increment,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    });

                    delete socket.data.matchKey;
                    delete socket.data.matchEntry;
                } else {

                    const entry: StoredEntry = {
                        socketId: socket.id,
                        id: user.id,
                        uid: user.uid,
                        email: user.email,
                        rating: user.rating,
                    };
                    const entryStr = JSON.stringify(entry);
                    socket.data.matchEntry = entryStr;
                    await redis.zadd(matchKey, user.rating, entryStr);
                }
            });


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

