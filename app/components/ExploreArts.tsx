import ArtPost from "./ArtPost";
import { useRouteLoaderData } from "@remix-run/react";
import type { loader as homeLoader } from "~/routes/app.home";

const ExploreArts = () => {
  const data = useRouteLoaderData<typeof homeLoader>("routes/app.home");

  return (
    <div className="flex flex-col">
      {data?.arts?.map((art) => (
        <ArtPost
          key={art.id}
          theme={art.theme}
          artUrl={art.art}
          artists={art.artists}
          comments={art.comments}
          likes={art.likes}
          likesCount={art.likesCount}
        />
      ))}
    </div>
  );
};

export default ExploreArts;
