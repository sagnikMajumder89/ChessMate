export interface GameSetting {
    time: number;
    increment: number;
    rated: boolean;
}

export interface PlayerDetails {
    id: string;
    uid: string;
    email: string;
    rating: number;
    baseTime: number;
    color: "w" | "b";
    timeConsumed: number;
}

export interface Move {
    from: string;
    to: string;
    promotion?: string;
}

export interface MatchDetails {
    id: string;
    user: PlayerDetails;
    opponent: PlayerDetails;
    fen: string;
    moves: Move[];
    currentTurn: "w" | "b";
    rated: boolean;
    increment: number;
}