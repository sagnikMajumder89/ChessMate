"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 p-5">
      <div>
        <Chessboard
          arePiecesDraggable={false}
        />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Play Chess on the best website for free</h1>
        <p className="text-lg mt-2">
          The #1 chess community with +30 million members around the world.
        </p>
        <div className="flex flex-col px-5 py-3 gap-5">
          <Button className="h-fit" onClick={() => router.push("/play")}>
            <Image
              src="/icons/play.webp"
              alt="Play"
              width={40}
              height={40} />
            <div className="flex flex-col items-start">
              <p className="text-lg">
                Play Online
              </p>
              <span className="text-muted-foreground text-[0.6rem] lg:text-[1rem]">
                Play chess with random people
              </span>
            </div>
          </Button>
          <Button className="h-fit">
            <Image
              src="/icons/robot.webp"
              alt="Play"
              width={40}
              height={40} />
            <div className="flex flex-col items-start">
              <p className="text-lg">
                Play Bots
              </p>
              <span className="text-muted-foreground text-[0.6rem] lg:text-[1rem]">
                Play chess with computer bots
              </span>
            </div>
          </Button>

        </div>
      </div>
    </div>
  );
}
