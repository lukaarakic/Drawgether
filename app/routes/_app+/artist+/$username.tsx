import ArtistCircle from "~/components/ui/ArtistCircle"
import BoxLabel from "~/components/ui/BoxLabel"
import SettingsIcon from "~/assets/misc/settings.svg"
import { GeneralErrorBoundary } from "~/components/error/ErrorBoundry"
import { useOptionalArtist } from "~/utils/artist"
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"
import SmallArt from "~/components/SmallArt"

export async function loader({ params }: LoaderFunctionArgs) {
  const artist = await prisma.artist.findFirst({
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
      username: params.username,
    },
  })

  invariantResponse(artist, "User not found", { status: 404 })

  return json({ artist })
}

const Profile = () => {
  const data = useLoaderData<typeof loader>()
  const artist = data.artist

  const loggedInArtist = useOptionalArtist()
  const isLoggedInArtist = data.artist.id === loggedInArtist?.id

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
                className="text-border text-32"
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

        {artist.artworks.length > 0 ? (
          <div className="grid grid-cols-auto-fit items-center justify-items-center gap-x-4 gap-y-8">
            {artist.artworks.map((artwork, index) => (
              <Link key={artwork.id} to={`artwork/${artwork.id}`}>
                <SmallArt art={artwork.artworkImage} index={index} />
              </Link>
            ))}
          </div>
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
