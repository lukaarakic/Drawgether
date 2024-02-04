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
import { useEffect, useState } from "react"

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
  const [remainingSeconds, setRemainingSeconds] = useState(10)

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds - minutes * 60

  function formatTime(string: number, pad: string, length: number) {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  const finalTime =
    formatTime(minutes, "0", 2) + ":" + formatTime(seconds, "0", 2)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1)
    }, 1000)
    if (remainingSeconds <= 0) clearInterval(interval)

    return () => clearInterval(interval)
  }, [remainingSeconds])

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

      <div className="mt-8 flex flex-col items-center justify-center">
        <BoxLabel className="w-[25.7rem]" degree={-1.3}>
          <p
            className="text-border text-border-lg px-12 text-65"
            data-text={finalTime}
          >
            {finalTime}
          </p>
        </BoxLabel>
        <p
          className="text-border text-border-lg mt-2 text-25 text-blue"
          data-text="Timer"
        >
          Timer
        </p>
      </div>
    </div>
  )
}
export default Draw
