import { useState } from 'react'
import type { Player } from './PlayerSetup'

interface GamePlayer extends Player {
  position: number
}

function GameBoard({ players }: { players: Player[] }) {
  const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>(
    players.map((p) => ({ ...p, position: 0 })),
  )
  const [current, setCurrent] = useState(0)
  const [dice, setDice] = useState<number | null>(null)
  const [winner, setWinner] = useState<string | null>(null)

  const rollDice = () => {
    if (winner) return
    const roll = Math.ceil(Math.random() * 6)
    setDice(roll)
    const newPos = Math.min(gamePlayers[current].position + roll, 27)
    setGamePlayers((prev) => {
      const updated = [...prev]
      updated[current] = { ...prev[current], position: newPos }
      return updated
    })
    if (newPos >= 27) {
      setWinner(gamePlayers[current].name)
    } else {
      setCurrent((current + 1) % gamePlayers.length)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Plateau de jeu</h2>
      <div className="grid grid-cols-7 gap-1 w-fit mx-auto mb-4">
        {Array.from({ length: 28 }, (_, i) => (
          <div key={i} className="w-12 h-12 border flex flex-wrap items-center justify-center">
            {gamePlayers
              .filter((p) => p.position === i)
              .map((p) => (
                <span
                  key={p.name}
                  className="w-3 h-3 rounded-full m-0.5"
                  style={{ backgroundColor: p.color }}
                />
              ))}
          </div>
        ))}
      </div>
      {!winner && (
        <div className="mb-4">
          <p className="mb-2">Au tour de {gamePlayers[current].name}</p>
          <button onClick={rollDice}>Lancer le dé</button>
          {dice && <p className="mt-2">Dé : {dice}</p>}
        </div>
      )}
      {winner && <p className="text-lg font-bold">{winner} a gagné !</p>}
    </div>
  )
}

export default GameBoard
