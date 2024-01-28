import { Form } from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

import TrashIcon from "~/assets/misc/trash.svg"
import { useIsPending } from "~/utils/misc"
const DeleteArtwork = ({ artworkId }: { artworkId: string }) => {
  const isPending = useIsPending()

  return (
    <Form method="POST" id={`delete-${artworkId}`}>
      <AuthenticityTokenInput />
      <input type="hidden" name="artworkId" value={artworkId} />
      <button
        type="submit"
        name="intent"
        value="delete"
        className={`${isPending ? "animate-spin" : ""}`}
      >
        <img src={TrashIcon} alt="" className="drop-shadow-filter h-24 w-24" />
      </button>
    </Form>
  )
}
export default DeleteArtwork
