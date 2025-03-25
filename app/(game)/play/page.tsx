"use client";
import FindMatch from "@/components/play/find-match";
import { useAuth } from "@/lib/auth/authContext";
import { GameSetting } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";


export interface PlayerDetails {
    id: string;
    uid: string;
    email: string;
    rating: number;
    baseTime: number;
    color: "w" | "b";
    timeConsumed: number;
}


interface MatchDetails {
    id: string;
    user: PlayerDetails;
    opponent: PlayerDetails;
    fen: string;
    moves: string[];
    currentTurn: "w" | "b";
    rated: boolean;
    increment: number;
}

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
                    console.log(payload)
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
        <div className="p-5 text-center w-full">
            {isConnected ? (
                <>
                    {matchDetails ? (
                        <div>
                            <h2>Match Found!</h2>
                            <p>
                                Game ID: <strong>{matchDetails.id}</strong>
                            </p>
                            <p>
                                Your Details: <strong>{matchDetails.user.email}</strong> (Rating: <strong>{matchDetails.user.rating}</strong>)
                            </p>
                            <p>
                                Opponent: <strong>{matchDetails.opponent.email}</strong> (Rating: <strong>{matchDetails.opponent.rating}</strong>)
                            </p>
                            <p>
                                Your color is: <strong>{matchDetails.user.color.toUpperCase()}</strong>
                            </p>
                            <p>
                                Current turn: <strong>{matchDetails.currentTurn.toUpperCase()}</strong>
                            </p>
                            <p>
                                Board state (FEN): <strong>{matchDetails.fen}</strong>
                            </p>
                            <p>
                                Moves: <strong>{matchDetails.moves.join(", ") || "None"}</strong>
                            </p>
                            <p>
                                Game settings: {matchDetails.user.baseTime} minutes, {matchDetails.increment} second increment,{" "}
                                {matchDetails.rated ? "Rated" : "Unrated"}
                            </p>
                            {/* Here you can later render your chess board component */}
                        </div>
                    ) : (
                        <div>
                            <FindMatch
                                findGame={findGame}
                                gameSettings={gameSettings}
                                setGameSettings={setGameSettings}
                                gameFinding={gameFinding}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div>Connecting...</div>
            )}
        </div>
    );
};

export default Play;
