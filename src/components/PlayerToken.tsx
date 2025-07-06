import type { Player } from './PlayerSetup'

export interface GamePlayer extends Player {
  position: number
}

interface Props {
  player: GamePlayer
  scale: number
}

export default function PlayerToken({ player, scale }: Props) {
  return (
    <div
      className="rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold"
      style={{
        backgroundColor: player.color,
        width: 40 * scale,
        height: 40 * scale,
        fontSize: 16 * scale
      }}
    >
      {player.name.charAt(0)}
    </div>
  )
}
