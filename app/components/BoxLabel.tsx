import { FC, ReactNode } from "react";
import { generateRandomNumber } from "~/utils/getRandomDeg";

interface BoxLabelProps {
  children: ReactNode;
}

const BoxLabel: FC<BoxLabelProps> = ({ children }) => {
  return (
    <div
      className="bg-black p-2 drop-shadow-filter-lg"
      style={{
        rotate: `${generateRandomNumber()}deg`,
      }}
    >
      <div className="bg-pink text-white px-2 flex items-center justify-start">
        {children}
      </div>
    </div>
  );
};

export default BoxLabel;
