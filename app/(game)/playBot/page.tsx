"use client";
import { Chessboard } from "react-chessboard";
import Dialogs from "@/components/playBot/BotComponent/dialogs";
import { useEffect, useState } from "react";
import { Connecting } from "@/components/play/Connecting";
import { useAuth } from "@/lib/auth/authContext";
import { getSocket } from "@/config/socketClient";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

export default function page() {
  const [gameFinding, setGameFinding] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [level, setLevel] = useState(4);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const { user } = useAuth();

  const setupGame = () => {
    setGameFinding(true);
    socket?.emit("find-bot-game", {
      level: level,
      color: "w",
    });
  };

  useEffect(() => {
    const initialize = async () => {
      const token = user ? await user?.getIdToken() : "guest";
      const socket = getSocket(token);
      setSocket(socket);
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
    <div className="flex flex-row items-center justify-center h-full ml-6">
      <div className="w-2/3">
        <Chessboard />
      </div>

      <div className="w-1/2">
        <Dialogs />
      </div>
    </div>
  );
}
