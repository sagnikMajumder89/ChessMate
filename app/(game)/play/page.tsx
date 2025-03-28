"use client";
import Chessboard from "@/components/play/chessboard";
import FindMatch from "@/components/play/find-match";
import { useAuth } from "@/lib/auth/authContext";
import { GameSetting } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { MatchDetails } from "@/lib/interfaces";
import { getSocket } from "@/config/socketClient";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
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

    const findGame = async () => {
        setGameFinding(true);

        setMatchDetails(null);
        if (socket) {
            socket.emit("find-game", { ...gameSettings });
        }
    };

    useEffect(() => {
        const initialize = async () => {
            if (user) {
                const token = await user.getIdToken();

                socket = getSocket(token);

                socket.on("connect", () => {
                    setIsConnected(true);
                });

                socket.on("connect_error", () => {
                    toast.error("Error connecting to server");
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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to play.</p>
            </div>
        );
    }

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
