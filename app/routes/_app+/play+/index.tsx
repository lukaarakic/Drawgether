/* eslint-disable react/no-unescaped-entities */
import { MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { isMobile } from "react-device-detect"
import { GeneralErrorBoundary } from "~/components/error/ErrorBoundry"
import FullLogo from "~/assets/logos/full_both_logo.svg"
import StartSFX from "~/assets/audio/start.wav"

export const meta: MetaFunction = () => {
  return [{ title: "Let's Draw" }, { name: "description", content: "Draw" }]
}

const Index = () => {
  function play() {
    new Audio(StartSFX).play()
  }

  if (isMobile) {
    return (
      <div className="absolute left-1/2 top-[42%] w-[80%] -translate-x-1/2 -translate-y-1/2 transform">
        <p
          className="text-border text-40 text-white"
          data-text="Apologies! Currently, our platform works best on desktop"
        >
          <span className="text-pink">Apologies!</span> Currently, our platform
          works best on desktop
        </p>
        <p
          className="text-border text-40 text-white"
          data-text="Mobile
        optimization is in progress. Stay tuned for updates!"
        >
          Mobile optimization is in progress. Stay tuned for updates!
        </p>

        <Link
          to="/home/0"
          className="text-border mt-20 text-29 text-pink"
          data-text="Back to home"
        >
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mt-16 flex flex-col items-center justify-between gap-20">
        <img src={FullLogo} alt="" className="h-[33rem] w-[45rem]" />
        <Link
          onClick={play}
          className="box-shadow flex h-[14.5rem] w-[14.5rem] items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90"
          to={`/play/starting`}
          prefetch="intent"
        >
          <div className="rotate-[10deg] text-32 text-white">Draw!</div>
        </Link>
        <Link
          to={"/tutorial"}
          className="text-border text-border-lg box-shadow -rotate-3 bg-blue p-4 px-8 text-45 text-white"
          data-text="Tutorial"
        >
          Tutorial
        </Link>
      </div>
    </>
  )
}
export default Index

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
