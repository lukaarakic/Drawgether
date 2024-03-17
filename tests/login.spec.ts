import { faker } from "@faker-js/faker"
import { test, expect } from "./playwright-util"
import { invariantResponse } from "~/utils/misc"

test("login", async ({ page, insertNewUser }) => {
  await page.goto("/")
  await expect(page.getByRole("link", { name: /start/i })).toBeVisible
  page.getByRole("link", { name: /start/i }).click()
  await page.waitForURL(`/login`)

  await expect(page.getByAltText("Drawgether logo")).toBeVisible()
  await expect(page.getByRole("form", { name: /login/i })).toBeVisible()
  await expect(page.getByText("Remember me?")).toBeVisible()
  await expect(page.getByRole("button", { name: /log in/i })).toBeVisible()

  const password = faker.internet.password()
  const artist = await insertNewUser({ password })
  invariantResponse(artist.email, "Artist's email is not defined")

  await page.getByPlaceholder(/lets@drawgether.com/i).fill(artist.email)
  await page.getByPlaceholder("********").fill(password)
  await page.getByText(/Remember me?/i).click()
  await page.getByRole("button", { name: /log in/i }).click()

  await page.waitForURL(`/home/0`)

  await expect(page.locator("article h2")).toHaveCount(7)
})
