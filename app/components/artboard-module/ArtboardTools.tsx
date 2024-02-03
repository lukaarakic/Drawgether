import BrushSize from "./BrushSize"
import ColorPicker from "./ColorPicker"
import Eraser from "./Eraser"

interface ArtboardToolsProps {
  hsva: HsvaColor
  brushWidth: number
  setHsva: React.Dispatch<
    React.SetStateAction<{
      h: number
      s: number
      v: number
      a: number
    }>
  >
  setBrushWidth: React.Dispatch<React.SetStateAction<number>>
}

const ArtboardTools = ({
  hsva,
  brushWidth,
  setHsva,
  setBrushWidth,
}: ArtboardToolsProps) => {
  return (
    <div className="flex flex-col items-center justify-end gap-12">
      <Eraser setHsva={setHsva} />
      <BrushSize brushWidth={brushWidth} setBrushWidth={setBrushWidth} />
      <ColorPicker hsva={hsva} setHsva={setHsva} />
    </div>
  )
}
export default ArtboardTools
