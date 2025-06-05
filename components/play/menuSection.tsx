import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameComponent from "./GameComponents/GameComponent";
// import PlayerComponent from "./GameComponents/PlayerComponent";
import { Socket } from "socket.io-client";
import { Move } from "@/lib/interfaces";

const moves = ["a1 a2", "a1 a3", "a1 a4", "a1 a5"];

interface MenuSectionProps {
  gameId: string;
  socket: Socket;
  moves: Move[];
  playerId: string;
}

export default function MenuSection({
  gameId,
  socket,
  moves,
  playerId,
}: MenuSectionProps) {
  return (
    <div className="p-5 rounded-2xl w-full md:w-1/2 bg-background shadow-md border">
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
          <GameComponent
            moves={moves}
            gameId={gameId}
            socket={socket}
            playerId={playerId}
          />
        </TabsContent>

        {/* Players List Section */}
        {/* <TabsContent value="players">
                    <PlayerComponent players={players} />
                </TabsContent> */}
      </Tabs>
    </div>
  );
}
