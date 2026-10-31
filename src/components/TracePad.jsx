import { useCallback, useEffect, useRef } from 'react'
import Icon from './Icon'

// წერის სავარჯიშო: ასოს მკრთალ კონტურზე თითით ან მაუსით მოხაზვა
export default function TracePad({ glyph, label }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)

  const paintGuide = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const ratio = window.devicePixelRatio || 1
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width * ratio
    canvas.height = height * ratio
    ctx.scale(ratio, ratio)
    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = 'rgba(11, 45, 52, 0.18)'
    ctx.setLineDash([4, 6])
    ;[0.3, 0.7].forEach((y) => {
      ctx.beginPath()
      ctx.moveTo(12, height * y)
      ctx.lineTo(width - 12, height * y)
      ctx.stroke()
    })
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(11, 45, 52, 0.13)'
    ctx.font = `${Math.round(height * 0.7)}px 'Noto Sans Georgian', sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(glyph, width / 2, height / 2)
    ctx.strokeStyle = '#2B37D6'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [glyph])

  useEffect(() => {
    paintGuide()
    document.fonts?.ready.then(paintGuide)
  }, [paintGuide])

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const start = (e) => {
    drawing.current = true
    canvasRef.current.setPointerCapture?.(e.pointerId)
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  const move = (e) => {
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const end = () => {
    drawing.current = false
  }

  return (
    <div className="trace">
      <div className="trace-head">
        <span>
          <Icon name="pen" size={16} /> {label}
        </span>
        <button className="icon-btn" onClick={paintGuide} aria-label="clear" title="clear">
          <Icon name="eraser" size={18} />
        </button>
      </div>
      <canvas ref={canvasRef} className="trace-canvas" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} />
    </div>
  )
}
