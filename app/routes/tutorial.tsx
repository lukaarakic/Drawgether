import BlueLogo from "~/assets/logos/blue_logo.svg"
import BoxLabel from "~/components/ui/BoxLabel"
import Hearts from "~/assets/misc/hearts.svg"
import Stars from "~/assets/misc/stars.svg"
import Marks from "~/assets/misc/marks.svg"

const rules = [
  {
    type: Hearts,
    rule: "Keep it family friendly!",
    style: {
      top: 0,
      left: "-67rem",
      rotate: "5.75deg",
    },
  },
  {
    type: Stars,
    rule: "Stay positive!",
    style: {
      top: "10rem",
      left: "-15rem",
      rotate: "-4.56deg",
    },
  },
  {
    type: Marks,
    rule: "BE CREATIVE!",
    style: {
      top: 0,
      right: "-69rem",
    },
  },
]

const Tutorial = () => {
  return (
    <main className="h-[200vh] overflow-x-hidden bg-pink">
      <div className="mx-auto w-[192rem]">
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
              <RuleWindow
                index={index + 1}
                rule={rule.rule}
                type={rule.type}
                style={rule.style}
                key={`${index}-${rule.rule}`}
              />
            ))}
          </div>
        </header>

        <div></div>
      </div>
    </main>
  )
}
export default Tutorial

interface RuleWindow {
  index: number
  type: string
  rule: string
  style: any
}

const RuleWindow = ({ index, rule, type, style }: RuleWindow) => {
  return (
    <div className="absolute max-h-[22rem] w-[36rem]" style={style}>
      <div className="border-only flex h-24 items-center justify-between rounded-t-[3.5rem] bg-blue px-8">
        <span
          className="text-border drop-shadow-filter-lg text-25 text-white"
          data-text={`${index}.`}
        >
          {index}.
        </span>

        <img src={type} alt="" />
      </div>

      <div className="border-only flex h-64 items-center border-t-0 bg-white py-8">
        <p
          className="text-border text-border-lg drop-shadow-filter-lg mx-auto w-[27.6rem] text-40 text-white"
          data-text={rule}
        >
          {rule}
        </p>
      </div>
    </div>
  )
}
