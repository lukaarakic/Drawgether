import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react"
import { requireArtist } from "~/utils/auth.server"
import { checkCSRF } from "~/utils/csrf.server"
import { prisma } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"
import { like } from "~/utils/social-function.server"

import ArtworkPost from "~/components/artwork-module/ArtworkPost"

const getPage = (searchParams: URLSearchParams) => ({
  page: Number(searchParams.get("page") || "0"),
})

export async function loader({ request }: LoaderFunctionArgs) {
  const { page } = getPage(new URL(request.url).searchParams)
  const skip = page * 10

  const artworks = await prisma.artwork.findMany({
    take: 10,
    skip,
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
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get("page"))

  const nextPage = page + 1
  const prevPage = page - 1

  return (
    <div>
      <div className="flex flex-col">
        {data.artworks.map((artwork, index) => (
          <ArtworkPost artwork={artwork} key={artwork.id} index={index} />
        ))}
      </div>
      <div className="-mt-20 mb-4 flex items-center justify-between text-32">
        {page === (null || 0) || data.artworks.length === 0 ? (
          <div></div>
        ) : (
          <Link
            to={`/home?page=${prevPage}`}
            className="text-border text-36 text-pink"
            data-text="Prev"
          >
            Prev
          </Link>
        )}
        {data.artworks.length === 0 ? (
          <div className="flex flex-col items-center">
            <p
              className="text-border mt-24 text-40 text-white"
              data-text="There are no more artworks 😢"
            >
              There are no more artworks 😢
            </p>
            <p
              className="text-border mt-24 text-40 text-white"
              data-text="Go to "
            >
              Go to{" "}
              <Link
                to={`/home?page=${prevPage}`}
                className="text-border text-pink"
                data-text="previous page"
              >
                previous page
              </Link>
            </p>
          </div>
        ) : (
          <Link
            to={`/home?page=${nextPage}`}
            className="text-border text-36 text-blue"
            data-text="Next"
          >
            Next
          </Link>
        )}
      </div>
      <Outlet />
    </div>
  )
}

export default Home
