import { Form } from "@remix-run/react"
import { Link } from "react-router-dom"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import BoxButton from "~/components/ui/BoxButton"
import generateRandomRotation from "~/utils/generate-random-rotation"

const Play = () => {
  return (
    <div className="mx-4 mb-80 lg:mb-0 lg:grid lg:grid-flow-dense lg:grid-cols-2 lg:grid-rows-4">
      <Form className="mb-4">
        <AuthenticityTokenInput />
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full flex-shrink"
            placeholder="Insert loby code..."
          />
          <BoxButton className="px-12 text-45">Join</BoxButton>
        </div>
      </Form>
      <div className="mb-12 text-center">
        <p
          className="text-border text-43 uppercase text-blue"
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

      <div
        className="box-shadow mx-auto mb-8 h-[56rem] w-[90%] bg-pink"
        style={{
          rotate: `${generateRandomRotation(new Date().getHours() % 12)}deg`,
        }}
      ></div>

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

      <div className="flex justify-center">
        <div className="box-shadow flex h-[18rem] w-[18rem] items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90">
          <div className="rotate-[10deg] text-45 text-white">Start</div>
        </div>
      </div>
    </div>
  )
}

export default Play
