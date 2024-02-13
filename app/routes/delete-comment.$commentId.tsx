import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { requireArtistWithRole } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"
import { artistHasRole } from "~/utils/permissions"

export async function loader({ request }: LoaderFunctionArgs) {
  await requireArtistWithRole(request)

  return json({})
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const artist = await requireArtistWithRole(request)

  await checkCSRF(formData, request)
  const commentId = params.commentId
  invariantResponse(commentId, "Comment ID parametar is invalid")

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      artistId: true,
    },
  })

  invariantResponse(comment, "Comment does not exist")

  const isOwner = comment.artistId === artist.id
  const isAdmin = artistHasRole(artist, "admin")

  if (!isOwner && !isAdmin)
    throw new Response("Not authorized 🚓", { status: 401 })

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  })

  return json({})
}
