import { Form } from "@remix-run/react";
import BoxButton from "~/components/BoxButton";
import { generateRandomNumber } from "~/utils/getRandomDeg";
import SearchIcon from "~/assets/misc/searchIcon.svg";

const SearchPage = () => {
  return (
    <main className="mt-60">
      <Form className="flex gap-6 items-center">
        <input
          type="text"
          name="input"
          id="input"
          className="input"
          placeholder="Search..."
          style={{
            rotate: `${generateRandomNumber()}deg`,
          }}
        />
        <BoxButton
          type="submit"
          className="p-4"
          degree={generateRandomNumber()}
        >
          <img src={SearchIcon} alt="" className="w-[5.5rem] h-[5.5rem]" />
        </BoxButton>
      </Form>
    </main>
  );
};

export default SearchPage;
