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
 * represent where the square appears in the CSS grid. The board below builds
 * a 4×7 serpentine track from top left to bottom right.
 */
const COLORS = [
  "#0284c7",
  "#10b981",
  "#facc15",
  "#f97316",
  "#ec4899",
  "#f1f5f9",
];

const ROWS = 4;
const COLS = 7;

export const BOARD: Square[] = Array.from({ length: ROWS * COLS }, (_, i) => {
  const row = Math.floor(i / COLS);
  const col = row % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);
  return { id: i, row, col, color: COLORS[i % COLORS.length] } as Square;
});

[2, 17, 23].forEach((id) => {
  BOARD[id].type = "star";
});
[8, 9, 10, 11].forEach((id) => {
  BOARD[id].type = "ladder";
});

const SHAPES = [
  "rounded-full",
  "rounded-2xl",
  "rounded-tl-3xl rounded-br-3xl",
  "rounded-tr-3xl rounded-bl-3xl",
  "rounded-3xl",
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
        className="relative p-3 rounded-3xl shadow-lg bg-gradient-to-br from-orange-50 via-rose-50 to-sky-50"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7, 3.5rem)`,
          gridTemplateRows: `repeat(${ROWS}, 3.5rem)`,
          gap: "0.25rem",
        }}
      >
        {BOARD.map((sq) => {
          const shapeClass = SHAPES[sq.id % SHAPES.length];
          return (
            <div
              key={sq.id}
              style={{ gridColumn: sq.col + 1, gridRow: sq.row + 1 }}
              className={`relative flex items-center justify-center border-2 border-gray-700 shadow-sm overflow-hidden text-xs ${shapeClass}`}
            >
            {/* Square visuals */}
            {sq.type === "star" ? (
              <span className="text-red-600 text-2xl">★</span>
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
                className={`absolute inset-0 ${shapeClass}`}
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
        );
        })}
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
