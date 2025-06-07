import redis from "../db/redis";

type TimeType = {
  w: number;
  b: number;
  currentTurn: "w" | "b";
  baseTime: number;
  timeStamp: number;
};

export const getCurrentTime = async (gameId: string): Promise<TimeType> => {
  const key = `time:${gameId}`;
  const time = await redis.get(key);

  if (!time) {
    throw new Error(`Time not found for gameId: ${gameId}`);
  }

  return JSON.parse(time) as TimeType;
};

export const setCurrentTime = async (gameId: string, time: TimeType) => {
  const key = `time:${gameId}`;
  await redis.set(key, JSON.stringify(time));
};
