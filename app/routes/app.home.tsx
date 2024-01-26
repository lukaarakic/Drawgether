import { ActionFunctionArgs, json } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
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
import Modal from "~/components/Modal"
import { useState } from "react"
import ModalComments from "~/components/ModalComments"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

export async function loader() {
  const artworks = await prisma.artwork.findMany({
    take: 5,
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

  if (intent === "post-comment") {
    invariantResponse(artworkId, "Artwork ID not found 🥲")
    const content = formData.get("content") as string

    await prisma.comment.create({
      data: {
        content,
        artId: artworkId,
        artistId: artist.id,
      },
    })
  }

  if (intent === "like") {
    invariantResponse(artworkId, "Artwork ID not found 🥲")
    await like({ artist, artworkId })
  }

  return json({})
}

export type ModalDataType = {
  id: string
  theme: string
  artworkImage: string
  likesCount: number
  comments: {
    id: string
    artist: {
      id: string
      username: string
      avatar: string | null
    }
    content: string
  }[]
  likes: {
    artistId: string
  }[]
  artists: {
    id: string
    username: string
    avatar: string | null
  }[]
}

const Home = () => {
  const data = useLoaderData<typeof loader>()
  const artist = useArtist()

  const [isModalOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalDataType | null>(null)

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
                alt={artwork.theme}
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
                <img src={CommentIcon} alt="" className="h-24 w-24" />
                {artwork.artists.filter((artistF) => artistF.id === artist.id)
                  .length > 0 ? (
                  <img src={TrashIcon} alt="" className="h-24 w-24" />
                ) : null}
              </div>

              <div className="absolute -bottom-16 -right-8 flex items-baseline">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {artwork.artists.map((artist) => (
                  <Link to={`/app/artist/${artist.username}`} key={artist.id}>
                    <ArtistCircle
                      size={6.8}
                      avatar={{
                        avatarUrl: artist.avatar,
                        seed: artist.username,
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>

            <Comments
              comments={artwork.comments}
              artwork={artwork}
              setIsOpen={setIsOpen}
              setModalData={setModalData}
            />
          </article>
        ))}

        <Modal
          isModalOpen={isModalOpen}
          setIsOpen={setIsOpen}
          className="mt-12 flex flex-col items-center"
        >
          {modalData ? (
            <>
              <p
                className="text-border mb-12 -rotate-2 text-center text-32 text-blue"
                data-text="Comments"
              >
                Comments
              </p>

              <ModalComments comments={modalData.comments} />
            </>
          ) : (
            <p>Please wait....</p>
          )}

          <Form method="POST">
            <AuthenticityTokenInput />
            <input type="hidden" name="artworkId" value={modalData?.id} />
            <div className="flex items-center justify-center gap-8">
              <input
                type="text"
                name="content"
                className="input h-20 w-[29rem] px-8 py-10 text-20"
                placeholder="Your comment..."
              />
              <button
                type="submit"
                name="intent"
                value="post-comment"
                className="box-shadow flex h-28 w-28 items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90"
              >
                <div className="text-16 text-white">Post</div>
              </button>
            </div>
            <div className="flex items-center justify-center">
              {/* <ErrorList
              errors={fields.content.errors}
              id={fields.content.errorId}
            /> */}
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default Home
