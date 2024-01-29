import generateRandomRotation from "~/utils/generate-random-rotation"

const SmallArt = ({ art, index }: { art: string; index: number }) => {
  const rotations = [-1.02, 0.78, -1.21, 1.08, -0.93, 1.24]

  return (
    <div
      className="box-shadow h-[23rem] w-[23rem] cursor-pointer overflow-hidden bg-black bg-opacity-30"
      style={{
        rotate: `${generateRandomRotation(index % 6, rotations)}deg`,
      }}
    >
      <img
        src={art}
        alt=""
        className="h-full w-full object-fill object-center"
      />
    </div>
  )
}

export default SmallArt
