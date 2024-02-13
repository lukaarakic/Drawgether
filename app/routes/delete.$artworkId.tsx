import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { GeneralErrorBoundary } from "~/components/error/ErrorBoundry"
import { requireArtistWithRole } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"
import { artistHasRole } from "~/utils/permissions"

export async function loader({ request }: LoaderFunctionArgs) {
  await requireArtistWithRole(request)

  return json({})
}

export default function DeleteArtwork() {
  return <ErrorBoundary />
}

export async function action({ request, params }: ActionFunctionArgs) {
  const artworkId = params.artworkId
  const artist = await requireArtistWithRole(request)

  invariantResponse(artworkId, "Artwork ID is missing")

  const formData = await request.formData()
  await checkCSRF(formData, request)

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
  const isAdmin = artistHasRole(artist, "admin")

  if (!isOwner && !isAdmin)
    throw new Response("Not authorized 🚓", { status: 401 })

  await prisma.artwork.delete({
    where: {
      id: artworkId,
    },
  })

  return json({})
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      defaultStatusHandler={() => <p>Something went wront 😢</p>}
      statusHandlers={{
        401: () => {
          return <p>You are not authorized for this action</p>
        },
      }}
    />
  )
}
