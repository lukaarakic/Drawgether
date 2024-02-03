import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node"
import { themeStorage } from "~/utils/theme.server"
import { useLoaderData } from "@remix-run/react"
import Artboard from "~/components/artboard-module/Artboard"
import BoxLabel from "~/components/ui/BoxLabel"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.theme}` },
    { name: "description", content: `Drawing ${data?.theme}` },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const themeSession = await themeStorage.getSession(
    request.headers.get("cookie"),
  )
  const theme = themeSession.get("theme")
  if (!theme) return redirect("/home/0")

  return json({ theme })
}

const Draw = () => {
  const { theme } = useLoaderData<typeof loader>()

  return (
    <div>
      <BoxLabel className="mx-auto mb-8 max-w-max" degree={2}>
        <p
          className="text-border text-border-lg px-4 text-center text-36"
          data-text={theme}
        >
          {theme}
        </p>
      </BoxLabel>
      <Artboard />
    </div>
  )
}
export default Draw
