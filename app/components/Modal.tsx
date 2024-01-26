import { FC, ReactNode, useEffect } from "react"

// Assets
import CloseSVG from "~/assets/misc/close.svg"
import generateRandomRotation from "~/utils/getRandomRotation"

interface ModalProps {
  children: ReactNode
  className?: string
  isModalOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: FC<ModalProps> = ({
  children,
  className,
  isModalOpen,
  setIsOpen,
}) => {
  useEffect(() => {
    document.body.classList.toggle("stop-scroll")
  }, [isModalOpen])

  return (
    <div className={`${isModalOpen ? "" : "hidden"}`}>
      <div className="pointer-events-none fixed left-0 top-0 z-40 h-screen w-screen cursor-default bg-black bg-opacity-50">
        &nbsp;
      </div>

      <div
        className={`box-shadow fixed left-1/2 top-1/2 z-50 h-[64rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 transform bg-white`}
        style={{
          rotate: `${generateRandomRotation(new Date().getHours() % 12)}deg`,
        }}
      >
        <button
          className="fixed right-5 top-5 h-8 w-8"
          onClick={() => setIsOpen(false)}
        >
          <img src={CloseSVG} alt="" className="h-full w-full" />
        </button>

        <div className={`${className}`}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
