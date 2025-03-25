import { Chessboard as ChessboardR } from "react-chessboard";
import PlayerDetails from "./playerDetails";
import MenuSection from "./menuSection";


export default function Chessboard() {
    return (
        <div className="flex flex-col h-full w-full lg:flex-row justify-around items-center">
            <div className="w-full lg:w-1/2">
                <PlayerDetails playerColor="b" />
                <div className="w-full aspect-square">
                    <ChessboardR
                        arePiecesDraggable={true}
                    />
                </div>
                <PlayerDetails playerColor="w" />
            </div>
            <MenuSection />
        </div>
    );
}