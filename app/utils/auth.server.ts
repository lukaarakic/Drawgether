import { Artist, Password } from "@prisma/client"
import bcrypt from "bcryptjs"
import { prisma } from "./db.server"
import { sessionStorage } from "./session.server"
import { redirect } from "@remix-run/node"
import { safeRedirect } from "remix-utils/safe-redirect"
import { combineResponseInits } from "./misc"

const SESSION_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000
export function getSessionExpirationDate() {
  return new Date(Date.now() + SESSION_EXPIRATION_TIME)
}

export async function requireArtist(request: Request) {
  const artistId = await requireArtistId(request)

  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: { id: true, username: true, email: true, email_verified: true },
  })

  if (!artist) throw await logout({ request })

  return artist
}

export async function requireArtistWithRole(request: Request) {
  const artistId = await requireArtistId(request)

  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: {
      id: true,
      username: true,
      email: true,
      email_verified: true,
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

  if (!artist) throw await logout({ request })

  return artist
}

export async function getArtistId(request: Request) {
  const cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie"),
  )

  const artistId = cookieSession.get("artistId")
  if (!artistId) return null

  const artist = await prisma.artist.findUnique({
    select: { id: true },
    where: { id: artistId },
  })
  if (!artist) return logout({ request: request })

  return artist.id
}

export async function requireAnonymous(request: Request) {
  const artistId = await getArtistId(request)
  if (artistId) throw redirect("/home/0")
}

export async function requireArtistId(request: Request) {
  const artistId = await getArtistId(request)
  if (!artistId) throw redirect("/login")

  return artistId
}

export async function login({
  email,
  password,
}: {
  email: Artist["email"]
  password: string
}) {
  return verifyArtistPassword({ email }, password)
}

export async function resetUserPassword({
  username,
  password,
}: {
  username: Artist["username"]
  password: string
}) {
  const hashedPassword = await getPasswordHash(password)
  const artist = await prisma.artist.update({
    where: {
      username,
    },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
    select: {
      id: true,
    },
  })

  return artist
}

export async function signup({
  email,
  username,
  password,
}: {
  email: Artist["email"]
  username: Artist["username"]
  password: string
}) {
  const hashedPassword = await getPasswordHash(password)

  const artist = await prisma.artist.create({
    select: { id: true },
    data: {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      roles: { connect: { name: "user" } },
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  })

  return artist
}

export async function logout(
  {
    request,
    redirectTo = "/",
  }: {
    request: Request
    redirectTo?: string
  },
  responseInit?: ResponseInit,
) {
  const cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie"),
  )
  throw redirect(
    safeRedirect(redirectTo),
    combineResponseInits(responseInit, {
      headers: {
        "set-cookie": await sessionStorage.destroySession(cookieSession),
      },
    }),
  )
}

export async function getPasswordHash(password: string) {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

export async function verifyArtistPassword(
  where: Pick<Artist, "email"> | Pick<Artist, "id">,
  password: Password["hash"],
) {
  const artistWithPassword = await prisma.artist.findUnique({
    where,
    select: { id: true, password: { select: { hash: true } } },
  })

  if (!artistWithPassword || !artistWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(
    password,
    artistWithPassword.password.hash,
  )

  if (!isValid) {
    return null
  }

  return { id: artistWithPassword.id }
}
