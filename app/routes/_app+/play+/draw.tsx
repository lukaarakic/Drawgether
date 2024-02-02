import { useDraw } from "~/hooks/useDraw"
import Wheel from "@uiw/react-color-wheel"
import ShadeSlider from "@uiw/react-color-shade-slider"
import { hsvaToHex } from "@uiw/color-convert"
import { useState } from "react"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { themeStorage } from "~/utils/theme.server"
import { useLoaderData } from "@remix-run/react"
import BoxLabel from "~/components/ui/BoxLabel"
import generateRandomRotation from "~/utils/generate-random-rotation"

export async function loader({ request }: LoaderFunctionArgs) {
  const themeSession = await themeStorage.getSession(
    request.headers.get("cookie"),
  )
  const theme = themeSession.get("theme")

  return json({ theme })
}

const Draw = () => {
  const { theme } = useLoaderData<typeof loader>()
  const { canvasRef, onMouseDown } = useDraw(drawLine)
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 })
  const [brushWidth, setBrushWidth] = useState(5)

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
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.lineCap = "round"
    ctx.fill()
  }

  return (
    <div>
      <BoxLabel
        className="mb-4 w-min whitespace-nowrap"
        degree={generateRandomRotation(new Date().getHours() % 12)}
      >
        <p
          className="text-border text-border-lg px-5 text-36"
          data-text={theme}
        >
          {theme}
        </p>
      </BoxLabel>

      <div className="flex items-center justify-center gap-20">
        <canvas
          width={512}
          height={512}
          className="box-shadow cursor-crosshair bg-white"
          ref={canvasRef}
          onMouseDown={onMouseDown}
        />
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => setHsva({ h: 0, s: 0, v: 100, a: 1 })}
            className="box-shadow text-border text-border-lg mb-12 bg-pink px-4 text-36 uppercase text-white"
            data-text="eraser"
          >
            eraser
          </button>
          <input
            type="number"
            min={1}
            max={20}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBrushWidth(+e.target.value)
            }
          />
          <div className="box-shadow mb-4 flex h-64 w-64 items-center justify-center rounded-full">
            <Wheel
              className="flex-shrink-0"
              width={153}
              height={153}
              color={hsva}
              onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
            />
          </div>
          <div className="box-shadow overflow-hidden">
            <ShadeSlider
              hsva={hsva}
              height={10}
              width={153}
              onChange={(newShade) => {
                setHsva({ ...hsva, ...newShade })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Draw
