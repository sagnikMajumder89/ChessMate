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
import LoginAlert from "@/components/auth/LoginAlert";
import { useRouter } from "next/navigation";
let socket: Socket | undefined;

const Play = () => {
    const router = useRouter();
    const [showLoginAlert, setShowLoginAlert] = useState(false);
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
    const onClose = () => {
        router.push("/");
        setShowLoginAlert(false);
    }

    const onLoginClick = () => {
        router.push('/login')
    }

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
            } else {
                setShowLoginAlert(true);
            }
        };

        initialize();

        return () => {
            socket?.disconnect();
        };
    }, [user]);
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
            <LoginAlert show={showLoginAlert} onLoginClick={onLoginClick} onClose={onClose} />
        </div>
    );
};

export default Play;
