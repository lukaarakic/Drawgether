import { createCookieSessionStorage } from "@remix-run/node"

export const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "dg_theme",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: process.env.SESSION_SECRET?.split(","),
    secure: process.env.NODE_ENV === "production",
  },
})
