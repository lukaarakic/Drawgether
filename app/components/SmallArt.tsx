import { generateRandomNumber } from "~/utils/getRandomDeg";

const SmallArt = ({ art }: { art: string }) => {
  return (
    <div
      className="w-[23rem] h-[23rem] box-shadow bg-black bg-opacity-30 overflow-hidden cursor-pointer"
      style={{
        rotate: `${generateRandomNumber()}deg`,
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
