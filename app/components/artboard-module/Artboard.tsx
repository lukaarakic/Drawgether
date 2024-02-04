import { useState } from "react"
import LeftPanel from "./LeftPanel"
import Canvas from "./Canvas"
import ArtboardTools from "./ArtboardTools"
import { useDraw } from "~/utils/canvas-functions"

const Artboard = () => {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 })
  const [brushWidth, setBrushWidth] = useState(5)

  const { handleMouseDown, handleMouseMove, handleMouseUp, canvasRef, undo } =
    useDraw({ brushWidth, hsva })

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
