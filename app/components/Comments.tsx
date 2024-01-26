import { Link } from "@remix-run/react"
import generateRandomRotation from "~/utils/getRandomRotation"

type CommentsType = {
  id: string
  content: string
  artist: {
    id: string
    username: string
    avatar: string | null
  }
}[]

const Comments = ({ comments }: { comments: CommentsType }) => {
  return (
    <div
      className="box-shadow bg-blue px-6 py-6 text-20 text-white"
      style={{
        rotate: `${generateRandomRotation((new Date().getHours() % 10) + 2)}deg`,
      }}
    >
      {comments.length > 0
        ? comments.slice(0, 2).map((comment) => (
            <div key={comment.id}>
              <Link
                to={`/app/artist/${comment.artist.username}`}
                className="text-border text-pink"
                data-text={`@${comment.artist.username}:`}
              >
                @{comment.artist.username}:
              </Link>
              <p
                className="text-border ml-2"
                data-text={` ${comment.content.slice(0, 25)}...`}
              >
                {` ${comment.content.slice(0, 25)}...`}
              </p>
            </div>
          ))
        : null}

      <button
        data-text={
          comments.length > 0
            ? "View more..."
            : "Be the first to comment on this artwork"
        }
        className="text-border mt-5"
      >
        {comments.length > 0
          ? "View more..."
          : "Be the first to comment on this artwork"}
      </button>
    </div>
  )
}

export default Comments
