import { NavLink } from "@remix-run/react";
import LogoOnly from "~/assets/logos/logo_only.svg";

const Navbar = () => {
  return (
    <nav className="w-[76.56%] bg-blue h-28 rounded-full px-28 text-40 box-shadow flex items-center justify-between">
      <NavLink
        unstable_viewTransition
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
        <img src={LogoOnly} alt="Logo of drawgether" className="w-44 h-32" />
      </NavLink>
      <NavLink
        to={"/app/profile"}
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
  );
};

export default Navbar;
