import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { HoneypotInputs } from "remix-utils/honeypot/react"
import { useDebounce } from "use-debounce"
import { z } from "zod"
import BoxButton from "~/components/ui/BoxButton"
import ErrorList from "~/components/error/ErrorList"
import { GeneralErrorBoundary } from "~/components/error/ErrorBoundry"
import { checkCSRF } from "~/utils/csrf.server"
import { checkHoneypot } from "~/utils/honeypot.server"
import {
  EmailSchema,
  PasswordSchema,
  UsernameSchema,
} from "~/utils/user-validation"
import { prisma } from "~/utils/db.server"
import {
  getSessionExpirationDate,
  requireAnonymous,
  signup,
} from "~/utils/auth.server"
import { sessionStorage } from "~/utils/session.server"
import scribbleSfx from "~/assets/audio/scribble.wav"
import { useIsPending } from "~/utils/misc"
import Spinner from "~/components/ui/Spinner/Spinner"

const RegisterSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  remember: z.boolean().optional(),
})

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request)
  return json({})
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAnonymous(request)
  const formData = await request.formData()

  await checkCSRF(formData, request)
  checkHoneypot(formData)

  const submission = await parse(formData, {
    schema: RegisterSchema.superRefine(async (data, ctx) => {
      const [existingArtistWithUsername, existingArtistWithEmail] =
        await prisma.$transaction([
          prisma.artist.findFirst({
            where: { username: data.username },
            select: {
              id: true,
            },
          }),
          prisma.artist.findFirst({
            where: { email: data.email },
            select: {
              id: true,
            },
          }),
        ])

      if (existingArtistWithUsername) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "An Artist already exists with this username",
        })
        return
      }

      if (existingArtistWithEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "An Artist already exists with this email",
        })
        return
      }
    }).transform(async (data) => {
      const artist = await signup(data)
      return { ...data, artist }
    }),
    async: true,
  })

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const)
  }

  if (!submission.value?.artist) {
    return json({ status: "error", submission } as const, { status: 400 })
  }

  const { artist, remember } = submission.value

  const cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie"),
  )
  cookieSession.set("artistId", artist.id)

  throw redirect("/home", {
    headers: {
      "set-cookie": await sessionStorage.commitSession(cookieSession, {
        expires: remember ? getSessionExpirationDate() : undefined,
      }),
    },
  })
}

const SignUpPage = () => {
  const actionData = useActionData<typeof action>()
  const isPending = useIsPending()

  const [username, setUsername] = useState("")
  const [debouncedUsername] = useDebounce(username, 500)

  const [form, fields] = useForm({
    id: "register-form",
    constraint: getFieldsetConstraint(RegisterSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: RegisterSchema })
    },
  })

  function play() {
    new Audio(scribbleSfx).play()
  }

  return (
    <div>
      <Form
        method="POST"
        className="mb-12 flex flex-col items-center gap-4 text-20"
        {...form.props}
      >
        <HoneypotInputs />
        <AuthenticityTokenInput />

        <div className="relative text-center">
          <div className="border-only absolute -top-2 left-0 z-10 flex h-36 w-36 items-center justify-center rounded-full bg-white">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${
                debouncedUsername ? debouncedUsername : "drawgether"
              }`}
              alt="Usernames avatar"
              width="95%"
              height="95%"
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            className={`input rotate-[1.4deg] pl-40 ${
              fields.username.error ? "mb-4" : ""
            }`}
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
            {...conform.input(fields.username)}
          />
          <div className="w-[55rem]">
            <ErrorList
              id={fields.username.errorId}
              errors={fields.username.errors}
            />
          </div>
        </div>

        <div className="text-center">
          <input
            type="email"
            placeholder="lets@drawgether.com"
            className={`input -rotate-[1.18deg] ${
              fields.email.error ? "mb-4" : ""
            }`}
            {...conform.input(fields.email)}
          />
          <ErrorList id={fields.email.errorId} errors={fields.email.errors} />
        </div>

        <div className="text-center">
          <input
            type="password"
            placeholder="********"
            className="input mb-4 rotate-[1.7deg]"
            {...conform.input(fields.password)}
          />
          <ErrorList
            id={fields.password.errorId}
            errors={fields.password.errors}
          />
        </div>

        <div>
          <div className="checkbox">
            <input
              type="checkbox"
              className="check"
              {...conform.input(fields.remember, { type: "checkbox" })}
              onChange={play}
            />
            <label
              htmlFor={fields.remember.id}
              className="flex items-center justify-center"
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 100 100"
                className="drop-shadow-filter"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={28}
                  strokeWidth="4"
                  stroke="#212121"
                  fill="#ffffff"
                />
                <g transform="translate(0,-952.36222)">
                  <path
                    d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4 "
                    stroke="#de6b9b"
                    strokeWidth="5"
                    fill="none"
                    className="path1"
                  />
                </g>
              </svg>
              <span
                className="text-border text-border-sm text-20 text-white"
                data-text="Remember me?"
              >
                Remember me?
              </span>
            </label>
          </div>
        </div>

        <ErrorList id={form.errorId} errors={form.errors} />

        <BoxButton degree={1} type="submit" className="px-32">
          <p className={`text-60 ${isPending ? "animate-spin" : ""}`}>
            {isPending ? <Spinner /> : "Register"}
          </p>
        </BoxButton>
      </Form>

      <div className="text-center text-25 text-white">
        <p
          className="text-border text-border-sm"
          data-text="Already registered? "
        >
          Already registered?{" "}
          <Link
            to={"/login"}
            className="text-border text-border-sm text-pink underline"
            data-text="Log in."
          >
            Log in.
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUpPage

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
