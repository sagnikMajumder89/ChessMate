"use client";
import FindMatch from "@/components/play/find-match";
import { useAuth } from "@/lib/auth/authContext";
import { GameSetting } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";

let socket: Socket | undefined;

const Play = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [gameId, setGameId] = useState<string | null>(null);
    const [gameFinding, setGameFinding] = useState(false);
    const { user } = useAuth();
    const [gameSettings, setGameSettings] = useState<GameSetting>({
        time: 10,
        increment: 0,
        rated: true
    });

    useEffect(() => {
        const initialize = async () => {
            if (user) {

                await fetch("/api/socket");
                const token = await user!.getIdToken();
                socket = io({
                    auth: { token },
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                }) as Socket;

                socket.on("connect", () => {
                    setIsConnected(true);
                });

                socket.on("game-found", (game) => {
                    setGameId(game.gameId);
                });

            };
        }

        initialize();

        return () => {
            socket?.disconnect();
        };
    }, [user]);

    const findGame = async () => {
        setGameFinding(true);
        if (socket) {
            socket.emit("find-game", { ...gameSettings });
        }
    };

    return (
        <div className="p-5 text-center w-full">
            {isConnected ? (
                gameId ? (
                    <h2 className="text-xl font-bold">Game Found! 🎉 Game ID: {gameId}</h2>
                ) : (
                    <div>
                        <FindMatch
                            findGame={findGame}
                            gameSettings={gameSettings}
                            setGameSettings={setGameSettings}
                            gameFinding={gameFinding}
                        />
                    </div>
                )
            ) : (
                <div>Connecting...</div>
            )}
        </div>
    );
};

export default Play;
