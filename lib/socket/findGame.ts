import { getGameStateByUser, saveGameState } from '@/lib/game/gameState';
import { v4 as uuidv4 } from 'uuid';
import redis from '@/lib/db/redis'
import { Server, Socket } from "socket.io";

const RATING_THRESHOLD = 100;

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
    photo: string;
}

interface StoredEntry {
    socketId: string;
    id: string;
    uid: string;
    email: string;
    rating: number;
    photo: string;
}


export const findGame = async (io: Server, socket: Socket, settings: MatchmakingEntry) => {
    const user: User = socket.data.user;
    const currGame = await getGameStateByUser(user.uid);
    if (currGame) {
        const opponent = currGame.players.white.uid === user.uid ? currGame.players.black : currGame.players.white;
        const you = currGame.players.white.uid === user.uid ? currGame.players.white : currGame.players.black;
        socket.data.gameId = currGame.gameId;
        socket.join(currGame.gameId);
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
        const initialMoves: object[] = [];
        const initialTurn: "w" | "b" = "w";
        const white = {
            id: user.id,
            uid: user.uid,
            email: user.email,
            rating: user.rating,
            baseTime: settings.time,
            color: "w" as "w" | "b",
            timeConsumed: 0,
            photo: user.photo,
        }
        const black = {
            id: matchedEntry.id,
            uid: matchedEntry.uid,
            email: matchedEntry.email,
            rating: matchedEntry.rating,
            baseTime: settings.time,
            color: "b" as "w" | "b",
            timeConsumed: 0,
            photo: matchedEntry.photo,
        }
        delete socket.data.matchKey;
        delete socket.data.matchEntry;
        socket.data.gameId = newGameId;
        socket.join(newGameId);
        const matchedSocket = io.sockets.sockets.get(matchedEntry.socketId);
        if (matchedSocket) {
            delete matchedSocket.data.matchKey;
            delete matchedSocket.data.matchEntry;
            matchedSocket.data.gameId = newGameId;
            matchedSocket.join(newGameId);
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
    } else {

        const entry: StoredEntry = {
            socketId: socket.id,
            id: user.id,
            uid: user.uid,
            email: user.email,
            rating: user.rating,
            photo: user.photo,
        };
        const entryStr = JSON.stringify(entry);
        socket.data.matchEntry = entryStr;
        await redis.zadd(matchKey, user.rating, entryStr);
    }
}