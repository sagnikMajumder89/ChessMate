"use client";
import { Chessboard as ChessboardR } from "react-chessboard";
import PlayerDetails from "./playerDetails";
import MenuSection from "./menuSection";
import { MatchDetails, Move } from "../../lib/interfaces";
import { Socket } from "socket.io-client";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ChessboardProps {
    matchDetails: MatchDetails;
    socket: Socket;
}

export default function Chessboard({ matchDetails, socket }: ChessboardProps) {
    const [game, setGame] = useState(new Chess(matchDetails.fen));
    const playerColour = matchDetails.user.color;
    const initialLastMove =
        matchDetails.moves.length > 0
            ? {
                from: matchDetails.moves[matchDetails.moves.length - 1].from,
                to: matchDetails.moves[matchDetails.moves.length - 1].to,
            }
            : null;
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(initialLastMove);

    const onDrop = (sourceSquare: string, targetSquare: string) => {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        if (move === null) {
            toast.error("Invalid move");
            return false;
        }
        setLastMove({ from: sourceSquare, to: targetSquare });
        setGame(new Chess(game.fen()));
        socket.emit("move", move);
        return true;
    };
    const isDraggablePiece = ({ piece }: { piece: string }) => {
        const pieceColor = piece[0];
        return pieceColor === playerColour;
    };
    useEffect(() => {
        const handleIncomingMove = (move: Move) => {
            try {
                game.move(move);
                setLastMove({ from: move.from, to: move.to });
                setGame(new Chess(game.fen()));
            } catch {
                toast.error("Invalid move received");
            }
        };

        socket.on("move", handleIncomingMove);
        // IMPLEMENT
        socket.on("gameOver", () => {
            toast.error("Game Over");
        });
        socket.on("error", (error: string) => {
            toast.error(error);
        })
        return () => {
            socket.off("move", handleIncomingMove);
        };
    }, [socket, game]);

    const customSquareStyles = lastMove
        ? {
            [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.6)" },
            [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.6)" },
        }
        : {};

    return (
        <div className="flex flex-col h-full w-full lg:flex-row justify-around items-center">
            <div className="w-full lg:w-1/2">
                <PlayerDetails socket={socket} playerDetails={matchDetails.opponent} isActive={game.turn() == matchDetails.opponent.color} />
                <div className="w-full aspect-square">
                    <ChessboardR
                        position={game.fen()}
                        onPieceDrop={onDrop}
                        boardOrientation={playerColour === "w" ? "white" : "black"}
                        isDraggablePiece={isDraggablePiece}
                        customSquareStyles={customSquareStyles}
                    />
                </div>
                <PlayerDetails socket={socket} playerDetails={matchDetails.user} isActive={game.turn() == matchDetails.user.color} />
            </div>
            <MenuSection />
        </div>
    );
}