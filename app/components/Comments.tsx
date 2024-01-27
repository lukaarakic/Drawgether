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

const Comments = ({
  comments,
  artworkId,
}: {
  comments: CommentsType
  artworkId: string
}) => {
  const hasComments = comments.length > 0

  return (
    <div
      className="box-shadow bg-blue px-6 py-6 text-20 text-white"
      style={{
        rotate: `${generateRandomRotation((new Date().getHours() % 10) + 2)}deg`,
      }}
    >
      {hasComments
        ? comments.slice(0, 2).map((comment) => {
            const isCommentLong = comment.content.length > 25
            const content = isCommentLong
              ? `${comment.content.slice(0, 25)}...`
              : comment.content

            return (
              <div key={comment.id}>
                <Link
                  to={`/app/artist/${comment.artist.username}`}
                  className="text-border text-pink"
                  data-text={`@${comment.artist.username}:`}
                >
                  @{comment.artist.username}:
                </Link>
                <p className="text-border ml-2" data-text={content}>
                  {content}
                </p>
              </div>
            )
          })
        : null}

      <Link
        to={`/app/home/comment/${artworkId}`}
        preventScrollReset
        data-text={
          hasComments
            ? "View more..."
            : "Be the first to comment on this artwork"
        }
        className={`text-border ${hasComments ? "mt-5" : ""}`}
      >
        {hasComments
          ? "View more..."
          : "Be the first to comment on this artwork"}
      </Link>
    </div>
  )
}

export default Comments
