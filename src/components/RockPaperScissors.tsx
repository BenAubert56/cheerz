import { useEffect, useState } from 'react'
import type { GamePlayer } from './PlayerToken'

export type Choice = 'rock' | 'paper' | 'scissors'

const icons: Record<Choice, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️'
}

interface PlayerChoiceProps {
  player: GamePlayer
  choice: Choice | null
  onChoice: (c: Choice) => void
}

function PlayerChoice({ player, choice, onChoice }: PlayerChoiceProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="font-bold" style={{ color: player.color }}>{player.name}</div>
      <div className="flex gap-2">
        {(Object.keys(icons) as Choice[]).map((c) => (
          <button
            key={c}
            onClick={() => onChoice(c)}
            className={`text-3xl transition-transform hover:scale-110 ${choice === c ? 'animate-bounce' : ''}`}
          >
            {icons[c]}
          </button>
        ))}
      </div>
    </div>
  )
}

interface Props {
  players: [GamePlayer, GamePlayer]
  onDone: (loser: 0 | 1 | null) => void
}

export default function RockPaperScissors({ players, onDone }: Props) {
  const [choiceA, setChoiceA] = useState<Choice | null>(null)
  const [choiceB, setChoiceB] = useState<Choice | null>(null)

  const winner = (a: Choice, b: Choice): 0 | 1 | null => {
    if (a === b) return null
    if (
      (a === 'rock' && b === 'scissors') ||
      (a === 'paper' && b === 'rock') ||
      (a === 'scissors' && b === 'paper')
    )
      return 0
    return 1
  }

  useEffect(() => {
    if (choiceA && choiceB) {
      const w = winner(choiceA, choiceB)
      if (w === null) {
        setTimeout(() => {
          setChoiceA(null)
          setChoiceB(null)
        }, 500)
      } else {
        setTimeout(() => onDone(w === 0 ? 1 : 0), 500)
      }
    }
  }, [choiceA, choiceB])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl space-y-4 animate-pop">
        <h2 className="text-2xl font-bold text-center">Shi Fu Mi !</h2>
        <div className="flex gap-8">
          <PlayerChoice player={players[0]} choice={choiceA} onChoice={setChoiceA} />
          <PlayerChoice player={players[1]} choice={choiceB} onChoice={setChoiceB} />
        </div>
        {choiceA && choiceB && (
          <p className="text-center text-lg font-semibold">{winner(choiceA, choiceB) === null ? 'Égalité !' : ''}</p>
        )}
      </div>
    </div>
  )
}
