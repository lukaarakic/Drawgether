const Eraser = ({
  setHsva,
}: {
  setHsva: React.Dispatch<
    React.SetStateAction<{
      h: number
      s: number
      v: number
      a: number
    }>
  >
}) => {
  return (
    <button
      onClick={() => setHsva({ h: 0, s: 0, v: 100, a: 1 })}
      className="box-shadow text-border text-border-lg mb-4 rotate-2 bg-pink px-4 text-36 uppercase text-white"
      data-text="eraser"
    >
      eraser
    </button>
  )
}
export default Eraser
