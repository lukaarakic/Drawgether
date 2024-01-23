/* eslint-disable @typescript-eslint/no-explicit-any */
import SmallArt from "./SmallArt";

const ProfileArtContainer = ({ arts }: { arts: any[] }) => {
  return (
    <div className="grid grid-cols-auto-fit justify-items-center gap-x-4 gap-y-8">
      {arts.map((art) => (
        <SmallArt art={art.art} key={art.id} />
      ))}
    </div>
  );
};

export default ProfileArtContainer;
