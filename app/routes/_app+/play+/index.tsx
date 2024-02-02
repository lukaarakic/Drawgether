import { Link } from "@remix-run/react"

const Index = () => {
  return (
    <>
      <div className="mt-56">
        <Link
          className="box-shadow flex h-[14.5rem] w-[14.5rem] items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90"
          to={`/play/starting`}
          prefetch="intent"
        >
          <div className="rotate-[10deg] text-32 text-white">Draw!</div>
        </Link>
      </div>
    </>
  )
}
export default Index
