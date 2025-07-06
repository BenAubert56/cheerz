import { useState } from 'react'

interface Player {
  name: string
  color: string
}

function PlayerSetup() {
  const [players, setPlayers] = useState<Player[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('#000000')

  const addPlayer = () => {
    if (!name.trim() || players.length >= 10) return
    setPlayers([...players, { name: name.trim(), color }])
    setName('')
    setColor('#000000')
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Création des joueurs</h2>
      {players.length < 10 && (
        <div className="flex gap-2 items-center mb-4">
          <input
            className="border px-2 py-1"
            type="text"
            placeholder="Prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <button className="border px-2 py-1" onClick={addPlayer}>
            Ajouter
          </button>
        </div>
      )}
      <ul className="space-y-1">
        {players.map((player, index) => (
          <li key={index} className="flex items-center gap-2">
            <span
              className="w-4 h-4 inline-block"
              style={{ backgroundColor: player.color }}
            />
            <span>{player.name}</span>
          </li>
        ))}
      </ul>
      {players.length >= 10 && (
        <p className="text-sm text-red-500 mt-2">Limite de 10 joueurs atteinte</p>
      )}
    </div>
  )
}

export default PlayerSetup
