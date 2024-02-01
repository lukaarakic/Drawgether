import type { MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"

// Assets
import PinkLogo from "~/assets/logos/pink_logo.svg"
import LeftCloud from "~/assets/clouds/left_white.svg"
import RightCloud from "~/assets/clouds/right_white.svg"

export const meta: MetaFunction = () => {
  return [
    { title: "Drawgether" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export default function Index() {
  return (
    <main className="grid h-svh place-items-center bg-blue">
      <div className="mx-auto mb-8 flex w-[42rem] items-center justify-center pt-8">
        <img src={PinkLogo} alt="Drawgether logo" width={420} />
      </div>

      <div className=" flex w-full flex-col items-center justify-center">
        <h1
          className="text-border text-border-lg drop-shadow-filter mb-10 rotate-2 text-center text-75 leading-none tracking-tighter text-white md:text-90 lg:text-128"
          data-text="UNLEASH YOUR
        CREATIVE SIDE"
        >
          UNLEASH YOUR <br />
          CREATIVE SIDE
        </h1>

        <div className="box-shadow mb-24 -rotate-2 bg-pink px-4">
          <p className="font-zyzolOutline text-60 leading-tight text-white md:text-90">
            with your friends!
          </p>
        </div>

        <Link
          className="box-shadow flex h-[14.5rem] w-[14.5rem] items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90"
          to={`login`}
          prefetch="intent"
        >
          <div className="rotate-[10deg] text-32 text-white">Start</div>
        </Link>
      </div>

      <div className="">
        <img
          src={LeftCloud}
          alt="Left corner cloud"
          className="pointer-events-none absolute bottom-0 left-0 w-full xs:w-1/2 lg:w-1/3"
        />
        <img
          src={RightCloud}
          alt="Right corner cloud"
          className="pointer-events-none absolute bottom-0 right-0 w-full xs:w-1/2 lg:w-1/3"
        />
      </div>
    </main>
  )
}
