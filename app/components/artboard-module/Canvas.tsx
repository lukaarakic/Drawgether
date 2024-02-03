const Canvas = ({
  canvasRef,
  setMouseDown,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>
  setMouseDown: () => void
}) => {
  return (
    <canvas
      width={512}
      height={512}
      className="box-shadow cursor-crosshair bg-white"
      ref={canvasRef}
      onMouseDown={setMouseDown}
    />
  )
}
export default Canvas
