import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Timer from "@/components/play/timer";
import { PlayerDetails as IPlayerDetails } from "@/lib/interfaces";

interface PlayerDetailsProps {
    playerDetails: IPlayerDetails;
}

export default function PlayerDetails({ playerDetails }: PlayerDetailsProps) {

    return (
        <div><div className="bg-accent rounded-xl px-4 my-2 flex flex-row justify-between ">
            <div className="flex items-center space-x-2">
                <Avatar>
                    <AvatarImage src={playerDetails.photo} />
                    <AvatarFallback className="border-2">{playerDetails.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-row gap-1 items-center">
                    <span className="font-semibold">
                        {playerDetails.email.split('@')[0]}
                    </span>
                    <span className="text-sm font-semibold">
                        ({playerDetails.rating})
                    </span>
                </div>
            </div>
            <Timer time={10} playerColor={playerDetails.color} />
        </div></div>
    )
}
