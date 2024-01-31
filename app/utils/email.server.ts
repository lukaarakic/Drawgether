import { Resend } from "resend"
import { getErrorMessage } from "./misc"

export async function sendEmail(options: {
  to: string
  subject: string
  html?: string
  text: string
}) {
  const email = {
    from: "verify@drawgether.netrunners.work",
    ...options,
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send(email)

  if (error) return { status: "error", error: getErrorMessage(data) }

  return { status: "success" } as const
}
