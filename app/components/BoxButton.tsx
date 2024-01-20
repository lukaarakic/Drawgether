import { FC, ReactNode } from "react";

interface BoxButtonProps {
  children: ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  degree?: number;
}

const BoxButton: FC<BoxButtonProps> = ({
  children,
  type = undefined,
  degree = 0,
}) => {
  return (
    <button
      className={`inline-block w-[16rem] h-[5rem] bg-pink font-zyzolOutline text-40 box-shadow text-white transition-transform transform hover:scale-105 active:scale-90`}
      type={type}
      style={{
        rotate: `${degree}deg`,
      }}
    >
      {children}
    </button>
  );
};

export default BoxButton;
