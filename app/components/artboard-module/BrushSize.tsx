import generateRandomRotation from "~/utils/generate-random-rotation"

const BrushSize = ({
  brushWidth,
  setBrushWidth,
}: {
  brushWidth: number
  setBrushWidth: React.Dispatch<React.SetStateAction<number>>
}) => {
  return (
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
  )
}
export default BrushSize
