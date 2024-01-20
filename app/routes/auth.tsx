import type { MetaFunction } from "@remix-run/node";

// Assets
import FullPinkLogo from "~/assets/logos/full_pink_logo.svg";
import LeftCloud from "~/assets/clouds/left_white.svg";
import RightCloud from "~/assets/clouds/right_white.svg";
import { Link, Outlet, json, redirect } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Drawgether" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  redirect("/auth/login", 301);

  return json({});
}

export default function Index() {
  return (
    <main className="h-screen bg-blue">
      <Link to={"/"} className="flex items-center justify-center mb-20 pt-11">
        <img src={FullPinkLogo} alt="Drawgether logo" />
      </Link>

      <main className="flex items-center justify-center">
        <Outlet />
      </main>

      <div>
        <img
          src={LeftCloud}
          alt="Left corner cloud"
          className="absolute bottom-0 left-0 pointer-events-none"
        />
        <img
          src={RightCloud}
          alt="Right corner cloud"
          className="absolute bottom-0 right-0 pointer-events-none"
        />
      </div>
    </main>
  );
}
