import { useState, useEffect, useRef } from 'react'
import Dice from './Dice'
import BoardSquare from './BoardSquare'
import type { Player } from './PlayerSetup'
import type { GamePlayer } from './PlayerToken'

interface Square {
  id: number;
  x: number;
  y: number;
  color?: string;
  type?: "star" | "finish";
}

const TILE = 60;
const BOARD_SIZE = 600;
const MAX_SCALE = 1.3;
const OFFSET = { x: -35, y: -35 };

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


export default function GameBoard({ players }: { players: Player[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>(
    players.map((p) => ({ ...p, position: 0 }))
  );
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const { offsetWidth } = containerRef.current;
        setScale(offsetWidth / BOARD_SIZE);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const move = (roll: number) => {
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

  const rollDice = () => {
    if (winner || rolling) return;
    setRolling(true);
    const interval = setInterval(() => setDice(Math.ceil(Math.random() * 6)), 80);
    setTimeout(() => {
      clearInterval(interval);
      const r = Math.ceil(Math.random() * 6);
      setDice(r);
      move(r);
      setRolling(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-900 to-black p-8">
      <h2 className="text-5xl font-extrabold text-white drop-shadow-xl mb-6">🌟 Plateau de Jeu 🌟</h2>
      <div
        ref={containerRef}
        className="relative rounded-3xl bg-amber-100/80 backdrop-blur-sm shadow-2xl ring-4 ring-amber-300 overflow-hidden w-full"
        style={{
          maxWidth: `${BOARD_SIZE * MAX_SCALE}px`,
          width: 'min(100%, 100vmin)',
          height: 'min(100%, 100vmin)',
          aspectRatio: '1',
          backgroundImage: "url('https://cdn.jsdelivr.net/gh/sonnylazuardi/cdn/wbg/plywood.jpg')",
          backgroundSize: 'cover',
        }}
      >
        {BOARD.map((sq) => (
          <BoardSquare
            key={sq.id}
            square={sq}
            scale={scale}
            players={gamePlayers}
            TILE={TILE}
            OFFSET={OFFSET}
          />
        ))}
      </div>
      <div className="mt-8 text-center space-y-4">
        {!winner ? (
          <>
            <p className="text-3xl text-white">
              Au tour de <span style={{ color: gamePlayers[turn].color }}>{gamePlayers[turn].name}</span>
            </p>
            <button
              onClick={rollDice}
              disabled={rolling}
              className="px-12 py-4 bg-green-500/90 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {rolling ? '...' : 'Lancer le dé'}
            </button>
            <div className="mt-2">
              <Dice value={dice} rolling={rolling} />
            </div>
          </>
        ) : (
          <p className="text-6xl font-extrabold text-yellow-300 animate-bounce">🎉 {winner} gagne !</p>
        )}
      </div>
    </div>
  );
}