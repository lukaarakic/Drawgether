import { NavLink } from "@remix-run/react";
import LogoOnly from "~/assets/logos/logo_only.svg";

const Navbar = () => {
  return (
    <>
      <div className="fixed z-40 h-12 bg-white top-0 left-0 w-screen"></div>
      <nav className="fixed z-50 top-11 left-1/2 -translate-x-1/2 w-[147rem] bg-blue h-[11.3rem] rounded-full px-[11.2rem] text-40 box-shadow flex items-center justify-between">
        <NavLink
          data-text="HOME"
          to={"/app/home"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink uppercase text-border text-white"
              : "uppercase text-border text-white"
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
              ? "activeNavLink uppercase text-border text-white"
              : "uppercase text-border text-white"
          }
          prefetch="intent"
        >
          Search
        </NavLink>
        <NavLink to={"/app/home"}>
          <img
            src={LogoOnly}
            alt="Logo of drawgether"
            className="w-[17.6rem] h-[12.8rem]"
          />
        </NavLink>
        <NavLink
          data-text="profile"
          to={"/app/artist/netrunners"}
          className={({ isActive }) =>
            isActive
              ? "activeNavLink uppercase text-border text-white"
              : "uppercase text-border text-white"
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
              ? "activeNavLink uppercase text-border text-white"
              : "uppercase text-border text-white"
          }
          prefetch="intent"
        >
          Play
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
