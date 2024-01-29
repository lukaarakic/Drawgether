import { useFetcher } from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

import TrashIcon from "~/assets/misc/trash.svg"

const ArtworkDeleteButton = ({ artworkId }: { artworkId: string }) => {
  const fetcher = useFetcher()

  return (
    <fetcher.Form
      method="POST"
      id={`delete-${artworkId}`}
      action={`/delete/${artworkId}`}
    >
      <AuthenticityTokenInput />
      <input type="hidden" name="artworkId" value={artworkId} />
      <button
        type="submit"
        name="intent"
        value="delete"
        className={`${fetcher.state === "submitting" ? "animate-spin" : ""}`}
      >
        <img src={TrashIcon} alt="" className=" h-24 w-24" />
      </button>
    </fetcher.Form>
  )
}
export default ArtworkDeleteButton
