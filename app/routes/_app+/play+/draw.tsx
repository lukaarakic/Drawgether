import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node"
import { themeStorage } from "~/utils/theme.server"
import {
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "@remix-run/react"
import Artboard from "~/components/artboard-module/Artboard"
import BoxLabel from "~/components/ui/BoxLabel"
import { useEffect, useRef, useState } from "react"
import { formatTime } from "~/utils/time"
import { requireArtist } from "~/utils/auth.server"
import { prisma } from "~/utils/db.server"

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

export async function action({ request }: ActionFunctionArgs) {
  const artist = await requireArtist(request)
  const formData = await request.formData()

  const artwork = formData.get("artwork")
  const theme = formData.get("theme")

  const themeSession = await themeStorage.getSession(
    request.headers.get("cookie"),
  )

  await prisma.artwork.create({
    data: {
      artworkImage: artwork as string,
      theme: theme as string,
      artists: {
        connect: {
          id: artist.id,
        },
      },
    },
  })

  return json(
    {},
    {
      headers: {
        "set-cookie": await themeStorage.destroySession(themeSession),
      },
    },
  )
}

const Draw = () => {
  const { theme } = useLoaderData<typeof loader>()
  const [remainingSeconds, setRemainingSeconds] = useState(320)
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const remainingTime = formatTime(remainingSeconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1)
    }, 1000)
    if (remainingSeconds <= 0) clearInterval(interval)

    if (remainingSeconds <= 0) {
      const formData = new FormData()
      const artwork = canvasRef.current?.getContext("2d")?.canvas.toDataURL()

      if (!artwork) return navigate("/home/0")

      formData.append("artwork", artwork)
      formData.append("theme", theme)
      fetcher.submit(formData, { method: "POST" })

      return navigate("finished")
    }

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

      <Artboard canvasRef={canvasRef} />

      <div className="mt-8 flex flex-col items-center justify-center">
        <BoxLabel className="w-[25.7rem]" degree={-1.3}>
          <p
            className="text-border text-border-lg px-12 text-65"
            data-text={remainingTime}
          >
            {remainingTime}
          </p>
        </BoxLabel>
        <p
          className="text-border text-border-lg mt-2 text-25 text-blue"
          data-text="Timer"
        >
          Timer
        </p>
      </div>

      <Outlet />
    </div>
  )
}
export default Draw
