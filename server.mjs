/* eslint-disable no-undef */
import { createRequestHandler } from "@remix-run/express"
import { broadcastDevReady } from "@remix-run/node"
import express from "express"
import compression from "compression"
import morgan from "morgan"
import rateLimit from "express-rate-limit"

import * as build from "./build/index.js"

const app = express()

// no ending slashes for SEO reasons
// https://github.com/epicweb-dev/epic-stack/discussions/108
app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/")
    res.redirect(301, safepath + query)
  } else {
    next()
  }
})

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by")

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" }),
)

// Aggressively cache fonts for a year
app.use(
  "/fonts",
  express.static("public/fonts", { immutable: true, maxAge: "1y" }),
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }))

morgan.token("url", (req) => decodeURIComponent(req.url ?? ""))
app.use(morgan("tiny"))

// Rate limiter
const maxMultiple = process.env.TESTING ? 10_000 : 1
const rateLimitDefault = {
  windowMs: 60 * 1000,
  max: 1000 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false,
}

const strongestRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1000,
  max: 10 * maxMultiple,
})

const strongRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1000,
  max: 100 * maxMultiple,
})

const generalRateLimit = rateLimit(rateLimitDefault)
app.use((req, res, next) => {
  const strongPaths = ["/signup", "/login"]
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (strongPaths.some((p) => req.path.includes(p))) {
      return strongestRateLimit(req, res, next)
    }
    return strongRateLimit(req, res, next)
  }

  return generalRateLimit(req, res, next)
})

app.all("*", createRequestHandler({ build }))

app.listen(3000, () => {
  console.log(`👉 http://localhost:3000`)

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build)
  }
})
