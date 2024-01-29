import { Link } from "@remix-run/react"
import ArtistCircle from "../ui/ArtistCircle"
import BoxLabel from "../ui/BoxLabel"

export default function Comment({
  comment,
}: {
  comment: {
    artist: {
      id: string
      username: string
      avatar: string | null
    }
    content: string
  }
}) {
  return (
    <div className="mb-24 flex items-start gap-5 overflow-hidden">
      <Link to={`/artist/${comment.artist.username}`} className="flex-shrink-0">
        <ArtistCircle
          size={6}
          avatar={{
            avatarUrl: comment.artist.avatar,
            seed: comment.artist.username,
          }}
        />
      </Link>

      <div>
        <div className="w-min">
          <BoxLabel>
            <p
              className="text-border text-border-sm py-2 text-justify text-16"
              data-text={`@${comment.artist.username}`}
            >
              @{comment.artist.username}
            </p>
          </BoxLabel>
        </div>
        <p className="mt-4 w-[40rem] break-words text-22 leading-none text-black">
          {comment.content}
        </p>
      </div>
    </div>
  )
}
