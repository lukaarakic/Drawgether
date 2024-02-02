import { hsvaToHex } from "@uiw/color-convert"

type DrawLineProps = Draw & {
  hsva: HsvaColor
}

export const drawLine = ({
  prevPoint,
  currentPoint,
  ctx,
  hsva,
}: DrawLineProps) => {
  const { x: currX, y: currY } = currentPoint
  const lineColor = hsvaToHex(hsva)
  const lineWidth = 5

  const startPoint = prevPoint ?? currentPoint
  ctx.beginPath()
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor
  ctx.moveTo(startPoint.x, startPoint.y)
  ctx.lineTo(currX, currY)
  ctx.stroke()

  ctx.fillStyle = lineColor
  ctx.beginPath()
  ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
  ctx.fill()
}
