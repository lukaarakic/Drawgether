import { hsvaToHex } from "@uiw/color-convert"
import { MouseEvent, MouseEventHandler, useEffect, useState } from "react"

export const useDraw = ({
  hsva,
  brushWidth,
  canvasRef,
}: {
  hsva: HsvaColor
  brushWidth: number
  canvasRef: React.RefObject<HTMLCanvasElement>
}) => {
  const canvas = canvasRef.current
  const ctx = canvas?.getContext("2d")

  const offsetTop = canvas?.offsetTop
  const offsetLeft = canvas?.offsetLeft

  const [isDrawing, setIsDrawing] = useState(false)
  const [step, setStep] = useState(0)
  const [isBgWhite, setIsBgWhite] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  if (!isBgWhite) {
    if (ctx) {
      fillCanvasWhite()
    }
  }

  const computeCoords = (e: MouseEvent<HTMLCanvasElement>) => {
    return { x: e.clientX - (offsetLeft || 0), y: e.clientY - (offsetTop || 0) }
  }

  function fillCanvasWhite() {
    if (ctx) {
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      console.log("!!!!!")
      setIsBgWhite(true)
    }
  }

  function undo() {
    if (step <= 1 || !ctx) return

    setStep((prev) => prev - 1)

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for (let i = 0; i < step - 1; i++) {
      const canvasPic = new Image()
      canvasPic.src = history[i]
      canvasPic.onload = () => {
        ctx.drawImage(canvasPic, 0, 0)
      }
    }

    setHistory((prev) => [...prev.slice(0, step - 1)])
  }

  const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!ctx) return

    setIsDrawing(true)

    const { x, y } = computeCoords(e)

    ctx.beginPath()
    ctx.moveTo(x, y)
    e.preventDefault()
  }

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isDrawing || !ctx) return

    const { x, y } = computeCoords(e)

    ctx.lineTo(x, y)
    ctx.strokeStyle = hsvaToHex(hsva)
    ctx.lineWidth = brushWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()
  }

  const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = () => {
    if (!isDrawing || !ctx) return

    ctx.stroke()
    ctx.closePath()
    setIsDrawing(false)
    setStep((prev) => prev + 1)
    setHistory((prev) => [...prev.slice(0, step), ctx.canvas.toDataURL()])
  }

  useEffect(() => {
    window.addEventListener("mouseup", () => {
      setIsDrawing(false)
    })

    return () =>
      window.removeEventListener("mouseup", () => {
        setIsDrawing(false)
      })
  }, [])

  return {
    canvasRef,
    undo,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}