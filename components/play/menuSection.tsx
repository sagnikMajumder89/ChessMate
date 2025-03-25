import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoFlag, IoHandLeft } from "react-icons/io5";

const moves = ["a1 a2", "a1 a3", "a1 a4", "a1 a5"];

const players = Array.from({ length: 26 }, (_, i) => ({
    name: `Player ${i + 1}`,
    rating: 1200 + i * 100,
}));

export default function MenuSection() {
    return (
        <div className="p-5 rounded-2xl w-1/2 bg-background shadow-md border">
            <Tabs defaultValue="game" className="w-full">
                {/* Tabs Navigation */}
                <TabsList className="w-full flex justify-center bg-muted p-1 rounded-lg">
                    <TabsTrigger value="game" className="flex-1">Game</TabsTrigger>
                    <TabsTrigger value="players" className="flex-1">Players</TabsTrigger>
                </TabsList>

                {/* Game Moves Section */}
                <TabsContent value="game">
                    <div className="flex flex-col items-start px-3 py-4">
                        <h2 className="text-lg font-semibold">Moves List</h2>
                        <ol className="flex flex-col items-start list-decimal pl-5 text-sm text-muted-foreground mt-2">
                            {moves.map((move, index) => (
                                <li key={index} className="pb-1">{move}</li>
                            ))}
                        </ol>
                        <div className="flex flex-row items-center gap-2 mt-4">
                            <Button variant="destructive" className="flex items-center gap-2">
                                <IoFlag className="w-5 h-5" /> Resign
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <IoHandLeft className="w-5 h-5" /> Offer Draw
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* Players List Section */}
                <TabsContent value="players">
                    <ScrollArea className="h-[250px] w-full rounded-md border p-4">
                        <h2 className="text-lg font-semibold">Players List</h2>
                        <ol className="flex flex-col items-start list-decimal pl-5 text-sm text-muted-foreground mt-2">
                            {players.map((player, index) => (
                                <li key={index} className="pb-1">
                                    <span className="font-medium">{player.name}</span> - {player.rating}
                                </li>
                            ))}
                        </ol>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
}
