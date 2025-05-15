import { ScrollArea } from "@/components/ui/scroll-area";
import ChatComponent from "./ChatComponent";
import { Button } from "@/components/ui/button";
import { IoFlag, IoHandLeft } from "react-icons/io5";

export default function GameComponent({ moves }: { moves: string[] }) {
    return (
        <div className="flex flex-col items-start px-3 py-4">
            <h2 className="text-lg font-semibold">Moves List</h2>
            <ScrollArea className="h-[250px] w-full rounded-md border p-4">
                <ol className="flex flex-col items-start list-decimal pl-5 text-sm text-muted-foreground mt-2">
                    {moves.map((move, index) => (
                        <li key={index} className="pb-1">{move}</li>
                    ))}
                </ol>
            </ScrollArea>
            <div className="flex flex-row items-center gap-2 mt-4">
                <Button variant="destructive" className="flex items-center gap-2">
                    <IoFlag className="w-5 h-5" /> Resign
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                    <IoHandLeft className="w-5 h-5" /> Offer Draw
                </Button>
            </div>

            {/* Chat Component */}
            <ChatComponent />
        </div>
    );
}
