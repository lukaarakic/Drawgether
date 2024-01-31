import ArtistCircle from "~/components/ui/ArtistCircle"
import BoxLabel from "~/components/ui/BoxLabel"
import SettingsIcon from "~/assets/misc/settings.svg"
import { GeneralErrorBoundary } from "~/components/error/ErrorBoundry"
import { useArtist } from "~/utils/artist"
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { invariantResponse } from "~/utils/misc"

import { fetchArtworksByUsername } from "~/utils/fetch-data.server"
import { useEffect, useState } from "react"
import SmallArtworkContainer from "~/components/artwork-module/profile-artworks/SmallArtworkContainer"
import ArtworksContainer from "~/components/artwork-module/profile-artworks/ArtworksContainer"

export async function loader({ params }: LoaderFunctionArgs) {
  const username = params.username
  invariantResponse(username, "Can not find artist with that username")

  const artist = await fetchArtworksByUsername(username)
  invariantResponse(artist, "User not found", { status: 404 })

  return json({ artist })
}

const Profile = () => {
  const { artist } = useLoaderData<typeof loader>()
  const loggedInArtist = useArtist()
  const isLoggedInArtist = artist.id === loggedInArtist?.id
  const hasArtworks = artist.artworks.length > 0

  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <div className="mx-auto w-[90%] xs:w-[80rem]">
        <div className="mb-32 flex flex-col items-center justify-center gap-16 md:flex-row">
          <ArtistCircle
            size={16.9}
            avatar={{
              avatarUrl: artist.avatar,
              seed: artist.username,
            }}
          />
          <BoxLabel degree={-2}>
            <div className="flex h-40 w-[41.3rem] items-center justify-between gap-20 px-4">
              <p
                className="text-border text-border-lg text-32"
                data-text={`@${artist.username}`}
              >
                @{artist.username}
              </p>

              {isLoggedInArtist ? (
                <Link to={"settings"} preventScrollReset>
                  <img
                    src={SettingsIcon}
                    alt=""
                    className="pointer-events-none w-20"
                  />
                </Link>
              ) : null}
            </div>
          </BoxLabel>
        </div>

        {hasArtworks ? (
          screenWidth > 768 ? (
            <SmallArtworkContainer artist={artist} />
          ) : (
            <ArtworksContainer
              artworks={artist.artworks}
              profileRoute={artist.username}
            />
          )
        ) : (
          <BoxLabel>
            <p
              className="text-border text-border-sm w-full text-center text-32 text-white"
              data-text="No artworks available"
            >
              No artworks available
            </p>
          </BoxLabel>
        )}
      </div>
      <Outlet />
    </>
  )
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      className="pointer-events-none absolute left-1/2 top-1/2 !h-full -translate-x-1/2 -translate-y-1/2 transform"
      statusHandlers={{
        404: ({ params }) => {
          // eslint-disable-next-line react/no-unescaped-entities
          return <p>There is no artist with username "{params.username}"</p>
        },
      }}
    />
  )
}
export default Profile
