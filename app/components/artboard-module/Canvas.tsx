interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  handleMouseDown: React.MouseEventHandler<HTMLCanvasElement>
  handleMouseMove: React.MouseEventHandler<HTMLCanvasElement>
  handleMouseUp: React.MouseEventHandler<HTMLCanvasElement>
}

const Canvas = ({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}: CanvasProps) => {
  return (
    <>
      <canvas
        width={512}
        height={512}
        className="box-shadow cursor-crosshair bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
      />
    </>
  )
}
export default Canvas
