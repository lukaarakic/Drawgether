import { useArtist } from "./artist"

export function artistHasRole(
  artist: Pick<ReturnType<typeof useArtist>, "roles"> | null,
  role: string,
) {
  if (!artist) return false
  return artist.roles.some((r) => r.name === role)
}
