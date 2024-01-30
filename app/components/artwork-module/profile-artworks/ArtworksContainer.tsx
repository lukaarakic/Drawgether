import { ArtworkPostType } from "~/utils/types"
import ArtworkPost from "../ArtworkPost"

const ArtworksContainer = ({
  artworks,
  profileRoute,
}: {
  artworks: ArtworkPostType[]
  profileRoute?: string | null
}) => {
  return (
    <div className="flex flex-col">
      {artworks.map((artwork, index) => (
        <ArtworkPost
          artwork={artwork}
          key={artwork.id}
          index={index}
          profileRoute={profileRoute}
        />
      ))}
    </div>
  )
}
export default ArtworksContainer
