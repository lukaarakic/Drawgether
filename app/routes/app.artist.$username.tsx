import ArtistCircle from "~/components/ArtistCircle"
import BoxLabel from "~/components/BoxLabel"
import SettingsIcon from "~/assets/misc/settings.svg"
import { GeneralErrorBoundary } from "~/components/ErrorBoundry"
import { useOptionalUser } from "~/utils/artist"
import Modal from "~/components/Modal"
import { useState } from "react"
import BoxButton from "~/components/BoxButton"
import { Form, useLoaderData } from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"
import SmallArt from "~/components/SmallArt"

export async function loader({ params }: LoaderFunctionArgs) {
  const artist = await prisma.artist.findFirst({
    select: {
      id: true,
      username: true,
      arts: true,
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
  const [isModalOpen, setIsOpen] = useState(false)

  const data = useLoaderData<typeof loader>()
  const artist = data.artist

  const loggedInArtist = useOptionalUser()
  const isLoggedInArtist = data.artist.id === loggedInArtist?.id

  const maskedEmail = maskEmail(artist.email)

  return (
    <div className="mx-auto mt-24 w-[90%] xs:w-[80rem]">
      <div className="mb-32 mt-44 flex flex-col items-center justify-center gap-16 md:flex-row">
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
              <button onClick={() => setIsOpen(true)}>
                <img src={SettingsIcon} alt="" className="w-20" />
              </button>
            ) : null}
          </div>
        </BoxLabel>
      </div>

      {artist.arts.length > 0 ? (
        <div className="grid grid-cols-auto-fit items-center justify-items-center gap-x-4 gap-y-8">
          {artist.arts.map((art, index) => (
            <SmallArt art={art.art} key={art.id} index={index} />
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

      {isLoggedInArtist ? (
        <Modal
          setIsOpen={setIsOpen}
          isModalOpen={isModalOpen}
          className="mt-12 flex flex-col items-center"
        >
          <p
            className="text-border mb-12 text-center text-32 text-blue"
            data-text="Settings"
          >
            Settings
          </p>

          <ArtistCircle
            size={16.9}
            avatar={{ avatarUrl: artist.avatar, seed: artist.username }}
          />

          <p className="mt-8 text-29 text-black">
            Username: 🎨{artist.username}
          </p>
          <p className="text-29 text-black">Email: {maskedEmail}</p>

          <p
            className={`mb-10 mt-8 text-29 capitalize ${
              artist.email_verified ? "text-blue" : "text-pink"
            }`}
          >
            {artist.email_verified ? "Email Verified" : "email not verified!"}
          </p>

          <Form method="POST" action="/auth/logout">
            <AuthenticityTokenInput />
            <BoxButton>
              <p
                className="text-border px-12 py-2 font-zyzol text-38 uppercase"
                data-text="Log out"
              >
                Log out
              </p>
            </BoxButton>
          </Form>
        </Modal>
      ) : null}
    </div>
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

function maskEmail(email: string): string {
  const [username, domain] = email.split("@")
  const maskedUsername =
    username.charAt(0) + "*".repeat(3) + username.charAt(username.length - 1)
  return maskedUsername + "@" + domain
}

export default Profile
