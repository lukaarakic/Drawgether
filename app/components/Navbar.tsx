import { NavLink } from "@remix-run/react"
import LogoOnly from "~/assets/logos/logo_only.svg"

const Navbar = ({ username }: { username: string }) => {
  return (
    <>
      <div className="fixed left-0 top-0 z-30 h-12 w-screen bg-white"></div>
      <nav className="box-shadow fixed left-1/2 top-11 z-50 hidden h-[11.3rem] w-[90%] -translate-x-1/2 items-center justify-between rounded-full bg-blue px-28 text-32 md:flex lg:w-[147rem] lg:px-[11.2rem] lg:text-40">
        <NavLink
          data-text="HOME"
          to={"/app/home"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border uppercase text-white"
              : "text-border uppercase text-white"
          }
          prefetch="intent"
        >
          Home
        </NavLink>
        <NavLink
          data-text="SEARch"
          to={"/app/search"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border uppercase text-white"
              : "text-border uppercase text-white"
          }
          prefetch="intent"
        >
          Search
        </NavLink>
        <NavLink to={"/app/home"}>
          <img
            src={LogoOnly}
            alt="Logo of drawgether"
            className="h-[12.8rem] w-[17.6rem]"
          />
        </NavLink>
        <NavLink
          data-text="profile"
          to={`/app/artist/${username}`}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border uppercase text-white"
              : "text-border uppercase text-white"
          }
          prefetch="intent"
        >
          Profile
        </NavLink>
        <NavLink
          data-text="play"
          to={"/app/play"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink text-border uppercase text-white"
              : "text-border uppercase text-white"
          }
          prefetch="intent"
        >
          Play
        </NavLink>
      </nav>
    </>
  )
}

export default Navbar
