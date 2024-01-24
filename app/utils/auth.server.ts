import { Artist, Password } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "./db.server";

export async function login({
  email,
  password,
}: {
  email: Artist["email"];
  password: string;
}) {
  return verifyUserPassword({ email }, password);
}

export async function signup({
  email,
  username,
  password,
}: {
  email: Artist["email"];
  username: Artist["username"];
  password: string;
}) {
  const hashedPassword = await getPasswordHash(password);

  const artist = await prisma.artist.create({
    select: { id: true },
    data: {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  return artist;
}

export async function getPasswordHash(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

export async function verifyUserPassword(
  where: Pick<Artist, "email"> | Pick<Artist, "id">,
  password: Password["hash"]
) {
  const artistWithPassword = await prisma.artist.findUnique({
    where,
    select: { id: true, password: { select: { hash: true } } },
  });

  if (!artistWithPassword || !artistWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    artistWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  return { id: artistWithPassword.id };
}
