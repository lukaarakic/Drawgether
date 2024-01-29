import { NavLink } from "@remix-run/react"
import LogoOnly from "~/assets/logos/logo_only.svg"
import BloopSFX from "~/assets/audio/bloop.wav"

const Navbar = ({ username }: { username: string }) => {
  function play() {
    new Audio(BloopSFX).play()
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-30 h-12 w-screen bg-white"></div>
      <nav className="box-shadow fixed left-1/2 top-11 z-50 hidden h-[11.3rem] w-[90%] -translate-x-1/2 items-center justify-between rounded-full bg-blue px-28 text-32 md:flex lg:w-[147rem] lg:px-[11.2rem] lg:text-40">
        <NavLink
          data-text="HOME"
          to={"/home"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border uppercase text-white"
              : "text-border uppercase text-white"
          }
          prefetch="intent"
          onClick={() => play()}
        >
          Home
        </NavLink>
        <NavLink
          data-text="SEARch"
          to={"/search"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border uppercase text-white"
              : "text-border uppercase text-white"
          }
          prefetch="intent"
          onClick={() => play()}
        >
          Search
        </NavLink>

        <NavLink to={"/home"} onClick={() => play()}>
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
              ? "activeNavLink text-border uppercase text-white"
              : "text-border uppercase text-white"
          }
          prefetch="intent"
          onClick={() => play()}
        >
          Profile
        </NavLink>
        <NavLink
          data-text="play"
          to={"/play"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border uppercase text-white"
              : "text-border uppercase text-white"
          }
          prefetch="intent"
          onClick={() => play()}
        >
          Play
        </NavLink>
      </nav>
    </>
  )
}

export default Navbar
