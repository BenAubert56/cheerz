import { useState } from "react";
import type { Player } from "./PlayerSetup";

/**
 * A single square on the board
 */
export type SquareType = "normal" | "star" | "ladder";

export interface Square {
  /** logical index in the path */
  id: number;
  /** zero‑based position in the CSS grid */
  row: number;
  col: number;
  /** background fill for normal squares. Ignored for ladder */
  color?: string;
  /** special behaviour */
  type?: SquareType;
}

/**
 * Board definition – update the coordinates / colours here to match your
 * physical board. The `id` order represents the path order. The `row`/`col`
 * represent where the square appears in the CSS grid. The board below is laid
 * out in a 7×7 grid that roughly follows the S‑shaped track in the photo.
 */
export const BOARD: Square[] = [
  // top left segment – départ
  { id: 0, row: 0, col: 1, color: "#0284c7" },
  { id: 1, row: 0, col: 2, color: "#10b981" },
  { id: 2, row: 0, col: 3, type: "star" },
  { id: 3, row: 0, col: 4, color: "#facc15" },
  { id: 4, row: 1, col: 5, color: "#f97316" },
  { id: 5, row: 2, col: 5, color: "#ec4899" },
  { id: 6, row: 3, col: 4, color: "#0284c7" },
  { id: 7, row: 3, col: 3, color: "#10b981" },
  {
    id: 8,
    row: 3,
    col: 2,
    type: "ladder", // beginning of ladder (goes downwards)
  },
  { id: 9, row: 4, col: 2, type: "ladder" },
  { id: 10, row: 5, col: 2, type: "ladder" },
  { id: 11, row: 6, col: 2, type: "ladder" },
  // bottom left curve
  { id: 12, row: 6, col: 1, color: "#f1f5f9" },
  { id: 13, row: 6, col: 0, color: "#10b981" },
  { id: 14, row: 5, col: 0, color: "#facc15" },
  { id: 15, row: 4, col: 0, color: "#f97316" },
  { id: 16, row: 3, col: 0, color: "#ec4899" },
  { id: 17, row: 2, col: 0, type: "star" },
  { id: 18, row: 1, col: 0, color: "#10b981" },
  // right‑hand climb to arrivée
  { id: 19, row: 1, col: 1, color: "#0284c7" },
  { id: 20, row: 1, col: 2, color: "#ec4899" },
  { id: 21, row: 1, col: 3, color: "#f97316" },
  { id: 22, row: 1, col: 4, color: "#facc15" },
  { id: 23, row: 1, col: 5, type: "star" },
  { id: 24, row: 1, col: 6, color: "#ec4899" },
  { id: 25, row: 2, col: 6, color: "#f97316" },
  { id: 26, row: 3, col: 6, color: "#facc15" },
  { id: 27, row: 4, col: 6, color: "#10b981" },
];

// helper to know last square
const LAST_INDEX = BOARD.length - 1;

interface GamePlayer extends Player {
  position: number;
}

export default function GameBoard({ players }: { players: Player[] }) {
  const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>(
    players.map((p) => ({ ...p, position: 0 })),
  );
  const [current, setCurrent] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  /**
   * Roll the dice, move the current player along the BOARD array.
   */
  const rollDice = () => {
    if (winner) return;
    const roll = Math.ceil(Math.random() * 6);
    setDice(roll);

    setGamePlayers((prev) => {
      const updated = [...prev];
      const currentPlayer = updated[current];
      let newPos = Math.min(currentPlayer.position + roll, LAST_INDEX);

      // handle ladder – simple rule: if you land on a ladder square, jump to the bottom of the ladder (id 11)
      const landedSquare = BOARD[newPos];
      if (landedSquare.type === "ladder") {
        newPos = 11; // bottom of the ladder in this sample board
      }

      updated[current] = { ...currentPlayer, position: newPos };
      return updated;
    });

    setCurrent((prevTurn) => (prevTurn + 1) % gamePlayers.length);
  };

  // check win condition when players move
  if (!winner) {
    const maybeWinner = gamePlayers.find((p) => p.position === LAST_INDEX);
    if (maybeWinner) setWinner(maybeWinner.name);
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Plateau de jeu</h2>

      {/* Board grid */}
      <div
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7, 3.5rem)`,
          gridTemplateRows: `repeat(7, 3.5rem)`,
          gap: "0.25rem",
        }}
      >
        {BOARD.map((sq) => (
          <div
            key={sq.id}
            style={{ gridColumn: sq.col + 1, gridRow: sq.row + 1 }}
            className="relative flex items-center justify-center rounded-md border border-black text-xs"
          >
            {/* Square visuals */}
            {sq.type === "star" ? (
              <span className="text-red-600 text-lg">★</span>
            ) : sq.type === "ladder" ? (
              <div className="w-full h-full flex flex-col justify-between p-1">
                {/* ladder style: 4 rungs */}
                <div className="border-b border-black flex-1" />
                <div className="border-b border-black flex-1" />
                <div className="border-b border-black flex-1" />
                <div className="flex-1" />
              </div>
            ) : (
              <div
                className="absolute inset-0 rounded-sm"
                style={{ backgroundColor: sq.color }}
              />
            )}

            {/* Players on this square */}
            <div className="relative z-10 flex flex-wrap justify-center gap-0.5">
              {gamePlayers
                .filter((p) => p.position === sq.id)
                .map((p) => (
                  <span
                    key={p.name}
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: p.color }}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {!winner && (
        <div className="mt-6 text-center">
          <p className="mb-2">Au tour de {gamePlayers[current].name}</p>
          <button
            onClick={rollDice}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lancer le dé
          </button>
          {dice && <p className="mt-2 text-lg">Dé : {dice}</p>}
        </div>
      )}

      {winner && (
        <p className="mt-6 text-lg font-bold text-green-600">
          🎉 {winner} a gagné !
        </p>
      )}
    </div>
  );
}
