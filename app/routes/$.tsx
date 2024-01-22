/* eslint-disable react/no-unescaped-entities */
import { useLocation } from "@remix-run/react";
import { Link } from "react-router-dom";
import { GeneralErrorBoundary } from "~/components/ErrorBoundry";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export default function NotFound() {
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  const location = useLocation();

  return (
    <GeneralErrorBoundary
      className="bg-blue"
      statusHandlers={{
        404: () => (
          <div className="h-full flex flex-col items-center justify-center ">
            <div className="flex">
              <h1
                className="text-white text-border"
                data-text=" We can't find this page:"
              >
                We can't find this page:
              </h1>
              <pre
                className="bg-black bg-opacity-10 border-none rounded-2xl px-8 ml-4 text-white text-border"
                data-text={location.pathname}
              >
                {location.pathname}
              </pre>
            </div>
            <Link
              to="/"
              className="text-border underline"
              data-text="Back to home"
            >
              Back to home
            </Link>
          </div>
        ),
      }}
    />
  );
}
