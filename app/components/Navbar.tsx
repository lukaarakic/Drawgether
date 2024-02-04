import { NavLink, useLocation } from "@remix-run/react"
import LogoOnly from "~/assets/logos/logo_only.svg"
import BloopSFX from "~/assets/audio/bloop.wav"
import { isMobile } from "react-device-detect"

const Navbar = ({ username }: { username: string }) => {
  function play() {
    new Audio(BloopSFX).play()
  }

  const location = useLocation()

  return (
    <div className={`${location.pathname.includes("play/") ? "hidden" : null}`}>
      <div className="fixed left-0 top-0 z-30 hidden h-12 w-screen bg-white md:block"></div>
      <nav
        className="box-shadow fixed bottom-11 left-1/2 z-50 flex h-[11.3rem] w-[90%] -translate-x-1/2 items-center justify-between
       rounded-full bg-blue px-12 text-25 xs:px-44 xs:text-32 md:top-11 md:px-28 lg:w-[147rem] lg:px-44 lg:text-40"
      >
        <NavLink
          data-text="HOME"
          to={"/home/0"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border md:text-border-lg uppercase text-white"
              : "text-border md:text-border-lg uppercase text-white"
          }
          prefetch="intent"
          onClick={() => play()}
        >
          Home
        </NavLink>
        <NavLink
          data-text="SEARCH"
          to={"/search"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border md:text-border-lg uppercase text-white"
              : "text-border md:text-border-lg uppercase text-white"
          }
          prefetch="intent"
          onClick={() => play()}
        >
          Search
        </NavLink>

        <NavLink
          to={"/home/0"}
          onClick={() => play()}
          className="hidden md:block"
        >
          <img
            src={LogoOnly}
            alt="Logo of drawgether"
            className="h-[12.8rem] w-[17.6rem]"
          />
        </NavLink>
        <NavLink
          data-text="profile"
          to={`/artist/${username}`}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border md:text-border-lg uppercase text-white"
              : "text-border md:text-border-lg uppercase text-white"
          }
          prefetch="intent"
          onClick={() => play()}
        >
          Profile
        </NavLink>
        {isMobile ? null : (
          <NavLink
            data-text="play"
            to={"/play"}
            className={({ isActive }) =>
              isActive
                ? "activeNavLink text-border md:text-border-lg uppercase text-white"
                : "text-border md:text-border-lg uppercase text-white"
            }
            prefetch="intent"
            onClick={() => play()}
          >
            Play
          </NavLink>
        )}
      </nav>
    </div>
  )
}

export default Navbar
