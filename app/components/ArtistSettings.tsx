import { Form } from "@remix-run/react"
import ArtistCircle from "./ui/ArtistCircle"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import BoxButton from "./ui/BoxButton"
import { FC } from "react"
import generateRandomRotation from "~/utils/generate-random-rotation"
import CloseSVG from "~/assets/misc/close.svg"

interface ArtistSettingsProps {
  isModalOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  artist: {
    avatar: string | null
    username: string
    email_verified: boolean
    id: string
    email: string
    artworks: {
      id: string
      artworkImage: string
    }[]
  }
  maskedEmail: string
}

const ArtistSettings: FC<ArtistSettingsProps> = ({
  setIsOpen,
  isModalOpen,
  artist,
  maskedEmail,
}) => {
  return (
    <div className={`${isModalOpen ? "" : "hidden"}`}>
      <div className="pointer-events-none fixed left-0 top-0 z-40 h-screen w-screen cursor-default bg-black bg-opacity-50">
        &nbsp;
      </div>

      <div
        className={`box-shadow fixed left-1/2 top-1/2 z-50 h-[64rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 transform bg-white`}
        style={{
          rotate: `${generateRandomRotation(new Date().getHours() % 12)}deg`,
        }}
      >
        <button
          className="fixed right-5 top-5 h-8 w-8"
          onClick={() => setIsOpen(false)}
        >
          <img src={CloseSVG} alt="" className="h-full w-full" />
        </button>

        <div className="mt-12 flex flex-col items-center">
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
            Username: @{artist.username}
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
        </div>
      </div>
    </div>
  )
}
export default ArtistSettings
