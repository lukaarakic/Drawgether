/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test"
import { createArtist } from "./db-util"
import { prisma } from "~/utils/db.server"
import { type Artist as ArtistModel } from "@prisma/client"
import { getPasswordHash } from "~/utils/auth.server"
import * as setCookieParser from "set-cookie-parser"
import { sessionStorage } from "~/utils/session.server"

type GetOrInsertUserOptions = {
  id?: string
  username?: ArtistModel["username"]
  password?: string
  email?: ArtistModel["email"]
}

type Artist = {
  id: string
  email: string
  username: string
}

async function getOrInsertArtist({
  id,
  username,
  password,
  email,
}: GetOrInsertUserOptions = {}): Promise<Artist> {
  const select = { id: true, email: true, username: true }
  if (id) {
    return await prisma.artist.findFirstOrThrow({
      select,
      where: { id },
    })
  } else {
    const artistData = createArtist()
    username ??= artistData.username
    password ??= artistData.username
    email ??= artistData.email

    return await prisma.artist.create({
      select,
      data: {
        ...artistData,
        email,
        username,
        roles: { connect: { name: "user" } },
        password: { create: { hash: await getPasswordHash(password) } },
      },
    })
  }
}

export const test = base.extend<{
  insertNewUser(options?: GetOrInsertUserOptions): Promise<Artist>
  loginArtist(): Promise<Artist>
}>({
  insertNewUser: async ({}, use) => {
    let artistId: string | undefined = undefined
    await use(async (options) => {
      const artist = await getOrInsertArtist(options)
      artistId = artist.id
      return artist
    })

    await prisma.artist.delete({ where: { id: artistId } })
  },
  loginArtist: async ({ page, insertNewUser }, use) => {
    await use(async () => {
      const artist = await insertNewUser()

      const cookieSession = await sessionStorage.getSession()
      cookieSession.set("artistId", artist.id)
      const setCookieHeader = await sessionStorage.commitSession(cookieSession)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cookieConfig = setCookieParser.parseString(setCookieHeader) as any

      await page.context().addCookies([
        {
          ...cookieConfig,
          domain: "localhost",
        },
      ])
      return artist
    })
  },
})

export const { expect } = test
