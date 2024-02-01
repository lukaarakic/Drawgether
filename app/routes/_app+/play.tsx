import { Form } from "@remix-run/react"
import { Link } from "react-router-dom"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import BoxButton from "~/components/ui/BoxButton"
import generateRandomRotation from "~/utils/generate-random-rotation"

const Play = () => {
  return (
    <div className="mb-64 grid grid-cols-1 items-center justify-center gap-12 xs:grid-cols-2 md:mb-0">
      <div
        className="box-shadow mx-auto mb-8 h-[56rem] w-[43rem] bg-pink"
        style={{
          rotate: `${generateRandomRotation(new Date().getHours() % 12)}deg`,
        }}
      ></div>

      <div>
        <Form className="mb-20">
          <AuthenticityTokenInput />
          <div className="flex gap-8">
            <input
              type="text"
              className="input h-24 w-[27rem] px-8 text-25"
              placeholder="Insert loby code..."
              style={{
                rotate: `-${generateRandomRotation(new Date().getHours() % 12)}deg`,
              }}
            />
            <div
              style={{
                rotate: `${generateRandomRotation(new Date().getHours() % 12)}deg`,
              }}
            >
              <BoxButton className="px-8 py-1 text-32">Join</BoxButton>
            </div>
          </div>
        </Form>

        <div className="mb-16 text-center">
          <p
            className="text-border block text-43 uppercase text-blue"
            data-text="lobby code:"
          >
            lobby code:{" "}
          </p>
          <p
            className="text-border ml-4 text-43 uppercase text-white"
            data-text="#A3X5S6"
          >
            #A3X5S6
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="box-shadow flex h-[18rem] w-[18rem] cursor-pointer items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90">
            <div className="rotate-[-10deg] text-45 text-white">Start</div>
          </div>
        </div>
      </div>

      <div className="mb-12 flex items-center justify-center">
        <Link
          to="/tutorial"
          target="_blank"
          referrerPolicy="no-referrer"
          className="box-shadow text-border bg-blue px-8 py-1 text-45 text-white"
          data-text="Tutorial"
        >
          Tutorial
        </Link>
      </div>
    </div>
  )
}

export default Play
