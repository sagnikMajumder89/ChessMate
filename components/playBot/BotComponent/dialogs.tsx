"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

type DialogsProps = {
  setupGame: (level: number, color: string) => void;
};

export default function Dialogs({ setupGame }: DialogsProps) {
  const [level, setLevel] = useState(4);
  const [color, setColor] = useState("w");

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Play vs Bot</h1>

        <div className="mb-6">
          <label htmlFor="level" className="block font-semibold mb-2">
            Select Difficulty Level: <span className="font-bold">{level}</span>
          </label>
          <Slider
            min={1}
            max={20}
            step={1}
            defaultValue={[level]}
            onValueChange={(value) => setLevel(value[0])}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Choose Your Color</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="color"
                value="w"
                checked={color === "w"}
                onChange={() => setColor("w")}
              />
              <span>White</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="color"
                value="b"
                checked={color === "b"}
                onChange={() => setColor("b")}
              />
              <span>Black</span>
            </label>
          </div>
        </div>

        <Button
          onClick={() => setupGame(level, color)}
          className="
    w-full text-white font-semibold py-2 px-4 rounded-lg
    bg-gradient-ai animate-gradient-x
    hover:brightness-110 transition duration-300
    border border-white/20 shadow-lg
  "
        >
          Start Game
        </Button>
      </div>
    </div>
  );
}
