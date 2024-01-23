import { json } from "@remix-run/node";
import ExploreArts from "~/components/ExploreArts";
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
  return (
    <div className="mt-60">
      <ExploreArts />
    </div>
  );
};

export default Home;
