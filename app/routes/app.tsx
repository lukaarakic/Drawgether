import { Outlet } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import { useUser } from "~/utils/artist";

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
