import {
  redirect,
  type MetaFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import BoxButton from "~/components/BoxButton";

export const meta: MetaFunction = () => {
  return [
    { title: "Drawgether" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  console.log(email, password);

  throw redirect("/app/home");
}

export default function Index() {
  return (
    <div className="flex flex-col">
      <Form method="POST" className="flex flex-col items-center gap-4 mb-8">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="lets@drawgether.com"
          className="input rotate-[1.4deg]"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="********"
          className="input -rotate-[1.18deg] mb-4"
        />

        <BoxButton degree={1.35} type="submit" className="px-32">
          <p className="text-60">Log in</p>
        </BoxButton>
      </Form>

      <div className="text-center text-white text-25 drop-shadow-filter-sm">
        <p>
          Don’t have an account?{" "}
          <Link
            to={"/auth/sign-up"}
            className="underline text-pink"
            prefetch="intent"
          >
            Register.
          </Link>
        </p>
        <p>
          Forgot your password?{" "}
          <Link
            to={"/auth/login"}
            className="underline text-pink"
            prefetch="intent"
          >
            Reset it.
          </Link>
        </p>
      </div>
    </div>
  );
}
