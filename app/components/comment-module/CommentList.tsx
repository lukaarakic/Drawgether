import Comment from "./Comment"

const CommentList = ({
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
          <Comment
            comment={comment}
            key={`${comment.id}${comment.artist.id}`}
          />
        ))
      ) : (
        <p
          className="text-border mb-24 p-8 text-25 text-white"
          data-text="There are no comments on this artwork"
        >
          There are no comments on this artwork
        </p>
      )}
    </div>
  )
}

export default CommentList
