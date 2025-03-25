import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image";
import Timer from "@/components/play/timer";

interface PlayerDetailsProps {
    playerColor: "w" | "b";
}

export default function PlayerDetails({ playerColor }: PlayerDetailsProps) {
    return (
        <div><div className="bg-accent rounded-xl py-1 lg:py-2 px-4 my-2 flex flex-row justify-between ">
            <div className="flex items-center space-x-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-row gap-2 lg:flex-col lg:gap-0 items-start">
                    <span className="font-semibold">
                        Ssagnik
                    </span>
                    <span className="flex flex-row items-center gap-1">
                        <Image
                            src="/icons/rating-white.png"
                            alt="India"
                            width={16}
                            height={16}
                        />
                        1145
                    </span>
                </div>
            </div>
            <Timer time={10} playerColor={playerColor} />
        </div></div>
    )
}
