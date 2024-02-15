import { LoaderFunctionArgs, json } from "@remix-run/node"
import { Outlet } from "@remix-run/react"

import Navbar from "~/components/Navbar"
import { useArtist } from "~/utils/artist"
import { requireArtist } from "~/utils/auth.server"

export async function loader({ request }: LoaderFunctionArgs) {
  await requireArtist(request)

  return json({})
}

const AppIndex = () => {
  const artist = useArtist()

  return (
    <>
      <header>
        <Navbar username={artist.username} />
      </header>
      <main className="mt-20 flex items-center justify-center md:mt-72">
        <Outlet />
      </main>
    </>
  )
}

export default AppIndex
