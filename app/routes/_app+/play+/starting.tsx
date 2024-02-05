import FullLogo from "~/assets/logos/full_both_logo.svg"
import Bubble from "~/assets/misc/chat_bubble.svg"
import GPTLogo from "~/assets/logos/gpt_logo.svg"
import OpenAI from "openai"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import data from "~/themes/themes.json"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { themeStorage } from "~/utils/theme.server"
import { useEffect, useState } from "react"
import { randomInt } from "~/utils/misc"

export async function loader({ request }: LoaderFunctionArgs) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const theme = data.themes[randomInt(0, 239)]

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
    Write a short and brief welcome message (within 15 words) for a game called "Drawgether" in this format, no hashtags, only emojis somewhere - 
    format it with breaks and line breaks

    Welcome message,\n
    Wish they have fun,\n
    Give them the following theme: ${theme}
    `,
      },
    ],
    model: "gpt-3.5-turbo-1106",
  })

  const themeSession = await themeStorage.getSession(
    request.headers.get("cookie"),
  )
  themeSession.set("theme", theme)

  return json(
    { response },
    {
      headers: {
        "set-cookie": await themeStorage.commitSession(themeSession),
      },
    },
  )
}

const Starting = () => {
  const { response } = useLoaderData<typeof loader>()
  const formatResponse = response.choices[0].message.content?.split("\n")
  const [remainingSeconds, setRemainingSeconds] = useState(12)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1)
    }, 1000)

    if (remainingSeconds <= 0) {
      return navigate("/play/draw")
    }

    return () => clearInterval(interval)
  }, [remainingSeconds])

  return (
    <>
      <div className="flex">
        <div>
          <img src={FullLogo} alt="" className="h-[51rem] w-[70rem]" />
        </div>

        <div className="flex h-[48rem] w-[48rem]">
          <img
            src={Bubble}
            alt=""
            className="absolute -z-10 h-[48rem] w-[48rem]"
          />
          <div className="ml-36 mr-20 mt-8 flex h-full flex-col justify-between pb-16 text-34 leading-none">
            <div>
              {formatResponse?.map((sentence) => (
                <>
                  <p key={sentence}>{sentence}</p> <br />
                </>
              ))}
            </div>

            <div className="flex items-center">
              <img src={GPTLogo} alt="" />
              <p className="ml-4 text-22 text-blue">Powered by: ChatGPT</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-44 flex flex-col items-center justify-center">
        <button
          onClick={() => setRemainingSeconds((prev) => prev - 1)}
          className="box-shadow flex h-44 w-44 items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90"
        >
          <p
            className="text-border text-border-lg rotate-[10deg] text-65 text-white"
            data-text={remainingSeconds}
          >
            {remainingSeconds}
          </p>
        </button>
        <p
          className="text-border text-border-lg text-25 text-blue"
          data-text="Timer"
        >
          Timer
        </p>
      </div>
    </>
  )
}
export default Starting
