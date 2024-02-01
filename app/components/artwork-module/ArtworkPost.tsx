import generateRandomRotation from "~/utils/generate-random-rotation"
import BoxLabel from "../ui/BoxLabel"
import { Link, useParams } from "@remix-run/react"
import ArtworkLikeButton from "./ArtworkLikeButton"
import ArtistCircle from "../ui/ArtistCircle"
import ArtworkComments from "./ArtworkComments"
import { useArtist } from "~/utils/artist"
import CommentIcon from "~/assets/misc/comment.svg"
import ArtworkDeleteButton from "./ArtworkDeleteButton"
import { ArtworkPostType } from "~/utils/types"

const ArtworkPost = ({
  artwork,
  index,
  className = "mx-auto mb-80 w-[80%] xs:w-[57.2rem]",
  showComments = true,
  profileRoute,
}: {
  artwork: ArtworkPostType
  index: number
  className?: string
  showComments?: boolean
  profileRoute?: string | null
}) => {
  const artist = useArtist()
  const { page } = useParams()

  return (
    <article className={className}>
      <BoxLabel degree={generateRandomRotation((index % 12) + 1)}>
        <p
          data-text={artwork.theme}
          className="text-border text-border-lg whitespace-break-spaces p-2 text-25 md:text-32"
        >
          {artwork.theme}
        </p>
      </BoxLabel>

      <div
        className="relative mb-24"
        style={{
          rotate: `${generateRandomRotation(index % 10) / 2}deg`,
        }}
      >
        <img
          src={artwork.artworkImage}
          alt={artwork.theme}
          className="box-shadow mt-5 h-[57.2rem] w-[57.2rem] object-cover "
        />

        <div className="absolute -bottom-12 -left-5 flex">
          <ArtworkLikeButton
            artworkId={artwork.id}
            likesCount={artwork.likesCount}
            isLiked={
              artwork.likes.filter((like) => like.artistId === artist.id)
                .length > 0
            }
          />
          {showComments ? (
            <Link
              to={
                profileRoute
                  ? `/artist/${profileRoute}/artwork/comment/${artwork.id}`
                  : `/home/${page}/comment/${artwork.id}`
              }
              preventScrollReset
            >
              <img src={CommentIcon} alt="" className="h-24 w-24" />
            </Link>
          ) : null}
          {artwork.artists.filter((artistF) => artistF.id === artist.id)
            .length > 0 ? (
            <ArtworkDeleteButton artworkId={artwork.id} />
          ) : null}
        </div>

        <div className="absolute -bottom-16 -right-8 flex items-baseline">
          {artwork.artists.map((artist) => (
            <Link to={`/artist/${artist.username}`} key={artist.id}>
              <ArtistCircle
                size={6.8}
                avatar={{
                  avatarUrl: artist.avatar,
                  seed: artist.username,
                }}
                className="-mr-10"
              />
            </Link>
          ))}
        </div>
      </div>

      {showComments ? (
        <ArtworkComments
          comments={artwork.comments}
          artworkId={artwork.id}
          profileRoute={profileRoute}
        />
      ) : null}
    </article>
  )
}
export default ArtworkPost
