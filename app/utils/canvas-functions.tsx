import { hsvaToHex, rgbStringToHsva } from "@uiw/color-convert"
import { MouseEvent, MouseEventHandler, useEffect, useState } from "react"

export const useDraw = ({
  hsva,
  brushWidth,
  canvasRef,
  type,
  setHsva,
}: {
  hsva: HsvaColor
  brushWidth: number
  canvasRef: React.RefObject<HTMLCanvasElement>
  type: toolType
  setHsva: React.Dispatch<
    React.SetStateAction<{
      h: number
      s: number
      v: number
      a: number
    }>
  >
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

  function eyedropper(e: MouseEvent<HTMLCanvasElement>) {
    if (!ctx) return

    const { x, y } = computeCoords(e)
    const imagesData = ctx.getImageData(x, y, 1, 1)
    const colors = [imagesData.data[0], imagesData.data[1], imagesData.data[2]]
    const rgbString = `rgb(${colors.join()})`

    // @ts-expect-error bad return type :(
    setHsva(rgbStringToHsva(rgbString))
  }

  function fillCanvasWhite() {
    if (ctx) {
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
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

  const handleClick: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (type === "eyedropper") {
      return eyedropper(e)
    }
  }

  const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!ctx) return

    setIsDrawing(true)

    const { x, y } = computeCoords(e)

    ctx.beginPath()
    ctx.strokeStyle = type === "eraser" ? "#fff" : hsvaToHex(hsva)
    ctx.lineWidth = brushWidth
    ctx.arc(x, y, brushWidth / 50, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(x, y)
    e.preventDefault()
  }

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isDrawing || !ctx) return

    if (type === "eyedropper") {
      eyedropper(e)
    } else {
      const { x, y } = computeCoords(e)
      ctx.lineTo(x, y)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    }
  }

  const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = () => {
    if (!isDrawing || !ctx) return

    if (type === "pencil") {
      ctx.stroke()
      ctx.closePath()
      setIsDrawing(false)
      setStep((prev) => prev + 1)
      setHistory((prev) => [...prev.slice(0, step), ctx.canvas.toDataURL()])
    }
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
    handleClick,
  }
}
