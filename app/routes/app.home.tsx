import { ActionFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import ArtPost from "~/components/ArtPost"
import { useUser } from "~/utils/artist"
import { requireArtist } from "~/utils/auth.server"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"
import { like } from "~/utils/socalFunctions.server"

export async function loader() {
  const arts = await prisma.art.findMany({
    take: 10,
    select: {
      art: true,
      artists: {
        select: {
          avatar: true,
          id: true,
          username: true,
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
              avatar: true,
              username: true,
            },
          },
        },
      },
      id: true,
      likesCount: true,
      theme: true,
    },
    orderBy: {
      created_at: "desc",
    },
  })

  return json({
    arts,
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const artist = await requireArtist(request)

  const formData = await request.formData()
  const artworkId = formData.get("artworkId") as string
  const intent = formData.get("intent")

  invariantResponse(artworkId, "Artwork ID not found 🥲")

  if (intent === "like") {
    await like({ artist, artworkId })
  }

  return json({})
}

const Home = () => {
  const data = useLoaderData<typeof loader>()
  const artist = useUser()

  return (
    <div className="mt-60">
      <div className="flex flex-col">
        {data.arts.map((art, i) => (
          <ArtPost
            key={art.id}
            theme={art.theme}
            artUrl={art.art}
            artists={art.artists}
            likes={art.likes}
            likesCount={art.likesCount}
            index={i}
            artId={art.id}
            currentArtist={artist}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
