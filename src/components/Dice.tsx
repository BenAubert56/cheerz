import React from 'react'

interface DiceProps {
  value: number | null
  rolling: boolean
}

const rotations: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(-90deg) rotateY(0deg)',
  3: 'rotateY(-90deg)',
  4: 'rotateY(90deg)',
  5: 'rotateX(90deg) rotateY(0deg)',
  6: 'rotateY(180deg)'
}

export default function Dice({ value, rolling }: DiceProps) {
  const transform = value ? rotations[value] : rotations[1]
  return (
    <div className="perspective-500">
      <div
        className={`relative w-16 h-16 transform-preserve-3d transition-transform duration-700 ${rolling ? 'animate-dice-roll' : ''}`}
        style={{ transform }}
      >
        <div className="absolute inset-0 bg-white border-2 border-gray-900 flex items-center justify-center" style={{ transform: 'translateZ(32px)' }}>1</div>
        <div className="absolute inset-0 bg-white border-2 border-gray-900 flex items-center justify-center" style={{ transform: 'rotateX(90deg) translateZ(32px)' }}>2</div>
        <div className="absolute inset-0 bg-white border-2 border-gray-900 flex items-center justify-center" style={{ transform: 'rotateY(-90deg) translateZ(32px)' }}>3</div>
        <div className="absolute inset-0 bg-white border-2 border-gray-900 flex items-center justify-center" style={{ transform: 'rotateY(90deg) translateZ(32px)' }}>4</div>
        <div className="absolute inset-0 bg-white border-2 border-gray-900 flex items-center justify-center" style={{ transform: 'rotateX(-90deg) translateZ(32px)' }}>5</div>
        <div className="absolute inset-0 bg-white border-2 border-gray-900 flex items-center justify-center" style={{ transform: 'rotateY(180deg) translateZ(32px)' }}>6</div>
      </div>
    </div>
  )
}
