import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { UniqueEnforcer } from "enforce-unique";

const prisma = new PrismaClient();

const uniqueUsernameEnforce = new UniqueEnforcer();
const uniqueEmailEnforce = new UniqueEnforcer();

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  await prisma.artist.deleteMany();
  await prisma.art.deleteMany();
  console.timeEnd("🧹 Cleaned up the database...");

  const totalArtists = 5;

  console.time(`👤 Created ${totalArtists} users...`);
  for (let index = 0; index < totalArtists; index++) {
    await prisma.artist
      .create({
        data: {
          email: uniqueEmailEnforce.enforce(() => {
            return faker.internet.email();
          }),
          username: uniqueUsernameEnforce.enforce(() => {
            return faker.internet.userName().slice(0, 29);
          }),
          arts: {
            create: Array.from({
              length: faker.number.int({ min: 0, max: 3 }),
            }).map(() => {
              return {
                art: faker.internet.avatar(),
                theme: faker.lorem.sentence(),
              };
            }),
          },
        },
      })
      .catch((e) => {
        console.error("Error creating a user: ", e);
        return null;
      });
  }
  console.timeEnd(`👤 Created ${totalArtists} users...`);

  console.time(`👺 Creating admin user "netrunner"`);
  await prisma.artist.create({
    data: {
      email: "netrunners.work@gmail.com",
      username: "netrunner",
      avatar: "https://i.imgur.com/dhFOxNO.png",
      arts: {
        create: {
          theme: "A blue man in a purple jacket.",
          art: "https://imgur.com/7YgVzCu.png",
        },
      },
    },
  });
  console.timeEnd(`👺 Created admin user "netrunner"`);

  console.timeEnd("🌱 Database has been seeded");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
