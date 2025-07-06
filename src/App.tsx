import './App.css'
import { useState } from 'react'
import PlayerSetup, { type Player } from './components/PlayerSetup'
import GameBoard from './components/GameBoard'

function App() {
  const [players, setPlayers] = useState<Player[] | null>(null)

  return (
    <div className="p-4">
      {players ? (
        <GameBoard players={players} />
      ) : (
        <PlayerSetup onStart={(p) => setPlayers(p)} />
      )}
    </div>
  )
}

export default App
