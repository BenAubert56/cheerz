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

const pipMap: Record<number, [number, number][]> = {
  1: [[2, 2]],
  2: [[1, 1], [3, 3]],
  3: [[1, 1], [2, 2], [3, 3]],
  4: [[1, 1], [1, 3], [3, 1], [3, 3]],
  5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
  6: [[1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 3]]
}

function Face({ num, transform }: { num: number; transform: string }) {
  return (
    <div
      className="absolute inset-0 bg-white border-2 border-gray-900 grid grid-cols-3 grid-rows-3"
      style={{ transform }}
    >
      {pipMap[num].map(([row, col], i) => (
        <div
          key={i}
          className="flex items-center justify-center"
          style={{ gridRowStart: row, gridColumnStart: col }}
        >
          <div className="w-2.5 h-2.5 bg-black rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default function Dice({ value, rolling }: DiceProps) {
  const transform = value ? rotations[value] : rotations[1]
  return (
    <div className="perspective-500">
      <div
        className={`relative w-16 h-16 transform-preserve-3d transition-transform duration-700 ${rolling ? 'animate-dice-roll' : ''}`}
        style={{ transform }}
      >
        <Face num={1} transform="translateZ(32px)" />
        <Face num={2} transform="rotateX(90deg) translateZ(32px)" />
        <Face num={3} transform="rotateY(-90deg) translateZ(32px)" />
        <Face num={4} transform="rotateY(90deg) translateZ(32px)" />
        <Face num={5} transform="rotateX(-90deg) translateZ(32px)" />
        <Face num={6} transform="rotateY(180deg) translateZ(32px)" />
      </div>
    </div>
  )
}
