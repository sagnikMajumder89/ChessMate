"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerDetailsProps {
  name: string;
  photo: string;
  rating: number;
}

export default function PlayerDetails({
  name,
  photo,
  rating,
}: PlayerDetailsProps) {
  return (
    <div>
      <div className="bg-accent rounded-xl px-4 my-2 flex flex-row justify-between ">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={photo} />
            <AvatarFallback className="border-2">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-row gap-1 items-center">
            <span className="font-semibold">{name}</span>
            <span className="text-sm font-semibold">({rating})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
