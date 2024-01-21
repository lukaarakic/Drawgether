import { FC } from "react";

interface ArtistCircleProps {
  avatarSeed?: string;
  size: number;
  className?: string;
}

const ArtistCircle: FC<ArtistCircleProps> = ({
  avatarSeed,
  size,
  className,
}) => {
  return (
    <div
      className={`${className} w-[${size}rem] h-[${size}rem] rounded-full box-shadow bg-white flex items-center justify-center`}
    >
      {avatarSeed ? (
        <img
          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`}
          alt="Artist avatar"
          style={{
            width: `${size * 0.9}rem`,
            height: `${size * 0.9}rem`,
          }}
        />
      ) : null}
    </div>
  );
};

export default ArtistCircle;
