"use client";
import { Chessboard } from "react-chessboard";
import { Socket } from "socket.io-client";
import { Chess, Square } from "chess.js";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PlayerDetails from "../Dialogs/PlayerDetails";

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
  const [fen, setFen] = useState(data.fen);
  const gameRef = useRef(new Chess(data.fen));
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [squareStyles, setSquareStyles] = useState<
    Record<string, React.CSSProperties>
  >({});

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
      setSelectedSquare(null);
      setLegalMoves([]);
      setSquareStyles({});
      checkGameOver();
      socket.emit("bot-move", move);
      return true;
    } catch {
      toast.error("Invalid move");
      return false;
    }
  };

  const onSquareClick = (square: string) => {
    const game = gameRef.current;

    if (selectedSquare && legalMoves.includes(square)) {
      const move = game.move({
        from: selectedSquare,
        to: square,
        promotion: "q",
      });

      if (move) {
        setFen(game.fen());
        setSelectedSquare(null);
        setLegalMoves([]);
        setSquareStyles({});
        checkGameOver();
        socket.emit("bot-move", move);
      } else {
        toast.error("Invalid move");
      }
      return;
    }

    const moves = game.moves({ square: square as Square, verbose: true });

    if (moves.length === 0) {
      setSelectedSquare(null);
      setLegalMoves([]);
      setSquareStyles({});
      return;
    }

    const newLegalMoves = moves.map((m) => m.to);
    const highlightStyles: Record<string, React.CSSProperties> = {};
    highlightStyles[square] = { backgroundColor: "#e0e0e0" };
    newLegalMoves.forEach((sq) => {
      highlightStyles[sq] = {
        backgroundColor: "rgba(25,31,36,0.1)",
        backgroundImage:
          "radial-gradient(circle, #808080 40%, transparent 20%)",
        backgroundPosition: "center",
        backgroundSize: "50% 50%",
        backgroundRepeat: "no-repeat",
      };
    });

    setSelectedSquare(square);
    setLegalMoves(newLegalMoves);
    setSquareStyles(highlightStyles);
  };

  useEffect(() => {
    const handleBotMove = (move: {
      from: string;
      to: string;
      promotion: string;
    }) => {
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
      } catch {
        toast.error("Bot move error");
      }
    };

    socket.on("bot-move", handleBotMove);

    return () => {
      socket.off("bot-move", handleBotMove);
    };
  }, [socket]);

  return (
    <div>
      <PlayerDetails
        name="BOT"
        photo="/icons/magnus_bot.webp"
        rating={data.level}
      />
      <Chessboard
        position={fen}
        boardOrientation={data.color === "w" ? "white" : "black"}
        arePiecesDraggable={
          !isGameOver && gameRef.current.turn() === data.color
        }
        onPieceDrop={onDrop}
        customSquareStyles={squareStyles}
        onSquareClick={onSquareClick}
      />
      <PlayerDetails
        name="Player"
        photo="/icons/player_avatar.webp"
        rating={data.level}
      />

      {/* Game Over Dialog */}
      <Dialog open={isGameOver} onOpenChange={() => window.location.reload()}>
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
              onClick={() => window.location.reload()}
            >
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
