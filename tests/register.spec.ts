import { faker } from "@faker-js/faker"
import { createArtist } from "./db-util"
import { test, expect } from "./playwright-util"
import { prisma } from "~/utils/db.server"

test("register", async ({ page }) => {
  await page.goto("/")
  expect(page.getByRole("link", { name: /start/i })).toBeVisible
  await page.getByRole("link", { name: /start/i }).click()
  await page.waitForURL(`/login`)

  await expect(
    page.getByRole("link", { name: "Register. Register." }),
  ).toBeVisible()
  await page.getByRole("link", { name: "Register. Register." }).click()
  await page.waitForURL(`/sign-up`)

  await expect(page.getByRole("form", { name: /sign-up/i })).toBeVisible()
  await expect(page.getByText("Remember me?")).toBeVisible()
  await expect(page.getByRole("button", { name: "Register" })).toBeVisible()

  const artist = createArtist()
  const password = faker.internet.password()

  await page.getByPlaceholder("Username").fill(artist.username)
  await page.getByPlaceholder("lets@drawgether.com").fill(artist.email)
  await page.getByPlaceholder("********").fill(password)

  await page.getByRole("button", { name: "Register" }).click()
  await page.waitForURL(`/home/0`)

  await expect(page.locator("article h2")).toHaveCount(7)
  await expect(
    page.getByRole("link", { name: "profile Profile" }),
  ).toBeVisible()

  await page.getByRole("link", { name: "profile Profile" }).click()
  await page.waitForURL(`/artist/${artist.username}`)

  expect(page.getByText(`@${artist.username}`)).toBeVisible()

  await prisma.artist.delete({
    where: {
      email: artist.email,
      username: artist.username,
    },
  })
})
