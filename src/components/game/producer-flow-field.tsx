import { useEffect, useMemo, useRef } from 'react'

import Decimal from 'decimal.js'

type ProducerStreamMetric = {
  key: string
  label?: string
  productionPerSecond: Decimal.Value
}

interface ProducerFlowFieldProps {
  producers: ProducerStreamMetric[]
  className?: string
}

type ProducerLane = {
  key: string
  label: string
  intensity: number
  color: string
}

const MIN_HEIGHT_PX = 148
const MAX_HEIGHT_PX = 220
const PRODUCER_COLORS = [
  '#2563eb',
  '#16a34a',
  '#f97316',
  '#e11d48',
  '#7c3aed',
  '#0891b2',
  '#ca8a04',
  '#0f766e',
  '#4f46e5',
  '#be123c',
] as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getProducerColor(index: number): string {
  return PRODUCER_COLORS[index % PRODUCER_COLORS.length]
}

function normalizeProducerIntensities(producers: ProducerStreamMetric[]): ProducerLane[] {
  const active = producers
    .map((producer, index) => ({
      ...producer,
      index,
      value: new Decimal(producer.productionPerSecond),
    }))
    .filter((producer) => producer.value.greaterThan(0))

  if (active.length === 0) {
    return []
  }

  const maxLog10 = active.reduce((max, producer) => {
    const log10 = producer.value.plus(1).log(10).toNumber()
    return Math.max(max, log10)
  }, 0)

  if (maxLog10 <= 0) {
    return active.map((producer) => ({
      key: producer.key,
      label: producer.label ?? producer.key,
      intensity: 0.15,
      color: getProducerColor(producer.index),
    }))
  }

  return active.map((producer) => {
    const ratio = producer.value.plus(1).log(10).div(maxLog10).toNumber()
    return {
      key: producer.key,
      label: producer.label ?? producer.key,
      intensity: clamp(0.12 + ratio * 0.88, 0.12, 1),
      color: getProducerColor(producer.index),
    }
  })
}

export function ProducerFlowField({ producers, className }: ProducerFlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lanesRef = useRef<ProducerLane[]>([])
  const normalizedLanes = useMemo(
    () => normalizeProducerIntensities(producers),
    [producers],
  )

  useEffect(() => {
    lanesRef.current = normalizedLanes
  }, [normalizedLanes])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))
      const dpr = window.devicePixelRatio || 1

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const renderFrame = (timestamp: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.clearRect(0, 0, width, height)

      const frameLanes = lanesRef.current

      if (frameLanes.length > 0) {
        const laneHeight = height / frameLanes.length
        const timeSeconds = timestamp / 1000

        frameLanes.forEach((lane, laneIndex) => {
          const { intensity, color, label } = lane
          const laneCenter = laneHeight * (laneIndex + 0.5)
          const amplitude = laneHeight * (0.08 + intensity * 0.2)
          const speed = 0.06 + intensity * 0.32
          const particleCount = Math.floor(5 + intensity * 24)

          context.fillStyle = 'rgba(15, 15, 18, 0.6)'
          context.font = '600 10px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          context.textAlign = 'left'
          context.textBaseline = 'middle'
          context.fillText(label, 8, laneCenter)

          for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
            const seed = (laneIndex + 1) * 13.37 + particleIndex * 5.17
            const normalizedX = (seed * 0.071 + timeSeconds * speed) % 1
            const x = normalizedX * width

            const waveA = Math.sin(normalizedX * 16 + timeSeconds * (0.8 + intensity * 1.6) + seed)
            const waveB = Math.cos(normalizedX * 9 - timeSeconds * (0.55 + intensity * 1.1) + seed * 0.5)
            const y = laneCenter + (waveA * 0.6 + waveB * 0.4) * amplitude
            const radius = 0.8 + intensity * 1.8

            context.fillStyle = `${color}${Math.round((0.12 + intensity * 0.32) * 255)
              .toString(16)
              .padStart(2, '0')}`
            context.beginPath()
            context.arc(x, y, radius, 0, Math.PI * 2)
            context.fill()
          }
        })
      } else {
        context.fillStyle = 'rgba(15, 15, 18, 0.08)'
        context.font = '500 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText('Production streams idle', width / 2, height / 2)
      }

      animationFrameRef.current = window.requestAnimationFrame(renderFrame)
    }

    animationFrameRef.current = window.requestAnimationFrame(renderFrame)

    return () => {
      observer.disconnect()
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const displayLaneCount = Math.max(1, normalizedLanes.length)
  const dynamicHeight = clamp(90 + displayLaneCount * 20, MIN_HEIGHT_PX, MAX_HEIGHT_PX)

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: `${dynamicHeight}px` }}
      aria-hidden
    />
  )
}
