import { FC, ReactNode } from "react";
import { generateRandomNumber } from "~/utils/getRandomDeg";

interface BoxLabelProps {
  children: ReactNode;
}

const BoxLabel: FC<BoxLabelProps> = ({ children }) => {
  return (
    <p
      className="bg-pink box-shadow text-shadow text-white text-36 px-4 text-nowrap whitespace-nowrap"
      style={{
        rotate: `${generateRandomNumber()}deg`,
      }}
    >
      {children}
    </p>
  );
};

export default BoxLabel;
