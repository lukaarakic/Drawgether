import { Link } from "react-router-dom";
import { generateRandomNumber } from "~/utils/getRandomDeg";

const SmallArt = () => {
  return (
    <Link
      to="#"
      className="w-[23rem] h-[23rem] box-shadow bg-black bg-opacity-30 overflow-hidden"
      style={{
        rotate: `${generateRandomNumber()}deg`,
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1682687220247-9f786e34d472?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
        alt=""
        className="object-cover object-center"
      />
    </Link>
  );
};

export default SmallArt;
