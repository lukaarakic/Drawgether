import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { UniqueEnforcer } from "enforce-unique"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const uniqueUsernameEnforce = new UniqueEnforcer()
const uniqueEmailEnforce = new UniqueEnforcer()

async function seed() {
  console.log("🌱 Seeding...")
  console.time(`🌱 Database has been seeded`)

  console.time("🧹 Cleaned up the database...")
  await prisma.artist.deleteMany()
  await prisma.artwork.deleteMany()
  await prisma.permission.deleteMany()
  await prisma.role.deleteMany()
  console.timeEnd("🧹 Cleaned up the database...")

  const entities = ["artist", "art"]
  const actions = ["create", "read", "update", "delete"]
  const accesses = ["own", "any"]

  console.time("🛂 Created permissions")
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        await prisma.permission.create({
          data: {
            entity,
            action,
            access,
          },
        })
      }
    }
  }
  console.timeEnd("🛂 Created permissions")

  console.time("🛡️ Created user and admin role")
  await prisma.role.create({
    data: {
      name: "user",
      permissions: {
        connect: await prisma.permission.findMany({
          where: {
            access: "own",
          },
        }),
      },
    },
  })

  await prisma.role.create({
    data: {
      name: "admin",
      permissions: {
        connect: await prisma.permission.findMany({
          where: {
            access: "any",
          },
        }),
      },
    },
  })
  console.timeEnd("🛡️ Created user and admin role")

  const totalArtists = 7

  console.log("👤 Creating artists...")
  console.time(`👤 Created ${totalArtists} artists...`)
  for (let index = 0; index < totalArtists; index++) {
    const username = uniqueUsernameEnforce.enforce(() => {
      return faker.internet.userName().slice(0, 15).toLowerCase()
    })

    await prisma.artist
      .create({
        data: {
          email: uniqueEmailEnforce.enforce(() => {
            return faker.internet.email()
          }),
          username,
          roles: {
            connect: {
              name: "user",
            },
          },
          password: {
            create: {
              hash: bcrypt.hashSync(username, 10),
            },
          },
          artworks: {
            create: Array.from({
              length: faker.number.int({ min: 0, max: 6 }),
            }).map(() => {
              return {
                artworkImage: faker.internet.avatar(),
                theme: faker.lorem.sentence(),
              }
            }),
          },
        },
      })
      .catch((e) => {
        console.error("Error creating an artists: ", e)
        return null
      })
  }
  console.timeEnd(`👤 Created ${totalArtists} artists...`)

  console.log('👺 Creating admin user "netrunners"')
  console.time(`👺 Created admin user "netrunners"`)

  await prisma.artist.create({
    data: {
      email: "netrunners.work@gmail.com",
      username: "netrunners",
      roles: {
        connect: [{ name: "admin" }, { name: "user" }],
      },
      password: {
        create: {
          hash: bcrypt.hashSync("runningthenets", 10),
        },
      },
      avatar: "https://i.imgur.com/dhFOxNO.png",
      artworks: {
        create: {
          theme: "A blue man in a purple jacket.",
          artworkImage: "https://imgur.com/7YgVzCu.png",
        },
      },
    },
  })

  console.timeEnd(`👺 Created admin user "netrunners"`)

  console.timeEnd("🌱 Database has been seeded")
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
