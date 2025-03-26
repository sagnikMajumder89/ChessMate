"use client";
import Chessboard from "@/components/play/chessboard";
import FindMatch from "@/components/play/find-match";
import { useAuth } from "@/lib/auth/authContext";
import { GameSetting } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import { MatchDetails } from "@/lib/interfaces";

let socket: Socket | undefined;

const Play = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [gameFinding, setGameFinding] = useState(false);
    const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
    const { user } = useAuth();
    const [gameSettings, setGameSettings] = useState<GameSetting>({
        time: 10,
        increment: 0,
        rated: true,
    });

    useEffect(() => {
        const initialize = async () => {
            if (user) {
                await fetch("/api/socket");
                const token = await user.getIdToken();
                socket = io({
                    auth: { token },
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                }) as Socket;

                socket.on("connect", () => {
                    setIsConnected(true);
                });


                socket.on("match-found", (payload: MatchDetails) => {
                    setGameFinding(false);
                    setMatchDetails(payload);
                });
            }
        };

        initialize();

        return () => {
            socket?.disconnect();
        };
    }, [user]);

    const findGame = async () => {
        setGameFinding(true);

        setMatchDetails(null);
        if (socket) {
            socket.emit("find-game", { ...gameSettings });
        }
    };

    return (
        <div className="w-full">
            {isConnected ? (
                <>
                    {matchDetails ? (
                        <Chessboard matchDetails={matchDetails} socket={socket!} />
                    ) : (
                        <FindMatch
                            findGame={findGame}
                            gameSettings={gameSettings}
                            setGameSettings={setGameSettings}
                            gameFinding={gameFinding}
                        />
                    )}
                </>
            ) : (
                <div className="min-h-screen flex items-center justify-center">Connecting...</div>
            )}
        </div>
    );
};

export default Play;
