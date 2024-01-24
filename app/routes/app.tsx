import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import { useUser } from "~/utils/artist";
import { requireArtistId } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireArtistId(request);

  return json({});
}

const AppIndex = () => {
  const artist = useUser();

  return (
    <>
      <header>
        <Navbar username={artist.username} />
      </header>
      <main className="mt-20 flex items-center justify-center">
        <Outlet />
      </main>
    </>
  );
};

export default AppIndex;
