import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  type MetaFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { z } from "zod";
import BoxButton from "~/components/BoxButton";
import ErrorList from "~/components/ErrorList";
import { checkHoneypot } from "~/utils/honeypot.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Drawgether | Login" },
    { name: "description", content: "Login into drawgether" },
  ];
};

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(30),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parse(formData, {
    schema: LoginSchema,
  });

  checkHoneypot(formData);

  if (!submission.value) {
    return json({ status: "error", submission }, { status: 400 });
  }

  throw redirect("/app/home");
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "login-form",
    constraint: getFieldsetConstraint(LoginSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: LoginSchema });
    },
  });

  return (
    <div className="flex flex-col">
      <Form
        method="POST"
        className="flex flex-col items-center gap-4 mb-8"
        {...form.props}
      >
        <HoneypotInputs />

        <input
          placeholder="lets@drawgether.com"
          className="input rotate-[1.4deg]"
          {...conform.input(fields.email)}
        />
        <ErrorList id={fields.email.errorId} errors={fields.email.errors} />

        <input
          type="password"
          placeholder="********"
          className="input -rotate-[1.18deg] mb-4 transition-all"
          {...conform.input(fields.password)}
        />
        <ErrorList
          id={fields.password.errorId}
          errors={fields.password.errors}
        />

        <BoxButton degree={1.35} type="submit" className="px-32">
          <p className="text-60">Log in</p>
        </BoxButton>
      </Form>

      <div className="text-center text-white text-25 flex flex-col">
        <p
          data-text="Don’t have an account?"
          className="text-border text-border-sm"
        >
          Don’t have an account?{" "}
          <Link
            to={"/auth/sign-up"}
            className="underline text-pink text-border text-border-sm"
            data-text="Register."
            prefetch="intent"
          >
            Register.
          </Link>
        </p>
        <p
          data-text="Forgot your password?"
          className="text-border text-border-sm"
        >
          Forgot your password?{" "}
          <Link
            to={"/auth/login"}
            className="underline text-pink text-border text-border-sm"
            data-text="Reset it."
            prefetch="intent"
          >
            Reset it.
          </Link>
        </p>
      </div>
    </div>
  );
}
