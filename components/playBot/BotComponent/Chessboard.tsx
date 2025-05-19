"use client";
import { Chessboard } from "react-chessboard";
import { Socket } from "socket.io-client";
import { Chess } from "chess.js";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Data = {
  color: string;
  currentTurn: string;
  fen: string;
  id: string;
  level: number;
  moves: string[];
};

type BotChessboardProps = {
  data: Data;
  socket: Socket;
};

export default function BotChessboard({ data, socket }: BotChessboardProps) {
  // Use state for rendering and a ref for event handlers
  const [fen, setFen] = useState(data.fen);
  const gameRef = useRef(new Chess(data.fen));
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<"draw" | "white" | "black" | null>(null);

  const checkGameOver = () => {
    const game = gameRef.current;
    if (game.isGameOver()) {
      setIsGameOver(true);

      if (game.isDraw()) {
        setWinner("draw");
      } else {
        const winnerColor = game.turn() === "w" ? "black" : "white";
        setWinner(winnerColor);
      }
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const move = gameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!move) return false;

      // Update FEN state for rendering
      setFen(gameRef.current.fen());
      checkGameOver();
      socket.emit("bot-move", move);
      return true;
    } catch {
      toast.error("Invalid move");
      return false;
    }
  };

  useEffect(() => {
    const handleBotMove = (move: any) => {
      const { from, to, promotion } = move;
      try {
        const result = gameRef.current.move({
          from,
          to,
          promotion: promotion || "q",
        });

        if (result) {
          setFen(gameRef.current.fen());
          checkGameOver();
        } else {
          toast.error("Invalid bot move");
        }
      } catch (error) {
        toast.error("Bot move error");
      }
    };

    socket.on("bot-move", handleBotMove);

    return () => {
      socket.off("bot-move", handleBotMove);
    };
  }, [socket]);

  return (
    <>
      <Chessboard
        position={fen}
        boardOrientation={data.color === "w" ? "white" : "black"}
        arePiecesDraggable={
          !isGameOver && gameRef.current.turn() === data.color
        }
        onPieceDrop={onDrop}
      />

      {/* Game Over Dialog */}
      <Dialog open={isGameOver}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">Game Over</DialogTitle>
          </DialogHeader>
          <p className="mt-4 text-lg">
            {winner === "draw"
              ? "It's a draw!"
              : `${
                  (winner ?? "").charAt(0).toUpperCase() +
                  (winner ?? "").slice(1)
                } wins!`}
          </p>
          <DialogFooter className="mt-4">
            <Button
              className="px-4 py-2 rounded"
              onClick={() => window.location.reload()} // or reset state
            >
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
