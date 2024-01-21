import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import tailwindStylesheet from "~/tailwind.css";
import { honeypot } from "./utils/honeypot.server";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { csrf } from "./utils/csrf.server";
import { AuthenticityTokenProvider } from "remix-utils/csrf/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindStylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const honeyProps = honeypot.getInputProps();
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request);

  return json(
    { honeyProps, csrfToken },
    {
      headers: csrfCookieHeader
        ? {
            "set-cookie": csrfCookieHeader,
          }
        : {},
    }
  );
}

export function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProvider() {
  const data = useLoaderData<typeof loader>();

  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <HoneypotProvider {...data.honeyProps}>
        <App />
      </HoneypotProvider>
    </AuthenticityTokenProvider>
  );
}
