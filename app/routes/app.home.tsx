import { ActionFunctionArgs, json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { requireArtist } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"
import { like } from "~/utils/socalFunctions.server"

import ArtworkPost from "~/components/ArtworkPost"

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
      },
    },
    orderBy: {
      created_at: "desc",
    },
  })

  return json({
    artworks,
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const artist = await requireArtist(request)

  const formData = await request.formData()
  await checkCSRF(formData, request)

  const intent = formData.get("intent")
  const artworkId = formData.get("artworkId") as string

  if (intent === "like") {
    invariantResponse(artworkId, "Artwork ID not found 🥲")
    await like({ artist, artworkId })
  }

  return null
}

const Home = () => {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="mt-60">
      <Outlet />
      <div className="flex flex-col">
        {data.artworks.map((artwork, index) => (
          <ArtworkPost artwork={artwork} key={artwork.id} index={index} />
        ))}
      </div>
    </div>
  )
}

export default Home
