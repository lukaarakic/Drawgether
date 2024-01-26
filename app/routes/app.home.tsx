import { ActionFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import BoxLabel from "~/components/BoxLabel"
import LikePost from "~/components/Like"
import { useArtist } from "~/utils/artist"
import { requireArtist } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import generateRandomRotation from "~/utils/getRandomRotation"
import { invariantResponse } from "~/utils/misc"
import { like } from "~/utils/socalFunctions.server"
import CommentIcon from "~/assets/misc/comment.svg"
import TrashIcon from "~/assets/misc/trash.svg"
import ArtistCircle from "~/components/ArtistCircle"
import Comments from "~/components/Comments"

export async function loader() {
  const artworks = await prisma.artwork.findMany({
    take: 10,
    select: {
      artworkImage: true,
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

  return json({})
}

const Home = () => {
  const data = useLoaderData<typeof loader>()
  const artist = useArtist()

  return (
    <div className="mt-60">
      <div className="flex flex-col">
        {data.artworks.map((artwork, i) => (
          <article
            className="mx-auto mb-80 w-[90%] xs:w-[57.2rem]"
            key={`${artwork.id}/${artwork.theme}`}
          >
            <BoxLabel degree={generateRandomRotation((i % 12) + 1)}>
              <p
                data-text={artwork.theme}
                className="text-border p-2 text-25 md:text-32"
              >
                {artwork.theme}
              </p>
            </BoxLabel>

            <div
              className="relative mb-24"
              style={{
                rotate: `${generateRandomRotation(i % 10) / 2}deg`,
              }}
            >
              <img
                src={artwork.artworkImage}
                alt=""
                className="box-shadow mt-5 h-[57.2rem] w-[57.2rem] object-cover"
              />

              <div className="absolute -bottom-12 -left-5 flex">
                <LikePost
                  artId={artwork.id}
                  likesCount={artwork.likesCount}
                  isLiked={
                    artwork.likes.filter((like) => like.artistId === artist.id)
                      .length > 0
                  }
                />
                <img src={CommentIcon} alt="Comment" className="h-24 w-24" />
                <img src={TrashIcon} alt="Trash" className="h-24 w-24" />
              </div>

              <div className="absolute -bottom-16 -right-8 flex items-baseline">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {artwork.artists.map((artist: any) => (
                  <ArtistCircle
                    size={6.8}
                    avatar={{
                      avatarUrl: artist.avatar,
                      seed: artist.username,
                    }}
                    key={artist.id}
                  />
                ))}
              </div>
            </div>

            <Comments comments={artwork.comments} />
          </article>
        ))}
      </div>
    </div>
  )
}

export default Home
