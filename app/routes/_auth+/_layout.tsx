import type { MetaFunction } from "@remix-run/node"

// Assets
import FullPinkLogo from "~/assets/logos/full_pink_logo.svg"
import LeftCloud from "~/assets/clouds/left_white.svg"
import RightCloud from "~/assets/clouds/right_white.svg"
import { Link, Outlet } from "@remix-run/react"

export const meta: MetaFunction = () => {
  return [
    { title: "Drawgether" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export default function Index() {
  return (
    <div className="relative h-svh  bg-blue">
      <header className="mb-44 flex items-center justify-center pt-8">
        <Link to="/">
          <img
            src={FullPinkLogo}
            alt="Drawgether logo"
            className="h-[21.6rem] w-[29.5rem]"
          />
        </Link>
      </header>

      <main className="grid place-items-center gap-6">
        <Outlet />
      </main>

      <div>
        <img
          src={LeftCloud}
          alt="Left corner cloud"
          className="pointer-events-none absolute bottom-0 left-0 w-1/3"
        />
        <img
          src={RightCloud}
          alt="Right corner cloud"
          className="pointer-events-none absolute bottom-0 right-0 w-1/3"
        />
      </div>
    </div>
  )
}
