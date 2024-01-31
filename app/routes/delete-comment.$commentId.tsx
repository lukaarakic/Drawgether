import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { requireArtist } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"

export async function loader({ request }: LoaderFunctionArgs) {
  await requireArtist(request)

  return json({})
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const artist = await requireArtist(request)

  await checkCSRF(formData, request)
  const commentId = params.commentId
  invariantResponse(commentId, "Comment ID parametar is required")

  await prisma.comment
    .deleteMany({
      where: {
        AND: [
          {
            id: commentId,
          },
          {
            artist: {
              id: artist.id,
            },
          },
        ],
      },
    })
    .catch((e) => {
      return new Response("No comment found. Error" + e, { status: 404 })
    })

  return json({})
}
