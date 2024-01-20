import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Link } from "react-router-dom";
import BoxButton from "~/components/BoxButton";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(email, password, username);

  throw redirect("/app/home");
}

const SignUpPage = () => {
  return (
    <div>
      <Form
        method="POST"
        className="flex flex-col items-center gap-4 mb-8 text-20"
      >
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          className="input rotate-[1.4deg]"
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="lets@drawgether.com"
          className="input -rotate-[1.18deg]"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="********"
          className="input rotate-[1.7deg]"
        />
        <BoxButton degree={1} type="submit">
          Register
        </BoxButton>
      </Form>

      <div className="text-center text-white text-25">
        <p>
          Already registered?{" "}
          <Link to={"/auth/login"} className="underline text-pink">
            Log in.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
