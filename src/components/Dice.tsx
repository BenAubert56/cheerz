import React from 'react'

const faces = ['\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685']

interface DiceProps {
  value: number | null
  rolling: boolean
}

export default function Dice({ value, rolling }: DiceProps) {
  const face = value ? faces[value - 1] : faces[0]
  return (
    <div
      className={`w-16 h-16 bg-white text-black text-4xl flex items-center justify-center rounded-lg border-2 border-gray-900 ${rolling ? 'animate-spin duration-500' : ''}`}
    >
      {face}
    </div>
  )
}
