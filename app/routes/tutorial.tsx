import { MetaFunction } from "@remix-run/node"

import BoxLabel from "~/components/ui/BoxLabel"
import Window from "~/components/tutorial/Window"
import Text from "~/components/Text"

import { howTo, rules } from "~/data/tutorial"
import BlueLogo from "~/assets/logos/blue_logo.svg"

export const meta: MetaFunction = () => {
  return [
    { title: "Tutorial" },
    { name: "description", content: "How to play" },
  ]
}

const Tutorial = () => {
  return (
    <main className="overflow-x-hidden bg-pink pb-24 transition-colors duration-500">
      <div className="relative mx-auto w-[192rem]">
        <header className="mx-auto flex h-svh w-max flex-col items-center justify-center">
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

        <section className="timeline flex w-full overflow-hidden">
          <div className="flex w-1/2 flex-col items-center leading-none">
            <Text largeShadow className="text-90 uppercase">
              so, this is
            </Text>
            <Text largeShadow className="text-90 uppercase">
              how you
            </Text>
            <Text largeShadow className="text-165 uppercase !text-pink">
              Play
            </Text>
          </div>

          <div className="w-10 origin-top bg-black" />

          <div className="flex w-1/2 flex-col items-center gap-80">
            {howTo.map((item, index) => (
              <Window
                key={`${item.text}-${index}`}
                type="play"
                index={index + 1}
                text={item.text}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
export default Tutorial
