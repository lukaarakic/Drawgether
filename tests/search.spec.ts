import { test } from "./playwright-util"
import { invariantResponse } from "~/utils/misc"
import { expect } from "@playwright/test"

test("search existing user", async ({ page, loginArtist }) => {
  const artist = await loginArtist()
  invariantResponse(artist.username, "username is not defined")

  await page.goto("/search")

  await expect(page.getByPlaceholder(/search.../i)).toBeVisible()
  await expect(page.getByRole("button")).toBeVisible()

  await page.getByPlaceholder(/search.../i).fill(artist.username)
  await page.getByRole("button").click()

  await page.waitForURL(`/search?search=${artist.username}`)

  await expect(page.getByText(/search results:/i)).toBeVisible()
  await expect(page.getByText(`${artist.username}`)).toBeVisible()
})

test("searching non-existing user", async ({ page, loginArtist }) => {
  const artist = await loginArtist()
  invariantResponse(artist.username, "username is not defined")

  await page.goto("/search")

  await expect(page.getByPlaceholder(/search.../i)).toBeVisible()
  await expect(page.getByRole("button")).toBeVisible()

  await page.getByPlaceholder(/search.../i).fill("__nonexistent__")
  await page.getByRole("button").click()

  await page.waitForURL(`/search?search=__nonexistent__`)

  await expect(page.getByText(/no artists found/i)).toBeVisible()
})
