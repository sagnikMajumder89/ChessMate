"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface TimerProps {
    baseTime: number;
    playerColor: "w" | "b";
    timeConsumed: number;
    isActive: boolean;
    socket: Socket;
}

const Timer: React.FC<TimerProps> = ({ baseTime, socket, timeConsumed, isActive, playerColor }) => {
    const [remainingTime, setRemainingTime] = useState(baseTime - Math.floor(timeConsumed / 1000));
    useEffect(() => {
        const timeSyncHandler = (time: number) => {
            let remTime = baseTime - Math.floor(time[playerColor] / 1000);
            if (remTime < 0) remTime = 0;
            setRemainingTime(remTime);
        };

        socket.on("time-sync", timeSyncHandler);

        if (!isActive) return;
        const interval = setInterval(() => {
            setRemainingTime((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => {
            clearInterval(interval);
            socket.off("time-sync", timeSyncHandler);
        };
    }, [isActive, baseTime, playerColor, socket]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
    return (
        <div
            className={clsx(
                "flex items-center justify-center rounded-sm m-1 text-[1rem] lg:text-[1.45rem] font-semibold w-16 lg:w-20 text-center",
                playerColor === "w" ? "bg-white text-black border border-gray-300" : "bg-black text-white"
            )}>
            {formatTime(remainingTime)}
        </div>
    );
};

export default Timer;
