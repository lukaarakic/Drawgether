import { MetaFunction, json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { prisma } from "~/utils/db.server"

import ArtworkPost from "~/components/artwork-module/ArtworkPost"

export const meta: MetaFunction = () => {
  return [
    { title: `Explore Artworks` },
    { name: "description", content: "Where AI and creativity connect" },
  ]
}

export async function loader() {
  const artworks = await prisma.artwork.findMany({
    take: 5,
    select: {
      id: true,
      theme: true,
      likesCount: true,
      artworkImage: true,
      artists: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      likes: {
        select: {
          artistId: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          artist: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
    orderBy: [
      {
        created_at: "desc",
      },
      {
        theme: "asc",
      },
    ],
  })

  return json({
    artworks,
  })
}

const Home = () => {
  const { artworks } = useLoaderData<typeof loader>()

  return (
    <div>
      <div className="flex flex-col">
        {artworks.map((artwork, index) => (
          <ArtworkPost artwork={artwork} key={artwork.id} index={index} />
        ))}
      </div>

      <Outlet />
    </div>
  )
}

export default Home
