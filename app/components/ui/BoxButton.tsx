import { FC, ReactNode } from "react";

interface BoxButtonProps {
  children: ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  degree?: number;
  className?: string;
}

const BoxButton: FC<BoxButtonProps> = ({
  children,
  type = undefined,
  degree = 0,
  className,
}) => {
  return (
    <button
      className={`${className} inline-block bg-pink font-zyzolOutline box-shadow text-white transition-transform transform hover:scale-105 active:scale-90`}
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
