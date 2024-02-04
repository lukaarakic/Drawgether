import { useNavigate } from "@remix-run/react"
import { useEffect } from "react"
import Modal from "~/components/ui/Modal"

const DrawFinish = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate("/home/0")
    }, 5000)
  }, [])

  return (
    <Modal
      closeTo="/home/0"
      className="pointer-events-none flex h-full -rotate-3 flex-col items-center justify-center leading-none"
    >
      <p
        className="text-132 text-border text-border-lg uppercase text-blue"
        data-text="time"
      >
        Time
      </p>
      <p
        className="text-132 text-border text-border-lg uppercase text-blue"
        data-text="is"
      >
        Is
      </p>
      <p
        className="text-132 text-border text-border-lg uppercase text-pink"
        data-text="up"
      >
        Up
      </p>
    </Modal>
  )
}
export default DrawFinish
