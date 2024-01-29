import { ArtworkPostType } from "~/utils/types"
import ArtworkPost from "../ArtworkPost"

const ArtworksContainer = ({ artworks }: { artworks: ArtworkPostType[] }) => {
  return (
    <div className="flex flex-col">
      {artworks.map((artwork, index) => (
        <ArtworkPost artwork={artwork} key={artwork.id} index={index} />
      ))}
    </div>
  )
}
export default ArtworksContainer
