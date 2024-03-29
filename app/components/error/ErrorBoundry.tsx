import {
  isRouteErrorResponse,
  useParams,
  useRouteError,
  type ErrorResponse,
} from "@remix-run/react"
import { getErrorMessage } from "~/utils/misc"

type StatusHandler = (info: {
  error: ErrorResponse
  params: Record<string, string | undefined>
}) => JSX.Element | null

export function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <p>
      {error.status} {getErrorMessage(error.data)}
    </p>
  ),
  statusHandlers,
  unexpectedErrorHandler = (error) => <p>{getErrorMessage(error)}</p>,
  className,
}: {
  defaultStatusHandler?: StatusHandler
  statusHandlers?: Record<number, StatusHandler>
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null
  className?: string
}) {
  const error = useRouteError()
  const params = useParams()

  if (typeof document !== "undefined") {
    console.error(error)
  }

  return (
    <div
      className={`drop-shadow-filter-lg flex h-full w-full items-center justify-center p-20 text-60 text-pink ${className}`}
    >
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  )
}
