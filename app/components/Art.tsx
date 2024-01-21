import BoxLabel from "./BoxLabel";
import LikeIcon from "~/assets/misc/like.svg";
import CommentIcon from "~/assets/misc/comment.svg";
import { Link } from "@remix-run/react";
import { generateRandomNumber } from "~/utils/getRandomDeg";

const Art = () => {
  return (
    <article className="w-[35.75rem] h-[35.75rem]">
      <BoxLabel>A blue man in a purple jacket.</BoxLabel>

      <div className="relative mb-12">
        <img
          src="https://e1.pxfuel.com/desktop-wallpaper/107/890/desktop-wallpaper-drawing-for-kids-drawing-for-kids-png-cliparts-on-clipart-library.jpg"
          alt=""
          className="box-shadow mt-3 object-cover"
        />

        <div className="absolute flex -bottom-8 -left-5">
          <img src={LikeIcon} alt="" />
          <img src={CommentIcon} alt="" />
        </div>

        <div className="absolute flex items-baseline -bottom-8 -right-8">
          <div className="w-[3.75rem] h-[3.75rem] rounded-full box-shadow bg-white">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=netrunners"
              alt=""
            />
          </div>
          <div className="w-[3.75rem] h-[3.75rem] rounded-full box-shadow -ml-4 bg-white">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=luka"
              alt=""
            />
          </div>
          <div className="w-[3.75rem] h-[3.75rem] rounded-full box-shadow -ml-4 bg-white">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=nikola"
              alt=""
            />
          </div>
        </div>
      </div>

      <div
        className="bg-blue box-shadow text-white text-18 text-border px-4 py-4"
        style={{
          rotate: `${generateRandomNumber()}deg`,
        }}
      >
        <p>
          <Link to={`/app/profile/id`} className="text-pink">
            @Willow
          </Link>
          : Not going to lie, this was hard to make
        </p>
        <p>
          <Link to={`/app/profile/id`} className="text-pink">
            @Coco
          </Link>
          : Bro, you barely did anything ☠️
        </p>
        <Link to="#">View more...</Link>
      </div>
    </article>
  );
};

export default Art;
