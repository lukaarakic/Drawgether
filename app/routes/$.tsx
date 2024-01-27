/* eslint-disable react/no-unescaped-entities */
import { useLocation } from "@remix-run/react"
import { Link } from "react-router-dom"
import { GeneralErrorBoundary } from "~/components/ErrorBoundry"

export async function loader() {
  throw new Response("Not found", { status: 404 })
}

export default function NotFound() {
  return <ErrorBoundary />
}

export function ErrorBoundary() {
  const location = useLocation()

  return (
    <GeneralErrorBoundary
      className="h-screen bg-blue"
      statusHandlers={{
        404: () => (
          <div className="flex h-full flex-col items-center justify-center ">
            <div className="flex flex-col">
              <h1
                className="text-border text-white"
                data-text=" We can not find this page:"
              >
                We can not find this page:
              </h1>
              <pre
                className="text-border ml-4 rounded-2xl border-none bg-black bg-opacity-10 px-8 text-white"
                data-text={location.pathname}
              >
                {location.pathname}
              </pre>
            </div>
            <Link
              to="/app/home"
              className="text-border underline"
              data-text="Back to home"
            >
              Back to home
            </Link>
          </div>
        ),
      }}
    />
  )
}
