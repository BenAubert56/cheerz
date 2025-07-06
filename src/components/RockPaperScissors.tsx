import type { GamePlayer } from './PlayerToken'

interface Props {
  players: [GamePlayer, GamePlayer]
  onDone: (loser: 0 | 1 | null) => void
}

export default function RockPaperScissors({ players, onDone }: Props) {
  const handleWinner = (winner: 0 | 1 | null) => {
    if (winner === null) return onDone(null)
    onDone(winner === 0 ? 1 : 0)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl space-y-4 animate-pop">
        <h2 className="text-2xl font-bold text-center">Shi Fu Mi !</h2>
        <p className="text-center text-lg">Qui a gagné ?</p>
        <div className="flex justify-center gap-8">
          <button
            onClick={() => handleWinner(0)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold"
            style={{ color: players[0].color }}
          >
            {players[0].name}
          </button>
          <button
            onClick={() => handleWinner(1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold"
            style={{ color: players[1].color }}
          >
            {players[1].name}
          </button>
        </div>
        <div className="text-center">
          <button
            onClick={() => handleWinner(null)}
            className="mt-2 text-sm text-gray-700 underline"
          >
            Égalité
          </button>
        </div>
      </div>
    </div>
  )
}
