import { LoaderFunctionArgs, json } from "@remix-run/node"
import { Outlet, useParams } from "@remix-run/react"
import { useEffect } from "react"

import Navbar from "~/components/Navbar"
import { useArtist } from "~/utils/artist"
import { requireArtist } from "~/utils/auth.server"

export async function loader({ request }: LoaderFunctionArgs) {
  await requireArtist(request)

  return json({})
}

const AppIndex = () => {
  const artist = useArtist()
  const params = useParams()

  useEffect(() => {
    document.body.classList.remove("stop-scroll")
  }, [params])

  return (
    <>
      <header>
        <Navbar username={artist.username} />
      </header>
      <main className="mt-20 flex items-center justify-center">
        <Outlet />
      </main>
    </>
  )
}

export default AppIndex
