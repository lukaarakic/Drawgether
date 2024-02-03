import { useState } from "react"
import LeftPanel from "./LeftPanel"
import Canvas from "./Canvas"
import ArtboardTools from "./ArtboardTools"
import { useDraw } from "~/utils/canvas-fn"

const Artboard = () => {
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 })
  const [brushWidth, setBrushWidth] = useState(5)

  const { canvasRef, onMouseDown } = useDraw(hsva, brushWidth)

  return (
    <div className="flex gap-8">
      <LeftPanel />
      <Canvas canvasRef={canvasRef} setMouseDown={onMouseDown} />
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
