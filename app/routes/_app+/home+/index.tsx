import { redirect } from "@remix-run/node"
import { Outlet } from "@remix-run/react"

export async function loader() {
  return redirect("/home/0")
}

const IndexPage = () => {
  return <Outlet />
}
export default IndexPage
