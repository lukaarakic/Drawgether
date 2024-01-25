import generateRandomRotation from "~/utils/getRandomRotation";

const SmallArt = ({ art, index }: { art: string; index: number }) => {
  const rotations = [-1.02, 0.78, -1.21, 1.08, -0.93, 1.24];

  return (
    <div
      className="w-[23rem] h-[23rem] box-shadow bg-black bg-opacity-30 overflow-hidden cursor-pointer"
      style={{
        rotate: `${generateRandomRotation(index % 6, rotations)}deg`,
      }}
    >
      <img
        src={art}
        alt=""
        className="object-center object-fill w-full h-full"
      />
    </div>
  );
};

export default SmallArt;
