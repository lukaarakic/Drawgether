import { useRouteLoaderData } from "@remix-run/react"
import { type loader as rootLoader } from "~/root"

export function useOptionalArtist() {
  const data = useRouteLoaderData<typeof rootLoader>("root")
  return data?.artist ?? null
}

// Artist must be logged in
export function useArtist() {
  const maybeUser = useOptionalArtist()
  if (!maybeUser) {
    throw new Error("User not found.")
  }
  return maybeUser
}
