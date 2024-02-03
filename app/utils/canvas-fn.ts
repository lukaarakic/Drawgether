import { useEffect, useRef, useState } from "react"
import { hsvaToHex } from "@uiw/color-convert"

export const useDraw = (hsva: HsvaColor, brushWidth: number) => {
  const [mouseDown, setMouseDown] = useState(false)
  const [step, setStep] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevPoint = useRef<null | Point>(null)
  const ctx = canvasRef.current?.getContext("2d")

  const onMouseDown = () => setMouseDown(true)

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint
    const lineColor = hsvaToHex(hsva)
    const lineWidth = brushWidth

    const startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return
      const currentPoint = computePointInCanvas(e)

      if (!ctx || !currentPoint) return

      drawLine({ ctx, currentPoint, prevPoint: prevPoint.current })
      prevPoint.current = currentPoint
    }

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      return { x, y }
    }

    const mouseUpHandler = () => {
      setMouseDown(false)
      prevPoint.current = null

      ctx?.stroke()
      ctx?.closePath()

      setStep((prev) => prev + 1)
      console.log(step)
    }

    // Add event listeners
    canvasRef.current?.addEventListener("mousemove", handler)
    window.addEventListener("mouseup", mouseUpHandler)

    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler)
      window.removeEventListener("mouseup", mouseUpHandler)
    }
  }, [drawLine])

  return { canvasRef, onMouseDown }
}
