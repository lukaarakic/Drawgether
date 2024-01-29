import { ActionFunctionArgs, json } from "@remix-run/node"
import { requireArtist } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { invariantResponse } from "~/utils/misc"
import { like } from "~/utils/social-function.server"

export async function loader() {
  return json({})
}

export async function action({ request, params }: ActionFunctionArgs) {
  const artworkId = params.artworkId
  const artist = await requireArtist(request)

  invariantResponse(artworkId, "Artwork ID is missing")

  const formData = await request.formData()
  await checkCSRF(formData, request)

  await like({ artist, artworkId })

  return json({})
}
