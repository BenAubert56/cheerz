import { useState, useEffect, useRef } from 'react'
import Dice from './Dice'
import BoardSquare from './BoardSquare'
import RockPaperScissors from './RockPaperScissors'
import type { Player } from './PlayerSetup'
import type { GamePlayer } from './PlayerToken'

interface Square {
  id: number;
  x: number;
  y: number;
  color?: string;
  type?: "star" | "finish";
}

const TILE_DESKTOP = 60;
const TILE_MOBILE = 40;
const BOARD_SIZE = 600;
const MAX_SCALE = 1.3;
const OFFSET = { x: -35, y: -35 };

export const BOARD_DESKTOP: Square[] = [
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


function createMobileBoard(): Square[] {
  const layout: Square[] = []
  const spacingX = 100
  const spacingY = 60
  const offsetX = 80
  const offsetY = 40
  for (let i = 0; i < 24; i++) {
    const row = Math.floor(i / 4)
    const colIndex = i % 4
    const col = row % 2 === 0 ? colIndex : 3 - colIndex
    layout.push({
      ...BOARD_DESKTOP[i],
      x: offsetX + col * spacingX,
      y: offsetY + row * spacingY
    })
  }
  for (let i = 24; i < BOARD_DESKTOP.length; i++) {
    const vert = i - 24
    layout.push({
      ...BOARD_DESKTOP[i],
      x: offsetX + 3 * spacingX,
      y: offsetY + (6 + vert) * spacingY
    })
  }
  return layout
}

export const BOARD_MOBILE = createMobileBoard()


export default function GameBoard({ players }: { players: Player[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false)
  const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>(
    players.map((p) => ({ ...p, position: 0 }))
  );
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [skip, setSkip] = useState(() => players.map(() => 0));
  const [rps, setRps] = useState<{ a: number; b: number } | null>(null);

  const board = isMobile ? BOARD_MOBILE : BOARD_DESKTOP
  const TILE = isMobile ? TILE_MOBILE : TILE_DESKTOP
  const LAST = board.length - 1

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const { offsetWidth } = containerRef.current
        setScale(offsetWidth / BOARD_SIZE)
      }
      setIsMobile(window.innerWidth <= 767)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const advanceTurn = () => {
    setSkip((prev) => {
      const updated = [...prev];
      let next = (turn + 1) % updated.length;
      while (updated[next] > 0) {
        updated[next] -= 1;
        next = (next + 1) % updated.length;
      }
      setTurn(next);
      return updated;
    });
  };

  const handleRpsDone = (loser: 0 | 1 | null) => {
    if (!rps) return;
    if (loser !== null) {
      const index = loser === 0 ? rps.a : rps.b;
      setSkip((s) => {
        const copy = [...s];
        copy[index] += 1;
        return copy;
      });
    }
    setRps(null);
    advanceTurn();
  };

  const move = (roll: number) => {
    const current = gamePlayers[turn];
    const newPos = Math.min(current.position + roll, LAST);
    const updatedPlayers = [...gamePlayers];
    updatedPlayers[turn] = { ...current, position: newPos };
    if (newPos === LAST) setWinner(current.name);
    setGamePlayers(updatedPlayers);

    const other = updatedPlayers.findIndex(
      (p, i) => i !== turn && p.position === newPos
    );
    if (other !== -1) {
      setRps({ a: turn, b: other });
    } else {
      advanceTurn();
    }
  };

  const rollDice = () => {
    if (winner || rolling || rps) return;
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
        className="relative rounded-3xl bg-amber-100/80 backdrop-blur-sm ring-4 ring-amber-300 overflow-hidden w-full lg:shadow-2xl lg:aspect-square"
        style={{
          maxWidth: `${BOARD_SIZE * MAX_SCALE}px`,
          height: BOARD_SIZE * scale,
          backgroundImage:
            "url('https://cdn.jsdelivr.net/gh/sonnylazuardi/cdn/wbg/plywood.jpg')",
          backgroundSize: 'cover',
        }}
      >
        {board.map((sq) => (
          <BoardSquare
            key={sq.id}
            square={sq}
            scale={scale}
            players={gamePlayers}
            TILE={TILE}
            OFFSET={OFFSET}
            mobile={isMobile}
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
              disabled={rolling || !!rps}
              className="px-12 py-4 bg-green-500/90 lg:hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-transform lg:active:scale-95 disabled:opacity-50"
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
      {rps && (
        <RockPaperScissors
          players={[gamePlayers[rps.a], gamePlayers[rps.b]]}
          onDone={handleRpsDone}
        />
      )}
    </div>
  );
}
