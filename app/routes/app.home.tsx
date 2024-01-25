import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ArtPost from "~/components/ArtPost";
import { prisma } from "~/utils/db.server";

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
      comments: true,
      id: true,
      likes: true,
      likesCount: true,
      theme: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return json({
    arts,
  });
}

const Home = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="mt-60">
      <div className="flex flex-col">
        {data.arts.map((art, i) => (
          <ArtPost
            key={art.id}
            theme={art.theme}
            artUrl={art.art}
            artists={art.artists}
            comments={art.comments}
            likes={art.likes}
            likesCount={art.likesCount}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
