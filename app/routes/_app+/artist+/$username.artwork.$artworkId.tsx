import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { requireArtist } from "~/utils/auth.server"
import { invariantResponse } from "~/utils/misc"
import ArtworkPost from "~/components/artwork-module/ArtworkPost"
import CommentContainer from "~/components/comment-module/CommentsContainer"
import { checkCSRF } from "~/utils/csrf.server"
import Modal from "~/components/ui/Modal"
import { like } from "~/utils/social-function.server"
import { useLoaderData } from "@remix-run/react"
import { fetchUniqueArtwork } from "~/utils/fetch-data.server"

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireArtist(request)
  const artworkId = params.artworkId

  invariantResponse(artworkId, "Artwork ID is missing")

  const artwork = await fetchUniqueArtwork(artworkId)
  if (!artwork) throw new Response("No artwork found", { status: 400 })

  return json({ artwork })
}

export async function action({ request }: ActionFunctionArgs) {
  const artist = await requireArtist(request)

  const formData = await request.formData()
  await checkCSRF(formData, request)

  const intent = formData.get("intent")
  const artworkId = formData.get("artworkId") as string

  if (intent === "like") {
    invariantResponse(artworkId, "Artwork ID not found 🥲")
    await like({ artist, artworkId })
  }

  return null
}

const ShowArtwork = () => {
  const { artwork } = useLoaderData<typeof loader>()

  return (
    <Modal
      boxClassName="w-max h-min top-[52.5%]"
      className="grid w-max grid-cols-2 items-start justify-items-center"
    >
      <ArtworkPost
        artwork={artwork}
        index={1}
        className="w-full scale-90"
        showComments={false}
      />

      <CommentContainer artwork={artwork} artworkId={artwork.id} />
    </Modal>
  )
}
export default ShowArtwork
