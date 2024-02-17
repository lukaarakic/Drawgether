/* eslint-disable react/no-unescaped-entities */
import { MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { isMobile } from "react-device-detect"
import { GeneralErrorBoundary } from "~/components/error/ErrorBoundry"
import FullLogo from "~/assets/logos/full_both_logo.svg"
import StartSFX from "~/assets/audio/start.wav"
import MobileError from "~/components/MobileError"

export const meta: MetaFunction = () => {
  return [{ title: "Let's Draw" }, { name: "description", content: "Draw" }]
}

const Index = () => {
  function play() {
    new Audio(StartSFX).play()
  }

  if (isMobile) {
    return <MobileError />
  }

  return (
    <>
      <div className="h-calc flex flex-col items-center justify-evenly">
        <img src={FullLogo} alt="" className="h-[30svh]" />
        <Link
          onClick={play}
          className="box-shadow flex h-[17svh] w-[17svh] items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90"
          to={`/play/starting`}
          prefetch="intent"
        >
          <div className="rotate-[10deg] text-[3.5svh] text-white">Draw!</div>
        </Link>
        <Link
          to={"/tutorial"}
          className="text-border text-border-lg box-shadow -rotate-3 bg-blue p-4 px-8 text-45 text-white"
          data-text="Tutorial"
        >
          Tutorial
        </Link>
        <noscript>
          <h1 className="text-25">
            This game will not work properly without javascript 😢
          </h1>
        </noscript>
      </div>
    </>
  )
}
export default Index

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
