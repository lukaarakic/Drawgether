/* eslint-disable react/no-unescaped-entities */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node"
import * as E from "@react-email/components"
import { Form, useLoaderData } from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import ArtistCircle from "~/components/ui/ArtistCircle"
import BoxButton from "~/components/ui/BoxButton"
import Modal from "~/components/ui/Modal"
import { prepareVerification } from "~/routes/_auth+/verify"
import { requireArtist } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"

import { sendEmail } from "~/utils/email.server"
import { fetchArtistByUsername } from "~/utils/fetch-data.server"
import { getDomainUrl, invariantResponse } from "~/utils/misc"

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

export async function action({ request }: ActionFunctionArgs) {
  const { email } = await requireArtist(request)
  const formData = await request.formData()
  await checkCSRF(formData, request)

  const redirectToUrl = String(new URL(`${getDomainUrl(request)}`))

  const { verifyUrl, redirectTo, otp } = await prepareVerification({
    period: 10 * 60,
    request,
    type: "verification",
    target: email,
    redirectTo: redirectToUrl,
  })

  const response = await sendEmail({
    to: email,
    subject: `Welcome to Drawgether`,
    react: <VerificationEmail otp={otp} redirectTo={verifyUrl.toString()} />,
  })

  if (response.status === "success") {
    return redirect(redirectTo.toString())
  } else {
    return json(
      { status: "error", message: "Please try later" },
      { status: 400 },
    )
  }
}

function VerificationEmail({
  redirectTo,
  otp,
}: {
  redirectTo: string
  otp: string
}) {
  return (
    <E.Html lang="en" dir="ltr">
      <E.Container>
        <h1>
          <E.Text>Drawgether Email Verification</E.Text>
        </h1>
        <p>
          <E.Text>
            Here's your verification code: <strong>{otp}</strong>
          </E.Text>
        </p>
        <p>
          <E.Text>Or click the link:</E.Text>
        </p>
        <E.Link href={redirectTo}>{redirectTo}</E.Link>
      </E.Container>
    </E.Html>
  )
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
        {owner.email_verified ? (
          <p
            className={`mb-10 mt-8 cursor-default text-29 capitalize text-blue`}
          >
            Email verified
          </p>
        ) : (
          <Form method="POST" id="email-form">
            <AuthenticityTokenInput />
            <button
              type="submit"
              className={`mb-10 mt-8 text-29 capitalize text-pink underline`}
            >
              Email not verified!
            </button>
          </Form>
        )}

        <Form method="POST" action="/logout" id="logout-form">
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
