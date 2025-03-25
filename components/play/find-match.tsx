"use client";

import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GameSetting } from "@/lib/interfaces";
import { ChevronDown } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import Lottie from "lottie-react";
import chessLoader from "@/public/json/chess_loader.json";

interface FindMatchProps {
    findGame: () => void;
    gameSettings: GameSetting;
    setGameSettings: (settings: GameSetting) => void;
    gameFinding: boolean;
}

const timeOptions = [
    { label: "3 mins", value: 3 },
    { label: "10 mins", value: 10 },
];

export default function FindMatch({ findGame, gameSettings, setGameSettings, gameFinding }: FindMatchProps) {
    const boardWrapperRef = useRef<HTMLDivElement>(null);
    const [boardSize, setBoardSize] = useState(400);

    useEffect(() => {
        const updateBoardSize = () => {
            if (boardWrapperRef.current) {
                const width = boardWrapperRef.current.clientWidth;
                const newSize = Math.min(width, 500);
                setBoardSize(newSize);
            }
        };

        updateBoardSize();
        window.addEventListener('resize', updateBoardSize);

        return () => window.removeEventListener('resize', updateBoardSize);
    }, []);

    return (
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:items-center gap-6 w-full min-h-screen mx-auto p-4 relative">
            {/* Overlay during game finding */}
            {gameFinding && (
                <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-48 h-48 mx-auto">
                            <Lottie
                                animationData={chessLoader}
                                loop={true}
                                className="w-full h-full"
                            />
                        </div>
                        <p className="text-lg font-medium">Finding your opponent...</p>
                        <p className="text-sm text-muted-foreground">
                            Searching for players with similar settings
                        </p>
                    </div>
                </div>
            )}

            <div
                ref={boardWrapperRef}
                className="overflow-hidden aspect-square w-full"
            >
                <Chessboard
                    arePiecesDraggable={false}
                    boardWidth={boardSize}
                    customBoardStyle={{
                        borderRadius: 10,
                    }}
                />
            </div>

            <div className="flex flex-col gap-6">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Game Settings</h2>
                    <p className="text-sm text-muted-foreground">
                        Configure your match preferences
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Time Control</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                        disabled={gameFinding}
                                    >
                                        {gameSettings.time} min{gameSettings.time !== 1 ? "s" : ""}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                                    {timeOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => setGameSettings({ ...gameSettings, time: option.value })}
                                            disabled={gameFinding}
                                        >
                                            {option.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-md">
                            <label htmlFor="rated-game" className="text-sm font-medium">
                                Rated Game
                            </label>
                            <Switch
                                id="rated-game"
                                checked={gameSettings.rated}
                                onCheckedChange={(checked) => setGameSettings({ ...gameSettings, rated: checked })}
                                disabled={gameFinding}
                            />
                        </div>
                    </div>

                    <Button
                        size="lg"
                        onClick={findGame}
                        className="w-full"
                        disabled={gameFinding}
                    >
                        {gameFinding ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-pulse">Searching...</span>
                            </span>
                        ) : (
                            "Find Match"
                        )}
                    </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                    <p>Matchmaking will find you an opponent with similar settings</p>
                </div>
            </div>
        </div>
    );
}