import { FC } from "react"

interface ArtistCircleProps {
  avatar: {
    avatarUrl: string | null | undefined
    seed: string | undefined
  }
  size: number
  className?: string
}

const ArtistCircle: FC<ArtistCircleProps> = ({ avatar, size, className }) => {
  return (
    <div
      className={`${className} w-[${size}rem] h-[${size}rem] box-shadow flex items-center justify-center overflow-hidden rounded-full bg-white`}
    >
      <img
        src={
          avatar.avatarUrl
            ? avatar.avatarUrl
            : `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar.seed}`
        }
        alt="Artist avatar"
        style={{
          width: `${size * 0.9}rem`,
          height: `${size * 0.9}rem`,
        }}
      />
    </div>
  )
}

export default ArtistCircle
