import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  redirect,
  useLoaderData,
} from "@remix-run/react"
import tailwindStylesheet from "~/tailwind.css"
import { honeypot } from "./utils/honeypot.server"
import { HoneypotProvider } from "remix-utils/honeypot/react"
import { csrf } from "./utils/csrf.server"
import { AuthenticityTokenProvider } from "remix-utils/csrf/react"
import { GeneralErrorBoundary } from "./components/error/ErrorBoundry"
import { sessionStorage } from "./utils/session.server"
import { prisma } from "./utils/db.server"
import { ReactLenis, useLenis } from "@studio-freight/react-lenis"
import { AnimatePresence } from "framer-motion"

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindStylesheet },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const honeyProps = honeypot.getInputProps()
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request)
  const cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie"),
  )
  const artistId = cookieSession.get("artistId")
  const artist = artistId
    ? await prisma.artist.findUnique({
        where: {
          id: artistId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          roles: {
            select: {
              name: true,
              permissions: {
                select: { entity: true, access: true, action: true },
              },
            },
          },
        },
      })
    : null

  if (artistId && !artist) {
    throw redirect("/", {
      headers: {
        "set-cookie": await sessionStorage.destroySession(cookieSession),
      },
    })
  }

  return json(
    { honeyProps, csrfToken, artist },
    {
      headers: csrfCookieHeader
        ? {
            "set-cookie": csrfCookieHeader,
          }
        : {},
    },
  )
}

export function App() {
  return <Document></Document>
}

export function Document({ children }: { children?: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#496eb5" />
        <meta name="theme-color" content="#496eb5" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Outlet />
      </body>
    </html>
  )
}

export default function AppWithProvider() {
  const data = useLoaderData<typeof loader>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const lenis = useLenis(({ scroll }) => {})

  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <HoneypotProvider {...data.honeyProps}>
        <ReactLenis root>
          <AnimatePresence>
            <App />
          </AnimatePresence>
        </ReactLenis>
      </HoneypotProvider>
    </AuthenticityTokenProvider>
  )
}

export function ErrorBoundary() {
  return (
    <Document>
      <div className="h-full">
        <GeneralErrorBoundary />
      </div>
    </Document>
  )
}
