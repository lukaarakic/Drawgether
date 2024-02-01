/* eslint-disable react/no-unescaped-entities */
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { z } from "zod"
import { GeneralErrorBoundary } from "~/components/error/ErrorBoundry"
import ErrorList from "~/components/error/ErrorList"
import BoxButton from "~/components/ui/BoxButton"
import { invariantResponse, useIsPending } from "~/utils/misc"
import { PasswordSchema } from "~/utils/user-validation"
import { VerifyFunctionArgs } from "./verify"
import { prisma } from "~/utils/db.server"
import { verifySessionStorage } from "~/utils/verify.server"
import { requireAnonymous, resetUserPassword } from "~/utils/auth.server"

const resetPasswordUsernameSessionKey = "resetPasswordUsername"

export async function handleResetPasswordVerification({
  request,
  submission,
}: VerifyFunctionArgs) {
  invariantResponse(
    submission.value,
    "submission.value should be defined by now",
  )
  const target = submission.value.target
  const user = await prisma.artist.findFirst({
    where: { OR: [{ email: target }, { username: target }] },
    select: { email: true, username: true },
  })
  if (!user) {
    submission.error.code = ["Invalid code"]
    return json({ status: "error", submission } as const, { status: 400 })
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  )
  verifySession.set(resetPasswordUsernameSessionKey, user.username)

  return redirect("/reset-password", {
    headers: {
      "set-cookie": await verifySessionStorage.commitSession(verifySession),
    },
  })
}

const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine(({ confirmPassword, password }) => password === confirmPassword, {
    message: "The passwords did not match",
    path: ["confirmPassword"],
  })

export async function requireResetPasswordUsername(request: Request) {
  await requireAnonymous(request)
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  )
  const resetPasswordUsername = verifySession.get(
    resetPasswordUsernameSessionKey,
  )
  if (typeof resetPasswordUsername !== "string" || !resetPasswordUsername) {
    throw redirect("/sign-up")
  }
  return resetPasswordUsername
}

export async function loader({ request }: LoaderFunctionArgs) {
  const resetPasswordUsername = await requireResetPasswordUsername(request)
  return json({ resetPasswordUsername })
}

export async function action({ request }: ActionFunctionArgs) {
  const resetPasswordUsername = await requireResetPasswordUsername(request)
  const formData = await request.formData()
  const submission = parse(formData, {
    schema: ResetPasswordSchema,
  })
  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const)
  }
  if (!submission.value?.password) {
    return json({ status: "error", submission } as const, { status: 400 })
  }

  await resetUserPassword({
    username: resetPasswordUsername,
    password: submission.value.password,
  })

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  )

  return redirect("/login", {
    headers: {
      "set-cookie": await verifySessionStorage.destroySession(verifySession),
    },
  })
}

export const meta: MetaFunction = () => {
  return [{ title: "Reset Password | Drawgether" }]
}

export default function ResetPasswordPage() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const isPending = useIsPending()

  const [form, fields] = useForm({
    id: "reset-password",
    constraint: getFieldsetConstraint(ResetPasswordSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ResetPasswordSchema })
    },
    shouldRevalidate: "onBlur",
  })

  return (
    <div className="flex flex-col items-center md:-mt-20">
      <div className="mb-20 text-center">
        <h1
          className="text-border md:text-border-lg block text-45 text-white md:text-90"
          data-text="Password reset!"
        >
          Password reset!
        </h1>
        <p
          className="text-border md:text-border-lg text-25 text-white opacity-90 md:-mt-4 md:text-40"
          data-text={`Hi ${data.resetPasswordUsername}, no worries! It happnes all the time 💪`}
        >
          Hi {data.resetPasswordUsername}, no worries! It happnes all the time
          💪
        </p>
      </div>

      <Form
        method="POST"
        {...form.props}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          className="input"
          placeholder="New password"
          {...conform.input(fields.password)}
        />
        <input
          type="text"
          className="input"
          placeholder="Confirm new password"
          {...conform.input(fields.confirmPassword)}
        />

        <ErrorList errors={form.errors} id={form.errorId} />

        <BoxButton
          type="submit"
          className="mt-4 h-min w-min"
          disabled={isPending}
        >
          <p className="px-8 py-1 text-40">Submit</p>
        </BoxButton>
      </Form>
    </div>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
