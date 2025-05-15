"use client";
import { Chessboard } from "react-chessboard";
import Dialogs from "@/components/playBot/BotComponent/dialogs";
export default function page() {
  return (
    <div className="flex flex-row items-center justify-center h-full ml-6">
      <div className="w-2/3">
        <Chessboard />
      </div>

      <div className="w-1/2">
        <Dialogs />
      </div>
    </div>
  );
}
