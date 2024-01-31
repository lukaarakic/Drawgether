/* eslint-disable react/no-unescaped-entities */
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { verifyTOTP } from "@epic-web/totp"
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
import { useIsPending } from "~/utils/misc"

export const codeQueryParam = "code"
export const targetQueryParam = "target"
export const typeQueryParam = "type"
export const redirectToQueryParam = "redirectTo"

const types = ["verification"] as const
const VerificationTypeSchema = z.enum(types)

const VerifySchema = z.object({
  [codeQueryParam]: z.string().min(6).max(6),
  [typeQueryParam]: VerificationTypeSchema,
  [targetQueryParam]: z.string(),
  [redirectToQueryParam]: z.string().optional(),
})

export async function loader({ request }: LoaderFunctionArgs) {
  const artist = await requireArtist(request)
  if (artist.email_verified) return redirect("/home")

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

async function validateRequest(
  request: Request,
  body: URLSearchParams | FormData,
) {
  const artist = await requireArtist(request)
  const submission = await parse(body, {
    schema: () =>
      VerifySchema.superRefine(async (data, ctx) => {
        console.log("verify tis", data)
        const verification = await prisma.verification.findUnique({
          where: {
            target_type: {
              target: data[targetQueryParam],
              type: data[typeQueryParam],
            },
            OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
          },
        })

        if (!verification) {
          ctx.addIssue({
            path: ["code"],
            code: z.ZodIssueCode.custom,
            message: "Invalid code",
          })
          return z.NEVER
        }

        const codeIsValid = verifyTOTP({
          otp: data[codeQueryParam],
          ...verification,
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

  await prisma.$transaction([
    prisma.verification.delete({
      where: {
        target_type: {
          target: submissionValue[targetQueryParam],
          type: submissionValue[typeQueryParam],
        },
      },
    }),

    prisma.artist.update({
      where: {
        id: artist.id,
      },
      data: {
        email_verified: true,
      },
    }),
  ])

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
    <div className="-mt-16 flex flex-col items-center">
      <div className="mb-20 text-center">
        <h1
          className="text-border text-border-lg -mb-4 block text-90 text-white"
          data-text="Check your email"
        >
          Check your email
        </h1>
        <p
          className="text-border text-border-lg text-40 text-white opacity-90"
          data-text="We've sent you a code to verify your email adderss"
        >
          We've sent you a code to verify your email adderss
        </p>
      </div>

      <Form method="POST" {...form.props}>
        <AuthenticityTokenInput />
        <div className="flex items-baseline">
          <div className="text-center">
            <input
              type="text"
              className="input mb-4"
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
