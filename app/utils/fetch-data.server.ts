import { prisma } from "./db.server"

export async function fetchUniqueArtwork(artworkId: string) {
  return await prisma.artwork.findUnique({
    where: {
      id: artworkId,
    },
    select: {
      id: true,
      theme: true,
      likesCount: true,
      artworkImage: true,
      artists: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      likes: {
        select: {
          artistId: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          artist: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  })
}

export async function fetchArtistByUsername(username: string) {
  return await prisma.artist.findFirst({
    select: {
      id: true,
      username: true,
      artworks: {
        select: {
          artworkImage: true,
          id: true,
        },
      },
      avatar: true,
      email: true,
      email_verified: true,
    },
    where: {
      username,
    },
  })
}

export async function fetchArtworksByUsername(username: string) {
  return await prisma.artist.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      artworks: {
        select: {
          id: true,
          theme: true,
          artworkImage: true,
          likesCount: true,
          artists: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          likes: {
            select: {
              artistId: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              artist: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              created_at: "desc",
            },
          },
        },
        orderBy: [
          {
            created_at: "desc",
          },
          {
            theme: "asc",
          },
        ],
      },
      avatar: true,
      email: true,
      email_verified: true,
    },
  })
}
