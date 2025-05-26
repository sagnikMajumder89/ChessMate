"use client";
import { Chessboard } from "react-chessboard";
import Dialogs from "@/components/playBot/BotComponent/dialogs";
import { useEffect, useState } from "react";
import { Connecting } from "@/components/play/Connecting";
import { useAuth } from "@/lib/auth/authContext";
import { getSocket } from "@/config/socketClient";
import type { Socket } from "socket.io-client";
import BotChessboard from "@/components/playBot/BotComponent/Chessboard";
import GameComponent from "@/components/playBot/Dialogs/GameComponent";
let socket: Socket | undefined;

export default function Page() {
  const [gameFinding, setGameFinding] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"w" | "b">("w");
  const { user } = useAuth();

  const setupGame = (level, color) => {
    setGameFinding(true);
    socket?.emit("find-bot-game", {
      level,
      color,
    });
  };

  useEffect(() => {
    const initialize = async () => {
      const token = user ? await user?.getIdToken() : "guest";
      socket = getSocket(token);
      if (socket) {
        socket.on("connect", () => {
          setIsConnected(true);
        });
        socket.on("connect_error", () => {
          console.error("Error connecting to server");
        });
        socket.on("disconnect", () => {
          setIsConnected(false);
        });
        socket.on("bot-game-started", (data) => {
          setGameFinding(false);
          setMatchDetails(data);
          setBoardOrientation(data.color);
        });
      } else {
        console.error("Socket is null");
      }
    };
    initialize();
  });

  if (!isConnected) {
    return <Connecting />;
  }
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-full px-2">
      <div className="w-full lg:w-1/2">
        {matchDetails ? (
          <BotChessboard
            data={matchDetails}
            socket={socket!}
            boardOrientation={boardOrientation}
          />
        ) : (
          <Chessboard arePiecesDraggable={false} />
        )}
      </div>

      <div className="lg:w-1/2">
        {gameFinding ? (
          <Connecting />
        ) : matchDetails ? (
          <GameComponent setBoardOrientation={setBoardOrientation} />
        ) : (
          <Dialogs setupGame={setupGame} />
        )}
      </div>
    </div>
  );
}
