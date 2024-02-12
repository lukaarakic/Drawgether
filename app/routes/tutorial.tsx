import { MetaFunction } from "@remix-run/node"
import { useIntersectionObserver } from "usehooks-ts"

import BoxLabel from "~/components/ui/BoxLabel"
import Window from "~/components/tutorial/Window"
import Text from "~/components/Text"

import { howTo, rules } from "~/data/tutorial"
import BlueLogo from "~/assets/logos/blue_logo.svg"
import { Link } from "@remix-run/react"
import { useLenis } from "@studio-freight/react-lenis"
import { useRef, useState } from "react"

export const meta: MetaFunction = () => {
  return [
    { title: "Tutorial" },
    { name: "description", content: "How to play" },
  ]
}

const Tutorial = () => {
  const { isIntersecting, ref: headerRef } = useIntersectionObserver({
    threshold: 0.7,
  })
  const [height, setHeight] = useState(0)
  const timelineRef = useRef<HTMLElement>(null)

  const lenis = useLenis(({ scroll }) => {
    setHeight(scroll)
  })

  return (
    <main
      className={`${isIntersecting ? "bg-pink" : "bg-blue"} pb-24 transition-colors duration-500`}
    >
      <div className="relative mx-auto max-w-[192rem]">
        <header
          className="mx-auto flex h-svh w-max flex-col items-center justify-center"
          ref={headerRef}
        >
          <img
            src={BlueLogo}
            alt=""
            className="absolute left-16 top-16 h-20 w-[35rem]"
          />

          <div>
            <h1
              className="text-border drop-shadow-filter-lg text-border-lg border-none text-center text-90 uppercase leading-none text-white"
              data-text="This is how you play"
            >
              This is how
              <br /> you play
            </h1>
            <BoxLabel blue degree={-3.29}>
              <p className="py-2 text-center font-zyzolOutline text-32 uppercase">
                and follow the rules:
              </p>
            </BoxLabel>
          </div>

          <div className="relative mt-40 h-[35rem]">
            {rules.map((rule, index) => (
              <Window
                key={`${index}-${rule.rule}`}
                index={index + 1}
                text={rule.rule}
                details={rule.type}
                style={rule.style}
                type="rule"
              />
            ))}
          </div>
        </header>

        <section className="relative flex w-full" ref={timelineRef}>
          <div
            className={`sticky top-72 flex w-1/2 flex-col items-center self-start leading-none`}
          >
            <Text largeShadow className="text-90 uppercase">
              so, this is
            </Text>
            <Text largeShadow className="text-90 uppercase">
              how you
            </Text>
            <Text
              largeShadow
              className={`text-165 uppercase transition-colors duration-500 ${isIntersecting ? "!text-blue" : "!text-pink"}`}
            >
              Play
            </Text>
          </div>

          <div
            className="box-shadow w-12 overflow-hidden rounded-full bg-white"
            style={{
              height: timelineRef.current?.clientHeight,
            }}
          >
            <div
              className="h-0 bg-pink transition-all"
              style={{
                height: lenis?.progress > 0.95 ? height : (height / 3) * 2,
                maxHeight: timelineRef.current?.clientHeight,
              }}
            ></div>
          </div>

          <div className="flex w-1/2 flex-col items-center gap-80">
            {howTo.map((item, index) => (
              <Window
                key={`${item.text}-${index}`}
                type="play"
                index={index + 1}
                text={item.text}
                style={item.style}
              />
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            to={"/play"}
            className="box-shadow text-border text-border-lg mb-40 mt-96 inline-block -rotate-3 bg-pink px-12 text-center font-zyzol text-40 uppercase text-white transition-transform hover:scale-90 active:scale-105"
            data-text="leave the tutorial"
          >
            leave the tutorial
          </Link>
        </div>
      </div>
    </main>
  )
}
export default Tutorial
