import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

// Assets
import PinkLogo from "~/assets/logos/pink_logo.svg";
import LeftCloud from "~/assets/clouds/left_white.svg";
import RightCloud from "~/assets/clouds/right_white.svg";

export const meta: MetaFunction = () => {
  return [
    { title: "Drawgether" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main className="h-screen bg-blue">
      <div className="flex items-center justify-center pt-16">
        <img src={PinkLogo} alt="Drawgether logo" />
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-40">
        <h1
          className="mb-10 leading-none tracking-tighter text-white text-128 rotate-2 text-border drop-shadow-filter"
          data-text="UNLEASH YOUR
        CREATIVE SIDE"
        >
          UNLEASH YOUR <br />
          CREATIVE SIDE
        </h1>

        <div className="px-4 mb-24 -rotate-2 bg-pink box-shadow">
          <p className="leading-tight text-white font-zyzolOutline text-90">
            with your friends!
          </p>
        </div>

        <Link
          className="flex items-center justify-center uppercase transition-transform rounded-full w-[14.5rem] h-[14.5rem] bg-pink box-shadow hover:scale-105 active:scale-90"
          to={`/auth/login`}
          prefetch="intent"
        >
          <div className="text-white rotate-[10deg] text-32">Start</div>
        </Link>
      </div>

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
    </main>
  );
}
