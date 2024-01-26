import { Link } from "@remix-run/react"
import ArtistCircle from "./ArtistCircle"
import BoxLabel from "./BoxLabel"

const ModalComments = ({
  comments,
}: {
  comments: {
    id: string
    artist: {
      id: string
      username: string
      avatar: string | null
    }
    content: string
  }[]
}) => {
  return (
    <div className="mx-auto h-[41.5rem] w-[90%] overflow-y-scroll">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={`${comment.id}${comment.artist.id}`}
            className="mb-24 flex items-start gap-5"
          >
            <Link to={`/app/artist/${comment.artist.username}`}>
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
                    className="text-border text-border-sm text-16 py-2 text-justify"
                    data-text={`@${comment.artist.username}`}
                  >
                    @{comment.artist.username}
                  </p>
                </BoxLabel>
              </div>
              <p className="text-22 mt-4 w-[40rem] leading-none text-black">
                {comment.content}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p
          className="text-border mb-24 text-25 text-white"
          data-text="There are no comments on this artwork"
        >
          There are no comments on this artwork
        </p>
      )}
    </div>
  )
}

export default ModalComments
