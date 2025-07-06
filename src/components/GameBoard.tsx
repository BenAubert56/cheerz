import { useState } from "react";
import type { Player } from "./PlayerSetup";

/** ***********************************************************
 *  Utility types & constants
 *************************************************************/
interface Square {
  /** index in the path */
  id: number;
  /** absolute X (px) inside the board container */
  x: number;
  /** absolute Y (px) inside the board container */
  y: number;
  /** degrees for a tiny rotation so the tile looks hand‑drawn */
  rotation?: number;
  /** normal coloured tile */
  color?: string;
  /** special tile */
  type?: "star" | "finish";
}

const SIZE = 600; // board outer box (px)
const TILE = 56; // tile size (px)

/**
 * BOARD positions were eyeballed from the photo so the curve & colours
 * match the wooden board pretty closely. Adjust `x`, `y` or `rotation` if
 * you want to fine‑tune later – the game logic does not depend on them.
 */
export const BOARD: Square[] = [
  // Départ
  { id: 0, x: 80, y: 90, color: "#0ea5e9", rotation: -8 },
  { id: 1, x: 140, y: 95, color: "#0ea5e9", rotation: -6 },
  { id: 2, x: 200, y: 105, color: "#65a30d", rotation: -4 },
  { id: 3, x: 270, y: 125, type: "star" },
  { id: 4, x: 340, y: 150, color: "#facc15", rotation: 12 },
  { id: 5, x: 390, y: 190, color: "#f97316", rotation: 22 },
  { id: 6, x: 430, y: 245, color: "#f472b6", rotation: 32 },

  // retour vers la gauche (rangée du milieu)
  { id: 7, x: 415, y: 305, color: "#0ea5e9", rotation: 18 },
  { id: 8, x: 360, y: 330, color: "#65a30d", rotation: 10 },
  { id: 9, x: 300, y: 340, color: "#facc15", rotation: 4 },
  { id: 10, x: 240, y: 335, color: "#f97316", rotation: -4 },
  { id: 11, x: 185, y: 310, color: "#f472b6", rotation: -14 },
  { id: 12, x: 130, y: 355, type: "star" },

  // grand virage vers le bas (côté gauche)
  { id: 13, x: 120, y: 435, color: "#0ea5e9", rotation: -28 },
  { id: 14, x: 145, y: 495, color: "#65a30d", rotation: -18 },
  { id: 15, x: 200, y: 535, color: "#facc15", rotation: -8 },
  { id: 16, x: 265, y: 560, color: "#f97316", rotation: 4 },
  { id: 17, x: 330, y: 570, color: "#f472b6", rotation: 8 },
  { id: 18, x: 395, y: 565, color: "#0ea5e9", rotation: 12 },
  { id: 19, x: 460, y: 550, color: "#65a30d", rotation: 16 },
  { id: 20, x: 515, y: 520, color: "#facc15", rotation: 20 },
  { id: 21, x: 555, y: 480, color: "#f97316", rotation: 28 },

  // remontée verticale côté droit jusqu’à l’arrivée
  { id: 22, x: 585, y: 420, type: "star" },
  { id: 23, x: 570, y: 360, color: "#65a30d" },
  { id: 24, x: 555, y: 300, color: "#0ea5e9" },
  { id: 25, x: 560, y: 235, color: "#f472b6" },
  { id: 26, x: 565, y: 170, color: "#f97316" },
  { id: 27, x: 570, y: 110, color: "#f472b6", type: "finish" },
];

const LAST = BOARD.length - 1;

/** ***********************************************************
 *  Main component
 *************************************************************/
interface GamePlayer extends Player {
  position: number; // index in BOARD
}

export default function GameBoard({ players }: { players: Player[] }) {
  const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>(
    players.map((p) => ({ ...p, position: 0 })),
  );
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const rollDice = () => {
    if (winner) return;
    const roll = Math.ceil(Math.random() * 6);
    setDice(roll);

    setGamePlayers((prev) => {
      const updated = [...prev];
      const current = updated[turn];
      const newPos = Math.min(current.position + roll, LAST);
      updated[turn] = { ...current, position: newPos };
      if (newPos === LAST) setWinner(current.name);
      return updated;
    });

    setTurn((t) => (t + 1) % gamePlayers.length);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Plateau de jeu</h2>

      {/*  BOARD  */}
      <div
        className="relative border rounded-md shadow-lg bg-slate-50"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* squares */}
        {BOARD.map((sq) => (
          <div
            key={sq.id}
            style={{
              position: "absolute",
              width: TILE,
              height: TILE,
              left: sq.x,
              top: sq.y,
              transform: `translate(-50%, -50%) rotate(${sq.rotation ?? 0}deg)`,
            }}
            className="flex items-center justify-center"
          >
            {sq.type === "star" ? (
              <span className="text-red-700 text-4xl leading-none select-none drop-shadow-sm">
                ★
              </span>
            ) : sq.type === "finish" ? (
              <div
                className="w-full h-full rounded-lg ring-2 ring-black border border-white shadow"
                style={{ backgroundColor: sq.color }}
              />
            ) : (
              <div
                className="w-full h-full rounded-lg border border-black/20 shadow-sm"
                style={{ backgroundColor: sq.color }}
              />
            )}

            {/* player tokens on this square */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-[2px] z-10">
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

      {/* controls */}
      {!winner ? (
        <div className="text-center space-y-2">
          <p>
            Au tour de <span style={{ color: gamePlayers[turn].color }}>{gamePlayers[turn].name}</span>
          </p>
          <button
            onClick={rollDice}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lancer le dé
          </button>
          {dice && <p>Dé : {dice}</p>}
        </div>
      ) : (
        <p className="text-xl font-bold text-green-600">🎉 {winner} a gagné !</p>
      )}
    </div>
  );
}
