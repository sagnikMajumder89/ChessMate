"use client";
import { Chessboard as ChessboardR } from "react-chessboard";
import PlayerDetails from "./playerDetails";
import MenuSection from "./menuSection";
import { MatchDetails, Move } from "../../lib/interfaces";
import { Socket } from "socket.io-client";
import { Chess, Square } from "chess.js";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface ChessboardProps {
  matchDetails: MatchDetails;
  socket: Socket;
}

export default function Chessboard({ matchDetails, socket }: ChessboardProps) {
  const [fen, setFen] = useState(matchDetails.fen);
  const gameRef = useRef(new Chess(matchDetails.fen));
  const playerColour = matchDetails.user.color;

  const [winner, setWinner] = useState<"draw" | "white" | "black" | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [squareStyles, setSquareStyles] = useState<
    Record<string, React.CSSProperties>
  >({});
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    matchDetails.moves.length > 0
      ? {
          from: matchDetails.moves.at(-1)!.from,
          to: matchDetails.moves.at(-1)!.to,
        }
      : null
  );

  const game = gameRef.current;

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
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) {
      toast.error("Invalid move");
      return false;
    }

    setFen(game.fen());
    setLastMove({ from: move.from, to: move.to });
    socket.emit("move", move);
    setSelectedSquare(null);
    setLegalMoves([]);
    setSquareStyles({});
    checkGameOver();
    return true;
  };

  const onSquareClick = (square: string) => {
    if (selectedSquare && legalMoves.includes(square)) {
      onDrop(selectedSquare, square);
      return;
    }

    const piece = game.get(square as Square);
    if (!piece || piece.color !== playerColour) {
      setSelectedSquare(null);
      setLegalMoves([]);
      setSquareStyles({});
      return;
    }

    const moves = game.moves({ square: square as Square, verbose: true });
    const destinations = moves.map((m) => m.to);

    const newStyles: Record<string, React.CSSProperties> = {
      [square]: {
        backgroundColor: "#e0e0e0",
      },
    };

    destinations.forEach((sq) => {
      newStyles[sq] = {
        backgroundColor: "rgba(25,31,36,0.1)",
        backgroundImage:
          "radial-gradient(circle, #808080 40%, transparent 20%)",
        backgroundPosition: "center",
        backgroundSize: "50% 50%",
        backgroundRepeat: "no-repeat",
      };
    });

    setSelectedSquare(square);
    setLegalMoves(destinations);
    setSquareStyles(newStyles);
  };

  useEffect(() => {
    const handleIncomingMove = (move: Move) => {
      try {
        game.move(move);
        setFen(game.fen());
        setLastMove({ from: move.from, to: move.to });
        setSelectedSquare(null);
        setLegalMoves([]);
        setSquareStyles({});
        checkGameOver();
      } catch {
        toast.error("Invalid move received");
      }
    };

    socket.on("move", handleIncomingMove);
    socket.on("error", (error: string) => toast.error(error));

    return () => {
      socket.off("move", handleIncomingMove);
    };
  }, [socket]);

  const isDraggablePiece = ({ piece }: { piece: string }) =>
    piece[0] === playerColour;

  const lastMoveStyles =
    lastMove != null
      ? {
          [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
          [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        }
      : {};

  const mergedSquareStyles = {
    ...squareStyles,
    ...lastMoveStyles,
  };

  return (
    <div className="flex flex-col h-full w-full lg:flex-row justify-around items-center">
      <div className="w-full lg:w-1/2">
        <PlayerDetails
          socket={socket}
          playerDetails={matchDetails.opponent}
          isActive={game.turn() === matchDetails.opponent.color}
        />
        <div className="w-full aspect-square">
          <ChessboardR
            position={fen}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            boardOrientation={playerColour === "w" ? "white" : "black"}
            isDraggablePiece={isDraggablePiece}
            customSquareStyles={mergedSquareStyles}
          />
        </div>
        <PlayerDetails
          socket={socket}
          playerDetails={matchDetails.user}
          isActive={game.turn() === matchDetails.user.color}
        />
      </div>
      <MenuSection />
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
