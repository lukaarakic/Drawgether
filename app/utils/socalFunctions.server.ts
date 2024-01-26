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
  const liked = await prisma.art.findUnique({
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

  if (liked?.likes.length === 0) {
    await prisma.art.update({
      where: {
        id: artworkId,
      },
      data: {
        likes: {
          create: {
            artistId: artist.id,
          },
        },
        likesCount: {
          increment: 1,
        },
      },
    })
  } else {
    await prisma.art.update({
      where: {
        id: artworkId,
      },
      data: {
        likes: {
          delete: {
            id: liked?.likes[0].id,
          },
        },
        likesCount: {
          decrement: 1,
        },
      },
    })
  }
}
