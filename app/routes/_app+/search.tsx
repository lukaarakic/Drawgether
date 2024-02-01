import { Form, Link, useLoaderData } from "@remix-run/react"
import BoxButton from "~/components/ui/BoxButton"
import SearchIcon from "~/assets/misc/searchIcon.svg"
import { GeneralErrorBoundary } from "~/components/error/ErrorBoundry"
import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node"
import { prisma } from "~/utils/db.server"
import ArtistCircle from "~/components/ui/ArtistCircle"
import BoxLabel from "~/components/ui/BoxLabel"
import generateRandomRotation from "~/utils/generate-random-rotation"

export const meta: MetaFunction = () => {
  return [
    { title: "Find Artist" },
    { name: "description", content: "Find Artist" },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const searchTerm = new URL(request.url).searchParams
    .get("search")
    ?.toLowerCase()

  if (searchTerm === "") {
    throw redirect("/search")
  }

  const artists = searchTerm
    ? await prisma.artist.findMany({
        take: 5,
        where: {
          username: {
            contains: searchTerm,
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      })
    : []

  return json({ artists, searchTerm })
}

const SearchPage = () => {
  const data = useLoaderData<typeof loader>()

  return (
    <main className="">
      <Form method="GET" className="flex items-center justify-center gap-12">
        <input
          type="text"
          name="search"
          id="search"
          className="input w-[70%] md:w-[55rem]"
          placeholder="Search..."
          style={{
            rotate: `${-1.87}deg`,
          }}
        />
        <BoxButton type="submit" className="p-4" degree={6.32}>
          <img src={SearchIcon} alt="" className="h-[5.5rem] w-[5.5rem]" />
        </BoxButton>
      </Form>

      <div className="mt-16 flex flex-col items-center">
        {data.artists.length ? (
          <p
            className="text-border mb-12 text-center text-32 tracking-[.5rem] text-blue"
            data-text="Search results:"
          >
            Search results:
          </p>
        ) : null}

        {data.artists.length > 0 ? (
          data.artists.map((artist, index) => (
            <Link
              to={`/artist/${artist.username}`}
              key={artist.id}
              className="mb-8 flex items-center gap-8"
            >
              <ArtistCircle
                size={11.8}
                avatar={{
                  avatarUrl: artist.avatar,
                  seed: artist.username,
                }}
              />

              <BoxLabel degree={generateRandomRotation(index % 4)}>
                <div className="flex h-28 w-[29rem] items-center justify-between gap-20 px-4">
                  <p
                    className="text-border text-border-lg text-32"
                    data-text={artist.username}
                  >
                    {artist.username}
                  </p>
                </div>
              </BoxLabel>
            </Link>
          ))
        ) : data.searchTerm?.length ? (
          <p
            className="text-border mb-12 text-center text-32 tracking-[.5rem] text-white"
            data-text="No artists found"
          >
            No artists found
          </p>
        ) : null}
      </div>
    </main>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}

export default SearchPage
