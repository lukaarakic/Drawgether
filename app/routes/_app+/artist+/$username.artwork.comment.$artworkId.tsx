import { LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"
import CommentContainer from "~/components/comment-module/CommentsContainer"
import Modal from "~/components/ui/Modal"

export async function loader({ params }: LoaderFunctionArgs) {
  const artworkId = params.artworkId
  invariantResponse(artworkId, "Artwork ID parametar is required")

  const artwork = await prisma.artwork.findUnique({
    where: {
      id: artworkId,
    },
    select: {
      comments: {
        select: {
          id: true,
          content: true,
          artist: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  })

  invariantResponse(artwork, "There is no artwork with this ID")

  return json({ artwork, artworkId })
}

const CommentRoute = () => {
  const { artwork, artworkId } = useLoaderData<typeof loader>()

  return (
    <Modal>
      <CommentContainer artwork={artwork} artworkId={artworkId} />
    </Modal>
  )
}
export default CommentRoute
