import generateRandomRotation from "~/utils/getRandomRotation"
import BoxLabel from "./BoxLabel"
import { Link } from "@remix-run/react"
import LikePost from "./Like"
import ArtistCircle from "./ArtistCircle"
import Comments from "./Comments"
import { useArtist } from "~/utils/artist"
import CommentIcon from "~/assets/misc/comment.svg"
import TrashIcon from "~/assets/misc/trash.svg"

type ArtworkPostType = {
  id: string
  theme: string
  likesCount: number
  artworkImage: string
  artists: {
    id: string
    username: string
    avatar: string | null
  }[]
  likes: {
    artistId: string
  }[]
  comments: {
    id: string
    content: string
    artist: {
      id: string
      username: string
      avatar: string | null
    }
  }[]
}

const ArtworkPost = ({
  artwork,
  index,
}: {
  artwork: ArtworkPostType
  index: number
}) => {
  const artist = useArtist()

  return (
    <article className="mx-auto mb-80 w-[90%] xs:w-[57.2rem]">
      <BoxLabel degree={generateRandomRotation((index % 12) + 1)}>
        <p
          data-text={artwork.theme}
          className="text-border whitespace-break-spaces p-2 text-25 md:text-32"
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
          className="box-shadow mt-5 h-[57.2rem] w-[57.2rem] object-cover"
        />

        <div className="absolute -bottom-12 -left-5 flex">
          <LikePost
            artworkId={artwork.id}
            likesCount={artwork.likesCount}
            isLiked={
              artwork.likes.filter((like) => like.artistId === artist.id)
                .length > 0
            }
          />
          <Link to={`/app/home/comment/${artwork.id}`}>
            <img src={CommentIcon} alt="" className="h-24 w-24" />
          </Link>
          {artwork.artists.filter((artistF) => artistF.id === artist.id)
            .length > 0 ? (
            <img src={TrashIcon} alt="" className="h-24 w-24" />
          ) : null}
        </div>

        <div className="absolute -bottom-16 -right-8 flex items-baseline">
          {artwork.artists.map((artist) => (
            <Link to={`/app/artist/${artist.username}`} key={artist.id}>
              <ArtistCircle
                size={6.8}
                avatar={{
                  avatarUrl: artist.avatar,
                  seed: artist.username,
                }}
              />
            </Link>
          ))}
        </div>
      </div>

      <Comments comments={artwork.comments} artworkId={artwork.id} />
    </article>
  )
}
export default ArtworkPost
