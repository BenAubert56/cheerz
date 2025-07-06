import PlayerToken from './PlayerToken'
import type { GamePlayer } from './PlayerToken'

interface Square {
  id: number
  x: number
  y: number
  color?: string
  type?: 'star' | 'finish'
}

interface Props {
  square: Square
  scale: number
  players: GamePlayer[]
  TILE: number
  OFFSET: { x: number; y: number }
}

export default function BoardSquare({ square: sq, scale, players, TILE, OFFSET }: Props) {
  const tokens = players.filter((p) => p.position === sq.id)
  return (
    <div
      style={{
        position: 'absolute',
        width: TILE * scale,
        height: TILE * scale,
        left: (sq.x + OFFSET.x) * scale,
        top: (sq.y + OFFSET.y) * scale,
        transform: 'translate(-50%, -50%)'
      }}
      className="flex items-center justify-center transition-transform duration-300 hover:scale-110"
    >
      {sq.type === 'star' ? (
        <span className="text-yellow-300 text-5xl drop-shadow-md animate-pulse">★</span>
      ) : (
        <div
          className="w-full h-full border-2 border-white shadow-lg"
          style={{
            background: `linear-gradient(145deg, ${sq.color}33, ${sq.color})`,
            borderRadius: '50% 20% 50% 20%'
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center gap-1 z-20">
        {tokens.map((p) => (
          <PlayerToken key={p.name} player={p} scale={scale} />
        ))}
      </div>
    </div>
  )
}
