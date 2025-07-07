import { useEffect, useState } from 'react'

export interface PlayerToken {
  name: string
  color: string
  position: number
}

const TILE_COLORS = [
  '#0ea5e9',
  '#10b981',
  '#84cc16',
  '#f59e0b',
  '#f97316',
  '#ec4899',
  '#3b82f6'
]

const STAR_TILES = [3, 12, 22]
const FINISH_TILE = 27

function getPosition(index: number, desktop: boolean) {
  if (desktop) {
    const row = Math.floor(index / 7)
    const col = row % 2 === 0 ? index % 7 : 6 - (index % 7)
    return { row: row + 1, col: col + 1 }
  }
  const row = Math.floor(index / 4)
  const col = row % 2 === 0 ? index % 4 : 3 - (index % 4)
  return { row: row + 1, col: col + 1 }
}

export default function GameBoard({ players }: { players: PlayerToken[] }) {
  const [desktop, setDesktop] = useState(
    typeof window !== 'undefined' && window.matchMedia('(min-width:1024px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width:1024px)')
    const handle = (e: MediaQueryListEvent) => setDesktop(e.matches)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  const tiles = Array.from({ length: 28 }, (_, i) => i)

  return (
    <div className="w-full flex justify-center">
      <div
        className={`relative grid ${desktop ? 'grid-cols-7 grid-rows-4 gap-2' : 'grid-cols-4 grid-rows-7 gap-1'} w-full max-w-sm sm:max-w-md lg:max-w-lg ${desktop ? 'aspect-[7/4]' : 'aspect-[4/7]'}`}
      >
        {tiles.map((id) => {
          const { row, col } = getPosition(id, desktop)
          const color = TILE_COLORS[id % TILE_COLORS.length]
          return (
            <div
              key={id}
              style={{ gridRowStart: row, gridColumnStart: col }}
              className="relative flex items-center justify-center border border-gray-300 text-xs lg:text-sm"
            >
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  background: desktop
                    ? `linear-gradient(135deg, ${color}33, ${color})`
                    : color,
                  borderRadius: desktop ? '8px' : '6px'
                }}
              />
              {STAR_TILES.includes(id) && (
                <span className="text-yellow-400 z-10">★</span>
              )}
              {id === FINISH_TILE && (
                <span className="z-10">🏁</span>
              )}
              <div className="z-10 flex gap-0.5">
                {players
                  .filter((p) => p.position === id)
                  .map((p) => (
                    <div
                      key={p.name}
                      className="rounded-full flex items-center justify-center text-[10px] text-white"
                      style={{
                        backgroundColor: p.color,
                        width: desktop ? 24 : 20,
                        height: desktop ? 24 : 20
                      }}
                    >
                      {p.name.charAt(0)}
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
