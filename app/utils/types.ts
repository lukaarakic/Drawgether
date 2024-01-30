export type ArtistType = {
  id: string
  username: string
  artworks: {
    select: {
      id: string
      theme: string
      artworkImage: string
      likesCount: number
      artists: {
        select: {
          id: string
          username: string
          avatar: string
        }
      }
      likes: {
        select: {
          artistId: string
        }
      }
      comments: {
        select: {
          id: string
          content: string
          artist: {
            select: {
              id: string
              username: string
              avatar: string
            }
          }
        }
      }
    }
  }
  avatar: string
  email: string
  email_verified: string
}

export type ArtworkPostType = {
  id: string
  theme: string
  likesCount: number
  artworkImage: string
  artists: {
    id: string
    username: string
    avatar: string | null
  }[]
  likes: {
    artistId: string
  }[]
  comments: {
    id: string
    content: string
    artist: {
      id: string
      username: string
      avatar: string | null
    }
  }[]
}