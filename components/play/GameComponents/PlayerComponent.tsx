import { ScrollArea } from "@/components/ui/scroll-area";


export default function PlayerComponent({ players }: { players: { name: string, rating: number }[] }) {
    return (
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
    )
}
