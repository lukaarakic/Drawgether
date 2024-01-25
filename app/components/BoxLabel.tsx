import { FC, ReactNode } from "react";

interface BoxLabelProps {
  children: ReactNode;
  degree?: number;
}

const BoxLabel: FC<BoxLabelProps> = ({ children, degree = 0 }) => {
  return (
    <div
      className="bg-black p-2 drop-shadow-filter-lg"
      style={{
        rotate: `${degree}deg`,
      }}
    >
      <div className="bg-pink text-white px-2 flex items-center justify-start">
        {children}
      </div>
    </div>
  );
};

export default BoxLabel;
