import { Outlet } from "@remix-run/react";
import Navbar from "~/components/Navbar";

const AppIndex = () => {
  return (
    <>
      <header className="mt-7 flex items-center justify-center">
        <Navbar />
      </header>
      <main className="mt-8 flex items-center justify-center">
        <Outlet />
      </main>
    </>
  );
};

export default AppIndex;
