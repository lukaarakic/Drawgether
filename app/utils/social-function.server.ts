import { parse } from "@conform-to/zod"
import { checkCSRF } from "./csrf.server"
import { prisma } from "./db.server"
import { json } from "@remix-run/node"
import { z } from "zod"
import { profanity } from "@2toad/profanity"

export async function like({
  artworkId,
  artist,
}: {
  artworkId: string
  artist: {
    id: string
    username: string
  }
}) {
  await prisma.$transaction(async ($prisma) => {
    const liked = await $prisma.artwork.findUnique({
      where: {
        id: artworkId,
      },
      select: {
        likes: {
          where: {
            artistId: artist.id,
          },
          select: {
            id: true,
          },
        },
      },
    })

    const updateData =
      liked?.likes.length === 0
        ? {
            likes: {
              create: {
                artistId: artist.id,
              },
            },
            likesCount: {
              increment: 1,
            },
          }
        : {
            likes: {
              delete: {
                id: liked?.likes[0].id,
              },
            },
            likesCount: {
              decrement: 1,
            },
          }

    await $prisma.artwork.update({
      where: {
        id: artworkId,
      },
      data: updateData,
    })
  })
}

export const CommentSchema = z.object({
  content: z.string().transform((val, ctx) => {
    const trimmed = val.trim()

    if (trimmed.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Comment must contain at least 2 characters",
      })

      return z.NEVER
    }

    if (trimmed.length > 150) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Comment must contain at most 150 characters",
      })

      return z.NEVER
    }

    const profanityFilter = profanity.censor(trimmed, 3)

    return profanityFilter
  }),
})

export async function comment({
  request,
  artworkId,
  artist,
}: {
  request: Request
  artworkId: string
  artist: {
    id: string
    username: string
  }
}) {
  const formData = await request.formData()
  await checkCSRF(formData, request)

  const submission = parse(formData, {
    schema: CommentSchema,
  })

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission }, { status: 400 })
  }

  if (!submission.value?.content) {
    return json({ status: "error", submission }, { status: 400 })
  }

  const { content } = submission.value

  await prisma.comment.create({
    data: {
      content,
      artworkId,
      artistId: artist.id,
    },
    select: {
      id: true,
      content: true,
      artist: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  })

  return json({ submission })
}
