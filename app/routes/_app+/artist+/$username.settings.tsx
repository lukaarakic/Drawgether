import { LoaderFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import ArtistCircle from "~/components/ui/ArtistCircle"
import BoxButton from "~/components/ui/BoxButton"
import Modal from "~/components/ui/Modal"
import { requireArtist } from "~/utils/auth.server"
import { fetchArtistByUsername } from "~/utils/fetch-data.server"
import { invariantResponse } from "~/utils/misc"

export async function loader({ request, params }: LoaderFunctionArgs) {
  const artist = await requireArtist(request)
  const username = params.username
  invariantResponse(username, "Username is required")

  const owner = await fetchArtistByUsername(username)

  invariantResponse(owner, "An Artist with this username does not exist!", {
    status: 404,
  })
  invariantResponse(artist.id === owner.id, "You are unauthorized", {
    status: 401,
  })

  return json({ owner })
}

const ArtsitSettings = () => {
  const { owner } = useLoaderData<typeof loader>()
  const maskedEmail = maskEmail(owner.email)

  return (
    <Modal>
      <div className="mt-12 flex flex-col items-center">
        <p
          className="text-border mb-12 text-center text-32 text-blue"
          data-text="Settings"
        >
          Settings
        </p>
        <ArtistCircle
          size={16.9}
          avatar={{ avatarUrl: owner.avatar, seed: owner.username }}
        />
        <p className="mt-8 text-29 text-black">Username: @{owner.username}</p>
        <p className="text-29 text-black">Email: {maskedEmail}</p>
        <p
          className={`mb-10 mt-8 text-29 capitalize ${
            owner.email_verified ? "text-blue" : "text-pink"
          }`}
        >
          {owner.email_verified ? "Email Verified" : "email not verified!"}
        </p>
        <Form method="POST" action="/logout">
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
    </Modal>
  )
}

export default ArtsitSettings

function maskEmail(email: string): string {
  const [username, domain] = email.split("@")
  const maskedUsername =
    username.charAt(0) + "*".repeat(3) + username.charAt(username.length - 1)
  return maskedUsername + "@" + domain
}
