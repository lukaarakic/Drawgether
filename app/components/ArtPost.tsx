/* eslint-disable @typescript-eslint/no-explicit-any */

import BoxLabel from "./BoxLabel"
import CommentIcon from "~/assets/misc/comment.svg"
import { Form, Link } from "@remix-run/react"
import { FC, useState } from "react"
import ArtistCircle from "./ArtistCircle"
import generateRandomRotation from "~/utils/getRandomRotation"
import TrashIcon from "~/assets/misc/trash.svg"
import LikePost from "./Like"
import Modal from "./Modal"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { CommentSchema } from "~/routes/comment.$artworkId"
import ErrorList from "./ErrorList"

interface ArtPostProps {
  theme: string
  artUrl: string
  artists: any
  likesCount: number
  index: number
  artId: string
  currentArtist: {
    id: string
    username: string
  }
  likes: { artistId: string }[]
  comments: {
    id: string
    content: string
    artist: {
      id: string
      username: string
      avatar: string | null
    }
  }[]
}

const ArtPost: FC<ArtPostProps> = ({
  theme,
  artUrl,
  artists,
  index = 0,
  artId,
  likesCount,
  currentArtist,
  likes,
  comments,
}) => {
  const [isModalOpen, setIsOpen] = useState(false)

  const [form, fields] = useForm({
    id: "comment-form",
    constraint: getFieldsetConstraint(CommentSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: CommentSchema })
    },
  })

  const isLiked =
    likes.filter((like) => like.artistId === currentArtist.id).length > 0

  return (
    <article className="mx-auto mb-80 w-[90%] xs:w-[57.2rem]">
      <BoxLabel degree={generateRandomRotation((index % 10) + 1)}>
        <p data-text={theme} className="text-border p-2 text-25 md:text-32">
          {theme}
        </p>
      </BoxLabel>

      <div
        className="relative mb-24"
        style={{
          rotate: `${generateRandomRotation(index % 10) / 2}deg`,
        }}
      >
        <img
          src={artUrl}
          alt=""
          className="box-shadow mt-5 h-[57.2rem] w-[57.2rem] object-cover"
        />

        <div className="absolute -bottom-12 -left-5 flex">
          <LikePost artId={artId} likesCount={likesCount} isLiked={isLiked} />
          <img src={CommentIcon} alt="Comment" className="h-24 w-24" />
          <img src={TrashIcon} alt="Trash" className="h-24 w-24" />
        </div>

        <div className="absolute -bottom-16 -right-8 flex items-baseline">
          {artists.map((artist: any) => (
            <ArtistCircle
              size={6.8}
              avatar={{
                avatarUrl: artist.avatar,
                seed: artist.username,
              }}
              key={artist.id}
            />
          ))}
        </div>
      </div>

      <div
        className="box-shadow bg-blue px-6 py-6 text-20 text-white"
        style={{
          rotate: `${generateRandomRotation((index % 10) + 2)}deg`,
        }}
      >
        {comments.length > 0
          ? comments.slice(0, 2).map((comment) => (
              <div key={comment.id}>
                <Link
                  to={`/app/artist/${comment.artist.username}`}
                  className="text-border text-pink"
                  data-text={`@${comment.artist.username}:`}
                >
                  @{comment.artist.username}:
                </Link>
                <p
                  className="text-border ml-2"
                  data-text={` ${comment.content.slice(0, 25)}...`}
                >
                  {` ${comment.content.slice(0, 25)}...`}
                </p>
              </div>
            ))
          : null}

        <button
          onClick={() => setIsOpen(true)}
          data-text={
            comments.length > 0
              ? "View more..."
              : "Be the first to comment on this artwork"
          }
          className="text-border mt-5"
        >
          {comments.length > 0
            ? "View more..."
            : "Be the first to comment on this artwork"}
        </button>
      </div>

      <Modal
        isModalOpen={isModalOpen}
        setIsOpen={setIsOpen}
        className="mt-12 flex flex-col items-center"
      >
        <p
          className="text-border mb-12 -rotate-2 text-center text-32 text-blue"
          data-text="Comments"
        >
          Comments
        </p>

        <div className="mx-auto h-[41.5rem] w-[90%] overflow-y-scroll">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={`${comment.id}${comment.artist.id}`}
                className="mb-24 flex items-start gap-5"
              >
                <ArtistCircle
                  size={6}
                  avatar={{
                    avatarUrl: comment.artist.avatar,
                    seed: comment.artist.username,
                  }}
                />

                <div>
                  <div className="w-min">
                    <BoxLabel>
                      <p
                        className="text-border text-border-sm text-16 py-2 text-justify"
                        data-text={`@${comment.artist.username}`}
                      >
                        @{comment.artist.username}
                      </p>
                    </BoxLabel>
                  </div>
                  <p className="text-22 mt-4 w-[40rem] leading-none text-black">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p
              className="text-border mb-24 text-25 text-white"
              data-text="There are no comments on this artwork"
            >
              There are no comments on this artwork
            </p>
          )}
        </div>

        <Form method="POST" action={`/comment/${artId}`} {...form.props}>
          <AuthenticityTokenInput />
          <input type="hidden" name="artworkId" value={artId} />
          <div className="flex items-center justify-center gap-8">
            <input
              type="text"
              className="input h-20 w-[29rem] px-8 py-10 text-20"
              placeholder="Your comment..."
              {...conform.input(fields.content)}
            />
            <button
              type="submit"
              className="box-shadow flex h-28 w-28 items-center justify-center rounded-full bg-pink uppercase transition-transform hover:scale-105 active:scale-90"
            >
              <div className="text-16 text-white">Post</div>
            </button>
          </div>
          <div className="flex items-center justify-center">
            <ErrorList
              errors={fields.content.errors}
              id={fields.content.errorId}
            />
          </div>
        </Form>
      </Modal>
    </article>
  )
}

export default ArtPost
