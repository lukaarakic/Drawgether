import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react"
import { prisma } from "~/utils/db.server"
import { invariantResponse, useIsPending } from "~/utils/misc"
import CloseSVG from "~/assets/misc/close.svg"
import generateRandomRotation from "~/utils/getRandomRotation"
import ModalComments from "~/components/ModalComments"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { checkCSRF } from "~/utils/csrf.server"
import ErrorList from "~/components/ErrorList"
import { z } from "zod"
import { requireArtist } from "~/utils/auth.server"

const CommentSchema = z.object({
  content: z.string().min(3).max(150),
})

export async function loader({ params }: LoaderFunctionArgs) {
  const artworkId = params.artworkId
  invariantResponse(artworkId, "Artwork ID parametar is required")

  const artwork = await prisma.artwork.findUnique({
    where: {
      id: artworkId,
    },
    select: {
      comments: {
        select: {
          id: true,
          content: true,
          artist: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
        },
      },
    },
  })

  invariantResponse(artwork, "There is no artwork with this ID")

  return json({ artwork })
}

export async function action({ params, request }: ActionFunctionArgs) {
  const artworkId = params.artworkId
  const artist = await requireArtist(request)
  invariantResponse(artworkId, "Artwork ID parametar is required")

  const formData = await request.formData()
  await checkCSRF(formData, request)

  const submission = parse(formData, {
    schema: CommentSchema,
  })

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission }, { status: 400 })
  }

  if (!submission.value?.content) {
    return json({ status: "error", submission }, { status: 400 })
  }

  const { content } = submission.value

  await prisma.comment.create({
    data: {
      content,
      artId: artworkId,
      artistId: artist.id,
    },
    select: {
      id: true,
      content: true,
      artist: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  })

  return json({ submission })
}

const CommentRoute = () => {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const isPending = useIsPending()

  const [form, fields] = useForm({
    id: "post-comment-form",
    constraint: getFieldsetConstraint(CommentSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: CommentSchema })
    },
  })

  return (
    <div>
      <div className="pointer-events-none fixed left-0 top-0 z-40 h-screen w-screen cursor-default bg-black bg-opacity-50">
        &nbsp;
      </div>

      <div
        className={`box-shadow fixed left-1/2 top-1/2 z-50 h-[64rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 transform bg-white`}
        style={{
          rotate: `${generateRandomRotation(new Date().getHours() % 12)}deg`,
        }}
      >
        <Link
          className="fixed right-5 top-5 h-8 w-8"
          to="/app/home"
          preventScrollReset
        >
          <img src={CloseSVG} alt="" className="h-full w-full" />
        </Link>

        <div className="mt-12 flex flex-col items-center">
          <p
            className="text-border mb-12 -rotate-2 text-center text-32 text-blue"
            data-text="Comments"
          >
            Comments
          </p>

          <ModalComments comments={data.artwork.comments} />
        </div>

        <Form method="POST" {...form.props}>
          <AuthenticityTokenInput />
          <div className="flex items-center justify-center gap-8">
            <input
              type="text"
              className="input h-20 w-[29rem] px-8 py-10 text-20"
              placeholder="Your comment..."
              {...conform.input(fields.content)}
            />
            <button
              disabled={isPending}
              type="submit"
              name="intent"
              value="post-comment"
              className="box-shadow flex h-28 w-28 items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90"
            >
              <div
                className={`text-16 text-white ${isPending ? "animate-spin" : ""}`}
              >
                {isPending ? "🌀" : "Post"}
              </div>
            </button>
          </div>
          <div className="flex items-center justify-center">
            <ErrorList
              errors={fields.content.errors}
              id={fields.content.errorId}
            />
          </div>
        </Form>
      </div>
    </div>
  )
}
export default CommentRoute
