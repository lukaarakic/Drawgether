/* eslint-disable react/no-unescaped-entities */
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import { Link, json } from "react-router-dom"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { HoneypotInputs } from "remix-utils/honeypot/react"
import { z } from "zod"
import ErrorList from "~/components/error/ErrorList"
import BoxButton from "~/components/ui/BoxButton"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import { sendEmail } from "~/utils/email.server"
import { checkHoneypot } from "~/utils/honeypot.server"
import { getDomainUrl } from "~/utils/misc"
import { EmailSchema, UsernameSchema } from "~/utils/user-validation"
import { prepareVerification } from "./verify"
import * as E from "@react-email/components"
import { conform, useForm } from "@conform-to/react"

const ForgotPasswordSchema = z.object({
  usernameOrPassword: z.union([EmailSchema, UsernameSchema]),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  await checkCSRF(formData, request)
  checkHoneypot(formData)

  const submission = await parse(formData, {
    schema: ForgotPasswordSchema.superRefine(async (data, ctx) => {
      const artist = await prisma.artist.findFirst({
        where: {
          OR: [
            { email: data.usernameOrPassword },
            { username: data.usernameOrPassword },
          ],
        },
        select: {
          id: true,
        },
      })
      if (!artist) {
        ctx.addIssue({
          path: ["usernameOrEmail"],
          code: z.ZodIssueCode.custom,
          message: "No artist exists with this username or password",
        })
        return
      }
    }),
    async: true,
  })

  if (submission.intent !== "submit")
    return json({ status: "idle", submission } as const)

  if (!submission.value)
    return json({ status: "error", submission } as const, { status: 400 })

  const { usernameOrPassword } = submission.value

  const artist = await prisma.artist.findFirstOrThrow({
    where: {
      OR: [{ email: usernameOrPassword }, { username: usernameOrPassword }],
    },
    select: {
      email: true,
      username: true,
    },
  })

  const redirectToUrl = String(new URL(`${getDomainUrl(request)}`))

  const { otp, redirectTo, verifyUrl } = await prepareVerification({
    period: 10 * 60,
    request,
    type: "reset-password",
    target: artist.email,
    redirectTo: redirectToUrl,
  })

  const response = await sendEmail({
    to: artist.email,
    subject: `Drawgether Password Reset`,
    react: <ForgotPasswordEmail otp={otp} redirectTo={verifyUrl.toString()} />,
  })

  if (response.status === "success") {
    return redirect(redirectTo.toString())
  } else {
    return json({ status: "error", submission } as const, { status: 500 })
  }
}

function ForgotPasswordEmail({
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
          <E.Text>Drawgether Password Reset</E.Text>
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

export const meta: MetaFunction = () => {
  return [{ title: "Password Recovery for Drawgether" }]
}

const ForgotPassword = () => {
  const forgotPassword = useFetcher<typeof action>()
  const isPending = forgotPassword.state === "submitting"

  const [form, fields] = useForm({
    id: "forgot-password-form",
    constraint: getFieldsetConstraint(ForgotPasswordSchema),
    lastSubmission: forgotPassword.data?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ForgotPasswordSchema })
    },
    shouldRevalidate: "onBlur",
  })

  return (
    <div className="-mt-16 flex flex-col items-center">
      <div className="mb-20 text-center">
        <h1
          className="text-border text-border-lg -mb-4 block text-90 text-white"
          data-text="Forgot password?"
        >
          Forgot password?
        </h1>
        <p
          className="text-border text-border-lg text-40 text-white opacity-90"
          data-text="No problem! Reset instructions on the way!"
        >
          No problem! Reset instructions on the way!
        </p>
      </div>

      <forgotPassword.Form method="POST" {...form.props}>
        <AuthenticityTokenInput />
        <HoneypotInputs />
        <div className="flex items-baseline">
          <div className="text-center">
            <input
              type="text"
              className="input mb-4"
              placeholder="Usename or Email"
              {...conform.input(fields.usernameOrPassword)}
            />
            <ErrorList
              errors={fields.usernameOrPassword.errors}
              id={fields.usernameOrPassword.errorId}
            />
          </div>

          <BoxButton
            type="submit"
            className="ml-8 h-min w-min"
            disabled={isPending}
          >
            <p className="px-8 py-1 text-40">Submit</p>
          </BoxButton>
        </div>
      </forgotPassword.Form>

      <p data-text="Back to" className="text-border mt-8 text-25 text-white">
        Back to{" "}
        <Link
          to={"/login"}
          className="text-border text-pink underline"
          data-text="Login"
        >
          Login
        </Link>
      </p>
      <ErrorList errors={form.errors} id={form.errorId} />
    </div>
  )
}
export default ForgotPassword
