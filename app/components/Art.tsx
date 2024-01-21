import BoxLabel from "./BoxLabel";
import LikeIcon from "~/assets/misc/like.svg";
import CommentIcon from "~/assets/misc/comment.svg";
import { Link } from "@remix-run/react";
import { generateRandomNumber } from "~/utils/getRandomDeg";
import ArtistCircle from "./ArtistCircle";

const Art = () => {
  return (
    <article className="w-[57.2rem] h-[57.2rem]">
      <BoxLabel>
        <p
          data-text="A blue man in a purple jacket."
          className="text-border p-2 text-32"
        >
          A blue man in a purple jacket.
        </p>
      </BoxLabel>

      <div className="relative mb-24">
        <img
          src="https://e1.pxfuel.com/desktop-wallpaper/107/890/desktop-wallpaper-drawing-for-kids-drawing-for-kids-png-cliparts-on-clipart-library.jpg"
          alt=""
          className="box-shadow mt-5 object-cover"
        />

        <div className="absolute flex -bottom-16 -left-5">
          <img src={LikeIcon} alt="Like" width={56} />
          <img src={CommentIcon} alt="Comment" />
        </div>

        <div className="absolute flex items-baseline -bottom-16 -right-8">
          <ArtistCircle avatarSeed="netrunners" size={6} />
          <ArtistCircle avatarSeed="luka" size={6} className="-ml-8" />
          <ArtistCircle avatarSeed="nikola" size={6} className="-ml-8" />
        </div>
      </div>

      <div
        className="bg-blue box-shadow text-white text-20 px-6 py-6"
        style={{
          rotate: `${generateRandomNumber()}deg`,
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

export default Art;
