import { Outlet } from "@remix-run/react"
import LeftCloud from "~/assets/clouds/left_blue.svg"
import RightCloud from "~/assets/clouds/right_blue.svg"

const Layout = () => {
  return (
    <div>
      <Outlet />

      <div>
        <img
          src={LeftCloud}
          alt="Left corner cloud"
          className="pointer-events-none absolute bottom-0 left-0 w-full xs:w-1/2 lg:w-1/3"
        />
        <img
          src={RightCloud}
          alt="Right corner cloud"
          className="pointer-events-none absolute bottom-0 right-0 w-full xs:w-1/2 lg:w-1/3"
        />
      </div>
    </div>
  )
}
export default Layout
