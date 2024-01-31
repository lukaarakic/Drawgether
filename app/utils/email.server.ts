import { type ReactElement } from "react"
import { Resend } from "resend"
import { getErrorMessage } from "./misc"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string
  subject: string
  react: ReactElement
}) {
  const from = "support@drawgether.netrunners.work"

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    react,
  })

  if (error) return { status: "error", error: getErrorMessage(data) }

  return { status: "success" } as const
}
