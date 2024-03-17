import { faker } from "@faker-js/faker"

export function createArtist() {
  const username = faker.internet
    .userName()
    .toLowerCase()
    .trim()
    .replace(" ", "_")
    .slice(0, 15)
  const email = faker.internet.email().toLowerCase()

  return {
    username,
    email,
  }
}
