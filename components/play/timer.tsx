import React from "react";
import clsx from "clsx";

interface TimerProps {
    time: number;
    playerColor: "w" | "b";
}

const Timer: React.FC<TimerProps> = ({ time, playerColor }) => {
    return (
        <div
            className={clsx(
                "flex items-center justify-center rounded-md text-[1.4rem] lg:text-[1.8rem] font-semibold w-16 lg:w-20 text-center",
                playerColor === "w" ? "bg-white text-black border border-gray-300" : "bg-black text-white"
            )}
        >
            {time}:00
        </div>
    );
};

export default Timer;
