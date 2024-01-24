import { FC, ReactNode } from "react";

// Assets
import CloseSVG from "~/assets/misc/close.svg";
import { generateRandomNumber } from "~/utils/getRandomDeg";

interface ModalProps {
  children: ReactNode;
  className?: string;
  isModalOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: FC<ModalProps> = ({
  children,
  className,
  isModalOpen,
  setIsOpen,
}) => {
  return (
    <div className={`${isModalOpen ? "" : "hidden"}`}>
      <div className="bg-black bg-opacity-50 absolute w-screen h-screen top-0 left-0 z-40 pointer-events-none cursor-default">
        &nbsp;
      </div>

      <div
        className={`w-[55rem] h-[64rem] box-shadow bg-white top-1/2 fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50`}
        style={{
          rotate: `${generateRandomNumber() + 0.5}deg`,
        }}
      >
        <button
          className="w-8 h-8 fixed top-5 right-5"
          onClick={() => setIsOpen(false)}
        >
          <img src={CloseSVG} alt="" className="w-full h-full" />
        </button>

        <div className={`${className}`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
