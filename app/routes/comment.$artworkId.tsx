import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { requireArtist } from "~/utils/auth.server"
import { invariantResponse } from "~/utils/misc"
import { comment } from "~/utils/social-function.server"

export async function loader({ request }: LoaderFunctionArgs) {
  await requireArtist(request)

  return json({})
}

export async function action({ params, request }: ActionFunctionArgs) {
  const artworkId = params.artworkId
  const artist = await requireArtist(request)
  invariantResponse(artworkId, "Artwork ID parametar is required")

  const submission = await comment({ request, artist, artworkId })
  return submission
}
