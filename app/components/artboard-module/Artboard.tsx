import { useState } from "react"
import LeftPanel from "./LeftPanel"
import Canvas from "./Canvas"
import ArtboardTools from "./ArtboardTools"
import { useDraw } from "~/utils/canvas-functions"

const Artboard = ({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>
}) => {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 })
  const [brushWidth, setBrushWidth] = useState(5)

  const { handleMouseDown, handleMouseMove, handleMouseUp, undo } = useDraw({
    brushWidth,
    hsva,
    canvasRef,
  })

  return (
    <div className="flex gap-8">
      <LeftPanel undo={undo} />
      <Canvas
        canvasRef={canvasRef}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
      />
      <ArtboardTools
        brushWidth={brushWidth}
        hsva={hsva}
        setBrushWidth={setBrushWidth}
        setHsva={setHsva}
      />
    </div>
  )
}
export default Artboard
