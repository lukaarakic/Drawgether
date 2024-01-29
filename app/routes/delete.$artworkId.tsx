import { ActionFunctionArgs, json } from "@remix-run/node"
import { requireArtist } from "~/utils/auth.server"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"

export async function loader() {
  return json({})
}

export async function action({ request, params }: ActionFunctionArgs) {
  const artworkId = params.artworkId
  const artist = await requireArtist(request)

  invariantResponse(artworkId, "Artwork ID is missing")

  const artworkArtist = await prisma.artist.findMany({
    where: {
      artworks: {
        some: {
          id: artworkId,
        },
      },
    },
    select: {
      id: true,
    },
  })

  const isOwner =
    artworkArtist.filter((artistF) => artistF.id === artist.id).length > 0

  if (!isOwner) throw new Response("You are not authorized", { status: 401 })

  await prisma.artwork.delete({
    where: {
      id: artworkId,
    },
  })

  return json({})
}
