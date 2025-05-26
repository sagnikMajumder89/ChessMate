import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameComponent from "@/components/play/GameComponents/GameComponent";
import PlayerComponent from "@/components/play/GameComponents/PlayerComponent";

const moves = ["a1 a2", "a1 a3", "a1 a4", "a1 a5"];

const players = Array.from({ length: 26 }, (_, i) => ({
  name: `Player ${i + 1}`,
  rating: 1200 + i * 100,
}));

export default function GameComponentb() {
  return (
    <div className="md:p-5 rounded-2xl bg-background shadow-md border w-full">
      <Tabs defaultValue="game" className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="w-full flex justify-center bg-muted p-1 rounded-lg">
          <TabsTrigger value="game" className="flex-1 hover:cursor-pointer">
            Game
          </TabsTrigger>
          {/* <TabsTrigger value="players" className="flex-1 hover:cursor-pointer">Players</TabsTrigger> */}
        </TabsList>

        {/* Game Moves Section */}
        <TabsContent value="game">
          <GameComponent moves={moves} />
        </TabsContent>

        {/* Players List Section */}
        <TabsContent value="players">
          <PlayerComponent players={players} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
