import { Form } from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

const LikePost = ({
  artId,
  likesCount,
  isLiked,
}: {
  artId: string
  likesCount: number
  isLiked: boolean
}) => {
  return (
    <Form method="POST" action="/app/home">
      <AuthenticityTokenInput />
      <input
        type="text"
        className="hidden"
        name="artworkId"
        value={artId}
        readOnly
      />
      <button type="submit" name="intent" value="like" className="relative">
        <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 57.95 54.84"
          className="relative h-24 w-24"
        >
          <defs>
            <style></style>
          </defs>
          <path
            fill="#212121"
            d="m56.21,19.51c-1.2-2.26-2.87-4.12-4.92-5.51-1.93-2.82-4.67-4.87-8.08-5.97-3.93-1.16-8.04-.79-11.6,1.05l-.77.41c-.9-1.07-1.93-2.01-3.07-2.78-1.97-2.84-4.7-4.89-8.01-5.96-3.87-1.25-8.09-.91-11.51.91C4.58,3.49,1.91,6.66.74,10.52c-1.28,3.83-.9,8.06,1.03,11.57l15.23,28.75,1.48-.77,2.52,4.77,28.73-14.9c3.66-1.83,6.33-5,7.5-8.86,1.23-3.7.86-7.91-1.03-11.57Z"
          />
          <path
            className="transition-colors"
            fill={isLiked ? "#DE6B9B" : "#fff"}
            d="m49.43,25.87c.91-2.73.62-5.81-.76-8.5-1.43-2.69-3.67-4.55-6.64-5.51-2.89-.85-5.95-.58-8.57.77l-5.51,2.81-1.78-3.55-.98-1.76c-1.49-2.72-3.79-4.64-6.67-5.57-1.14-.37-2.32-.55-3.48-.55-1.74,0-3.45.41-4.96,1.21-2.72,1.36-4.66,3.66-5.53,6.52-.96,2.87-.69,5.86.74,8.46l13.39,25.27,25.24-13.09c2.7-1.35,4.64-3.65,5.51-6.5Z"
          />
        </svg>
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-18">
          {likesCount}
        </p>
      </button>
    </Form>
  )
}

export default LikePost
