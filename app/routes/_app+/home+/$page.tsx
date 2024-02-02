import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react"
import { prisma } from "~/utils/db.server"

import ArtworkPost from "~/components/artwork-module/ArtworkPost"

export const meta: MetaFunction = () => {
  return [
    { title: `Explore Artworks` },
    { name: "description", content: "Where AI and creativity connect" },
  ]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const page = Number(params.page)

  const artworks = await prisma.artwork.findMany({
    take: 7,
    skip: page * 7,
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
  const data = useLoaderData<typeof loader>()
  const params = useParams()
  const page = Number(params.page)

  const nextPage = page + 1
  const prevPage = page - 1

  return (
    <div>
      <div className="flex flex-col">
        {data.artworks.map((artwork, index) => (
          <ArtworkPost artwork={artwork} key={artwork.id} index={index} />
        ))}
      </div>
      <div className="mx-auto -mt-32 mb-64 flex w-[80%] items-center justify-between text-32">
        {page === (null || 0) || data.artworks.length === 0 ? (
          <div></div>
        ) : (
          <Link
            to={`/home/${prevPage}`}
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
                to={`/home/${prevPage}`}
                className="text-border text-pink"
                data-text="previous page"
              >
                previous page
              </Link>
            </p>
          </div>
        ) : (
          <Link
            to={`/home/${nextPage}`}
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
