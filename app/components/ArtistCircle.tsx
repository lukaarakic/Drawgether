import { Link } from "@remix-run/react";
import { FC } from "react";

interface ArtistCircleProps {
  avatar: {
    avatarUrl: string | null | undefined;
    seed: string | undefined;
  };
  size: number;
  className?: string;
}

const ArtistCircle: FC<ArtistCircleProps> = ({ avatar, size, className }) => {
  return (
    <Link
      to={`/app/artist/${avatar.seed}`}
      target="_blank"
      rel="noreferrer"
      className={`${className} w-[${size}rem] h-[${size}rem] rounded-full box-shadow bg-white flex items-center justify-center overflow-hidden`}
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
    </Link>
  );
};

export default ArtistCircle;
