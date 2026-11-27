interface SparklineProps {
  data: number[]
  color: string
}

/**
 * Inline KPI trend line. Mirrors the Figma "Chart" vectors: 2px rounded stroke,
 * inset 6.25% horizontally and ~15%/~42% vertically inside a 32px-tall box.
 */
export function Sparkline({ data, color }: SparklineProps) {
  const W = 100
  const H = 32
  const padX = W * 0.0625
  const top = H * 0.147
  const bottom = H * 0.58
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const points = data
    .map((v, i) => {
      const x = padX + (i / (data.length - 1)) * (W - padX * 2)
      const y = bottom - ((v - min) / span) * (bottom - top)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-8 min-w-0 flex-1" aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
