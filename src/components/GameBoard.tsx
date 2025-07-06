import { useState } from "react";
import type { Player } from "./PlayerSetup";

interface Square {
  id: number;
  x: number;
  y: number;
  color?: string;
  type?: "star" | "finish";
}

const SIZE = 600;
const TILE = 60;
const R = 18;

export const BOARD: Square[] = [
  { id: 0, x: 85, y: 95, color: "#0ea5e9" },
  { id: 1, x: 145, y: 97, color: "#10b981" },
  { id: 2, x: 205, y: 110, color: "#84cc16" },
  { id: 3, x: 265, y: 130, type: "star" },
  { id: 4, x: 330, y: 160, color: "#f59e0b" },
  { id: 5, x: 385, y: 200, color: "#f97316" },
  { id: 6, x: 425, y: 255, color: "#ec4899" },
  { id: 7, x: 410, y: 310, color: "#3b82f6" },
  { id: 8, x: 350, y: 335, color: "#10b981" },
  { id: 9, x: 290, y: 345, color: "#f59e0b" },
  { id: 10, x: 230, y: 340, color: "#f97316" },
  { id: 11, x: 175, y: 320, color: "#ec4899" },
  { id: 12, x: 120, y: 360, type: "star" },
  { id: 13, x: 115, y: 440, color: "#3b82f6" },
  { id: 14, x: 140, y: 500, color: "#10b981" },
  { id: 15, x: 200, y: 540, color: "#f59e0b" },
  { id: 16, x: 265, y: 565, color: "#f97316" },
  { id: 17, x: 330, y: 575, color: "#ec4899" },
  { id: 18, x: 395, y: 570, color: "#3b82f6" },
  { id: 19, x: 460, y: 550, color: "#10b981" },
  { id: 20, x: 515, y: 520, color: "#f59e0b" },
  { id: 21, x: 555, y: 480, color: "#f97316" },
  { id: 22, x: 585, y: 420, type: "star" },
  { id: 23, x: 570, y: 360, color: "#10b981" },
  { id: 24, x: 555, y: 300, color: "#3b82f6" },
  { id: 25, x: 560, y: 235, color: "#ec4899" },
  { id: 26, x: 565, y: 170, color: "#f97316" },
  { id: 27, x: 570, y: 110, color: "#ec4899", type: "finish" },
];

const LAST = BOARD.length - 1;

function angle(p1: Square, p2: Square) {
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}

function buildClip(angleDeg: number) {
  const fw = 90;
  const bw = 75;
  const left = angleDeg > 90 || angleDeg < -90;
  if (left) {
    return `polygon(${100 - bw}% 0, 100% 0, 100% 100%, ${100 - fw}% 100%, ${100 - fw}% 85%, ${bw}% 15%, ${bw}% 0)`;
  }
  return `polygon(0 0, ${fw}% 0, ${fw}% 15%, ${100 - bw}% 85%, ${100 - bw}% 100%, 0 100%)`;
}

interface GamePlayer extends Player {
  position: number;
}

export default function GameBoard({ players }: { players: Player[] }) {
  const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>(
    players.map((p) => ({ ...p, position: 0 }))
  );
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  function move(roll: number) {
    setGamePlayers((prev) => {
      const updated = [...prev];
      const current = updated[turn];
      const newPos = Math.min(current.position + roll, LAST);
      updated[turn] = { ...current, position: newPos };
      if (newPos === LAST) setWinner(current.name);
      return updated;
    });
    setTurn((t) => (t + 1) % gamePlayers.length);
  }

  function rollDice() {
    if (winner) return;
    const r = Math.ceil(Math.random() * 6);
    setDice(r);
    move(r);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
      <h2 className="text-3xl font-bold text-white">Plateau de jeu</h2>
      <div
        className="relative rounded-xl bg-amber-50 shadow-lg ring-4 ring-amber-200"
        style={{ width: SIZE, height: SIZE, backgroundImage: "url('https://cdn.jsdelivr.net/gh/sonnylazuardi/cdn/wbg/plywood.jpg')", backgroundSize: "cover" }}
      >
        {BOARD.map((sq, i) => {
          const prev = BOARD[i - 1] ?? sq;
          const next = BOARD[i + 1] ?? sq;
          const dirAngle = angle(prev, next);
          const clipPath = buildClip(dirAngle);
          return (
            <div
              key={sq.id}
              style={{
                position: "absolute",
                width: TILE,
                height: TILE,
                left: sq.x,
                top: sq.y,
                transform: `translate(-50%, -50%) rotate(${dirAngle}deg)`,
              }}
              className="flex items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              {sq.type === "star" ? (
                <span className="text-yellow-400 text-4xl select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] animate-pulse">★</span>
              ) : (
                <div
                  className="w-full h-full shadow-md transition-colors duration-300"
                  style={{
                    backgroundColor: sq.color,
                    borderRadius: R,
                    clipPath,
                  }}
                />
              )}
              <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-[2px] z-10">
                {gamePlayers
                  .filter((p) => p.position === sq.id)
                  .map((p) => (
                    <span
                      key={p.name}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold transition-transform duration-300 hover:scale-125"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0)}
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
      {!winner ? (
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-white">
            Au tour de <span style={{ color: gamePlayers[turn].color }}>{gamePlayers[turn].name}</span>
          </p>
          <button
            onClick={rollDice}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-95 transition-transform duration-300 shadow-lg"
          >
            Lancer le dé
          </button>
          {dice && <p className="text-xl font-bold text-white">Dé : {dice}</p>}
        </div>
      ) : (
        <p className="text-3xl font-bold text-yellow-300 animate-bounce">🎉 {winner} a gagné !</p>
      )}
    </div>
  );
}
