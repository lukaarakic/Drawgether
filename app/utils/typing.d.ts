declare module "@uiw/color-convert" {
  export function hsvaToHex(hsva: HsvaColor): string
}

declare module "@uiw/color-convert" {
  export function rgbStringToHsva(rgb: string): string
}

type ArtistType = {
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

type ArtworkPostType = {
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

type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  prevPoint: Point | null
}

type Point = {
  x: number
  y: number
}

type HsvaColor = { h: number; s: number; v: number; a: number }

type toolType = "pencil" | "eyedropper" | "eraser"
