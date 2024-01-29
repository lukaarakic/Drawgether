/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@remix-run/react"
import SmallArtwork from "./SmallArtwork"

const SmallArtworkContainer = ({ artist }: { artist: any }) => {
  return (
    <div className="grid grid-cols-auto-fit items-center justify-items-center gap-x-4 gap-y-8">
      {artist.artworks.map(
        (artwork: { id: string; artworkImage: string }, index: number) => (
          <Link key={artwork.id} to={`artwork/${artwork.id}`}>
            <SmallArtwork art={artwork.artworkImage} index={index} />
          </Link>
        ),
      )}
    </div>
  )
}
export default SmallArtworkContainer
