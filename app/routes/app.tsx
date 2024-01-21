import { Outlet } from "@remix-run/react";
import Navbar from "~/components/Navbar";

const AppIndex = () => {
  return (
    <>
      <header className="mt-12 flex items-center justify-center">
        <Navbar />
      </header>
      <main className="mt-20 flex items-center justify-center">
        <Outlet />
      </main>
    </>
  );
};

export default AppIndex;
