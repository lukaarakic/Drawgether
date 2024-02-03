import { FC, ReactNode } from "react"

interface BoxLabelProps {
  className?: string
  children: ReactNode
  degree?: number
}

const BoxLabel: FC<BoxLabelProps> = ({ children, degree = 0, className }) => {
  return (
    <div
      className={`drop-shadow-filter-lg bg-black p-2 ${className}`}
      style={{
        rotate: `${degree}deg`,
      }}
    >
      <div className="bg-pink px-2 text-white">{children}</div>
    </div>
  )
}

export default BoxLabel
