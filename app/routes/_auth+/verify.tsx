/* eslint-disable react/no-unescaped-entities */
import { Submission, conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { generateTOTP, verifyTOTP } from "@epic-web/totp"
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node"
import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"
import ErrorList from "~/components/error/ErrorList"
import BoxButton from "~/components/ui/BoxButton"
import { requireArtist } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import { getDomainUrl, useIsPending } from "~/utils/misc"
import { handleResetPasswordVerification } from "./reset-password"
// import { handleResetPasswordVerification } from "./reset-password"

export const codeQueryParam = "code"
export const targetQueryParam = "target"
export const typeQueryParam = "type"
export const redirectToQueryParam = "redirectTo"

const types = ["verification", "reset-password"] as const
const VerificationTypeSchema = z.enum(types)
export type VerificationTypes = z.infer<typeof VerificationTypeSchema>

const VerifySchema = z.object({
  [codeQueryParam]: z.string().min(6).max(6),
  [typeQueryParam]: VerificationTypeSchema,
  [targetQueryParam]: z.string(),
  [redirectToQueryParam]: z.string().optional(),
})

export async function loader({ request }: LoaderFunctionArgs) {
  const params = new URL(request.url).searchParams
  if (!params.has(codeQueryParam)) {
    return json({
      status: "idle",
      submission: {
        intent: "",
        payload: Object.fromEntries(params) as Record<string, unknown>,
        error: {} as Record<string, Array<string>>,
      },
    } as const)
  }
  return validateRequest(request, params)
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  await checkCSRF(formData, request)
  return validateRequest(request, formData)
}

export function getRedirectToUrl({
  request,
  type,
  target,
}: {
  request: Request
  type: VerificationTypes
  target: string
  redirectTo?: string
}) {
  const redirectToUrl = new URL(`${getDomainUrl(request)}/verify`)
  redirectToUrl.searchParams.set(typeQueryParam, type)
  redirectToUrl.searchParams.set(targetQueryParam, target)

  return redirectToUrl
}

export async function prepareVerification({
  period,
  request,
  type,
  target,
  // redirectTo: postVerificationRedirectTo,
}: {
  period: number
  request: Request
  type: VerificationTypes
  target: string
  redirectTo?: string
}) {
  const verifyUrl = getRedirectToUrl({
    request,
    type,
    target,
  })
  const redirectTo = new URL(verifyUrl.toString())

  const { otp, ...verificationConfig } = generateTOTP({
    algorithm: "SHA256",
    period,
  })

  const verificationData = {
    type,
    target,
    ...verificationConfig,
    expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
  }
  await prisma.verification.upsert({
    where: { target_type: { target, type } },
    create: verificationData,
    update: verificationData,
  })

  verifyUrl.searchParams.set(codeQueryParam, otp)

  return { otp, redirectTo, verifyUrl }
}

export async function isCodeValid({
  code,
  type,
  target,
}: {
  code: string
  type: VerificationTypes
  target: string
}) {
  const verification = await prisma.verification.findUnique({
    where: {
      target_type: { target, type },
      OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
    },
    select: { algorithm: true, secret: true, period: true, charSet: true },
  })
  if (!verification) return false
  const result = verifyTOTP({
    otp: code,
    secret: verification.secret,
    algorithm: verification.algorithm,
    period: verification.period,
    charSet: verification.charSet,
  })
  if (!result) return false

  return true
}

export type VerifyFunctionArgs = {
  request: Request
  submission: Submission<z.infer<typeof VerifySchema>>
  body: FormData | URLSearchParams
}

async function validateRequest(
  request: Request,
  body: URLSearchParams | FormData,
) {
  const submission = await parse(body, {
    schema: () =>
      VerifySchema.superRefine(async (data, ctx) => {
        const codeIsValid = await isCodeValid({
          code: data[codeQueryParam],
          type: data[typeQueryParam],
          target: data[targetQueryParam],
        })

        if (!codeIsValid) {
          ctx.addIssue({
            path: ["code"],
            code: z.ZodIssueCode.custom,
            message: "Invalid code",
          })
          return z.NEVER
        }
      }),

    async: true,
  })

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const)
  }
  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 })
  }

  const { value: submissionValue } = submission

  await prisma.verification.delete({
    where: {
      target_type: {
        target: submissionValue[targetQueryParam],
        type: submissionValue[typeQueryParam],
      },
    },
  })

  switch (submissionValue[typeQueryParam]) {
    case "verification":
      return handleEmalVerification(request)
    case "reset-password":
      return handleResetPasswordVerification({ request, body, submission })

    default:
      throw new Response("Invalid verification type", { status: 400 })
  }
}

async function handleEmalVerification(request: Request) {
  const artist = await requireArtist(request)

  await prisma.artist.update({
    where: {
      id: artist.id,
    },
    data: {
      email_verified: true,
    },
  })

  return redirect("/home")
}

const Verify = () => {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [searchParams] = useSearchParams()
  const isPending = useIsPending()

  const [form, fields] = useForm({
    id: "verify-form",
    lastSubmission: actionData?.submission ?? data.submission,
    constraint: getFieldsetConstraint(VerifySchema),
    onValidate({ formData }) {
      return parse(formData, { schema: VerifySchema })
    },
    defaultValue: {
      code: searchParams.get(codeQueryParam) ?? "",
      typeQueryParam: searchParams.get(typeQueryParam),
      target: searchParams.get(targetQueryParam) ?? "",
      redirectTo: searchParams.get(redirectToQueryParam) ?? "",
    },
  })

  return (
    <div className="flex flex-col items-center md:-mt-20">
      <div className="mb-20 text-center">
        <h1
          className="text-border md:text-border-lg block text-45 text-white md:text-90"
          data-text="Check your email"
        >
          Check your email
        </h1>
        <p
          className="text-border md:text-border-lg text-22 text-white opacity-90 md:-mt-4 md:text-40"
          data-text="We've sent you a code to verify your email adderss"
        >
          We've sent you a code to verify your email adderss
        </p>
      </div>

      <Form method="POST" {...form.props}>
        <AuthenticityTokenInput />
        <div className="flex flex-col items-center xs:flex-row">
          <div className="text-center">
            <input
              type="text"
              className="input mb-4 w-full md:w-[55rem]"
              placeholder="Your code goes here"
              {...conform.input(fields[codeQueryParam])}
            />
            <ErrorList
              errors={fields[codeQueryParam].errors}
              id={fields[codeQueryParam].errorId}
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

        <input {...conform.input(fields[typeQueryParam], { type: "hidden" })} />
        <input
          {...conform.input(fields[targetQueryParam], { type: "hidden" })}
        />
        <input
          {...conform.input(fields[redirectToQueryParam], { type: "hidden" })}
        />
      </Form>
      <ErrorList errors={form.errors} id={form.errorId} />
    </div>
  )
}
export default Verify
