import { useDraw } from "~/hooks/useDraw"
import Wheel from "@uiw/react-color-wheel"
import ShadeSlider from "@uiw/react-color-shade-slider"
import { hsvaToHex } from "@uiw/color-convert"
import { useState } from "react"
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { themeStorage } from "~/utils/theme.server"
import { useLoaderData } from "@remix-run/react"
import BoxLabel from "~/components/ui/BoxLabel"
import generateRandomRotation from "~/utils/generate-random-rotation"
import { useArtist } from "~/utils/artist"
import ArtistCircle from "~/components/ui/ArtistCircle"

export async function loader({ request }: LoaderFunctionArgs) {
  const themeSession = await themeStorage.getSession(
    request.headers.get("cookie"),
  )
  const theme = themeSession.get("theme")
  if (!theme) return redirect("/home/0")

  return json({ theme })
}

const Draw = () => {
  const { theme } = useLoaderData<typeof loader>()
  const { canvasRef, onMouseDown } = useDraw(drawLine)
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 })
  const [brushWidth, setBrushWidth] = useState(5)
  const artist = useArtist()

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
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)

    ctx.lineCap = "round"
    ctx.fill()
  }

  return (
    <div className="flex items-start gap-10">
      <ArtistCircle
        className="mt-28 flex-shrink-0 flex-grow-0"
        avatar={{ avatarUrl: artist.avatar, seed: artist.username }}
        size={8.3}
      />
      <div className="flex items-center justify-center gap-20">
        <div>
          <BoxLabel
            className="mb-4 w-[52rem] whitespace-nowrap"
            degree={generateRandomRotation(new Date().getHours() % 12)}
          >
            <p
              className="text-border text-border-lg px-5 text-36"
              data-text={theme}
            >
              {theme}
            </p>
          </BoxLabel>

          <canvas
            width={512}
            height={512}
            className="box-shadow cursor-crosshair bg-white"
            ref={canvasRef}
            onMouseDown={onMouseDown}
          />
        </div>

        <div className="flex flex-col items-center justify-between">
          <button
            onClick={() => setHsva({ h: 0, s: 0, v: 100, a: 1 })}
            className="box-shadow text-border text-border-lg mb-4 bg-pink px-4 text-36 uppercase text-white"
            data-text="eraser"
            style={{
              rotate: `-${generateRandomRotation(new Date().getHours() % 12)}deg`,
            }}
          >
            eraser
          </button>
          <div className="mb-8 flex items-center justify-center gap-6">
            <label
              htmlFor="brushSize"
              className="w-min text-center text-25 leading-none"
            >
              Brush
              <br />
              Size
            </label>
            <input
              id="brushSize"
              type="number"
              min={5}
              max={50}
              step={2}
              className="box-shadow h-16 w-28 text-32"
              defaultValue={brushWidth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBrushWidth(+e.target.value)
              }
              style={{
                rotate: `${generateRandomRotation(new Date().getHours() % 12)}deg`,
              }}
            />
          </div>
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
