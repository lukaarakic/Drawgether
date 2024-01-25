/* eslint-disable @typescript-eslint/no-explicit-any */

import BoxLabel from "./BoxLabel";
import LikeIcon from "~/assets/misc/like.svg";
import CommentIcon from "~/assets/misc/comment.svg";
import { Link } from "@remix-run/react";
import { FC } from "react";
import ArtistCircle from "./ArtistCircle";
import generateRandomRotation from "~/utils/getRandomRotation";

interface ArtPostProps {
  theme: string;
  artUrl: string;
  likesCount: number;
  artists: any;
  comments: any;
  likes: any;
  index: number;
}

const ArtPost: FC<ArtPostProps> = ({
  theme,
  artUrl,
  artists,
  index = 0,
  // Ovo skloni kad dodas like i comment
  /* eslint-disable @typescript-eslint/no-unused-vars */
  likesCount,
  likes,
  comments,
}) => {
  return (
    <article className="w-[57.2rem] mb-80">
      <BoxLabel degree={generateRandomRotation((index % 10) + 1)}>
        <p data-text={theme} className="text-border p-2 text-32">
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
          className="box-shadow mt-5 object-cover w-[57.2rem] h-[57.2rem]"
        />

        <div className="absolute flex -bottom-16 -left-5">
          <img src={LikeIcon} alt="Like" width={56} />
          <img src={CommentIcon} alt="Comment" />
        </div>

        <div className="absolute flex items-baseline -bottom-16 -right-8">
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            artists.map((artist: any) => (
              <ArtistCircle
                size={6.8}
                avatar={{
                  avatarUrl: artist.avatar,
                  seed: artist.username,
                }}
                key={artist.id}
              />
            ))
          }
        </div>
      </div>

      <div
        className="bg-blue box-shadow text-white text-20 px-6 py-6"
        style={{
          rotate: `${generateRandomRotation((index % 10) + 2)}deg`,
        }}
      >
        <div>
          <Link
            to={`/app/artist/willow`}
            className="text-border text-pink"
            data-text="@Willow"
          >
            @Willow
          </Link>
          <p
            className="text-border ml-2"
            data-text=": Not going to lie, this was hard to make"
          >
            : Not going to lie, this was hard to make
          </p>
        </div>

        <div className="mb-4">
          <Link
            to={`/app/artist/willow`}
            className="text-border text-pink"
            data-text="@Coco"
          >
            @Coco
          </Link>
          <p
            className="text-border ml-2"
            data-text=": Bro, you barely did anything ☠️"
          >
            : Bro, you barely did anything ☠️
          </p>
        </div>

        <Link to="#" data-text="View more..." className="text-border">
          View more...
        </Link>
      </div>
    </article>
  );
};

export default ArtPost;
