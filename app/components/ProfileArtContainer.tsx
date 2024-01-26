/* eslint-disable @typescript-eslint/no-explicit-any */
import SmallArt from "./SmallArt"

const ProfileArtContainer = ({ arts }: { arts: any[] }) => {
  return (
    <div className="grid grid-cols-auto-fit items-center justify-items-center gap-x-4 gap-y-8">
      {arts.map((art, index) => (
        <SmallArt art={art.art} key={art.id} index={index} />
      ))}
    </div>
  )
}

export default ProfileArtContainer
