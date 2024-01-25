import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

// Assets
import FullPinkLogo from "~/assets/logos/full_pink_logo.svg";
import LeftCloud from "~/assets/clouds/left_white.svg";
import RightCloud from "~/assets/clouds/right_white.svg";
import { Link, Outlet, json } from "@remix-run/react";
import { requireAnonymous } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Drawgether" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return json({});
}

export default function Index() {
  return (
    <div className="h-screen bg-blue">
      <header className="flex items-center justify-center mb-36 pt-[4.5rem]">
        <Link to={"/"}>
          <img
            src={FullPinkLogo}
            alt="Drawgether logo"
            className="w-[29.5rem] h-[21.6rem]"
          />
        </Link>
      </header>

      <main className="flex items-center justify-center">
        <Outlet />
      </main>

      <div>
        <img
          src={LeftCloud}
          alt="Left corner cloud"
          className="absolute bottom-0 left-0 pointer-events-none w-1/3"
        />
        <img
          src={RightCloud}
          alt="Right corner cloud"
          className="absolute bottom-0 right-0 pointer-events-none w-1/3"
        />
      </div>
    </div>
  );
}
