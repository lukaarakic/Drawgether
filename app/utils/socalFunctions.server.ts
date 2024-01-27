import { prisma } from "./db.server"

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
  const liked = await prisma.artwork.findUnique({
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
        }
      : {
          likes: {
            delete: {
              id: liked?.likes[0].id,
            },
          },
        }

  await prisma.artwork.update({
    where: {
      id: artworkId,
    },
    data: updateData,
  })
}
