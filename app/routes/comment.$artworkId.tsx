import { parse } from "@conform-to/zod"
import { ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import { requireArtist } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"

export async function loader() {
  return json({})
}

export const CommentSchema = z.object({
  content: z.string().min(4).max(140),
})

export async function action({ request, params }: ActionFunctionArgs) {
  const artist = await requireArtist(request)

  const formData = await request.formData()
  await checkCSRF(formData, request)

  const submission = parse(formData, {
    schema: CommentSchema,
  })

  if (!submission.value) {
    return json({ status: "error", submission }, { status: 400 })
  }

  const { content } = submission.value

  const { artworkId } = params

  invariantResponse(artworkId, "Artwork ID parameter is missing")

  await prisma.comment.create({
    data: {
      content,
      artId: artworkId,
      artistId: artist.id,
    },
  })

  return json({ submission })
}
