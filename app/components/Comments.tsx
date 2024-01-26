import { Link } from "@remix-run/react"
import { ModalDataType } from "~/routes/app.home"
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
  artwork,
  setModalData,
  setIsOpen,
}: {
  comments: CommentsType
  artwork: ModalDataType
  setModalData: React.Dispatch<React.SetStateAction<ModalDataType | null>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
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
        onClick={() => {
          setModalData(artwork)
          setIsOpen(true)
        }}
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
      </button>
    </div>
  )
}

export default Comments
