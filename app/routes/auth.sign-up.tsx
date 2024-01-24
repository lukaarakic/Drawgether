import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import BoxButton from "~/components/BoxButton";
import ErrorList from "~/components/ErrorList";
import { GeneralErrorBoundary } from "~/components/ErrorBoundry";
import { checkCSRF } from "~/utils/csrf.server";
import { checkHoneypot } from "~/utils/honeypot.server";
import {
  EmailSchema,
  PasswordSchema,
  UsernameSchema,
} from "~/utils/user-validation";
import { prisma } from "~/utils/db.server";
import { signup } from "~/utils/auth.server";

const RegisterSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  await checkCSRF(formData, request);
  checkHoneypot(formData);

  const submission = await parse(formData, {
    schema: RegisterSchema.superRefine(async (data, ctx) => {
      const existingArtist = await prisma.artist.findUnique({
        where: { username: data.username },
        select: {
          id: true,
        },
      });

      if (existingArtist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "An Artist already exists with this username",
        });
        return;
      }
    }).transform(async (data) => {
      const artist = signup(data);
      return { ...data, artist };
    }),
    async: true,
  });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value?.artist) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  throw redirect("/app/home");
}

const SignUpPage = () => {
  const actionData = useActionData<typeof action>();

  const [username, setUsername] = useState("");
  const [debouncedUsername] = useDebounce(username, 500);

  const [form, fields] = useForm({
    id: "register-form",
    constraint: getFieldsetConstraint(RegisterSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: RegisterSchema });
    },
  });

  return (
    <div>
      <Form
        method="POST"
        className="flex flex-col items-center gap-4 mb-12 text-20"
        {...form.props}
      >
        <HoneypotInputs />
        <AuthenticityTokenInput />

        <div className="relative text-center">
          <div className="w-36 h-36 border-only bg-white rounded-full absolute -top-2 left-0 z-10 flex items-center justify-center">
            {debouncedUsername ? (
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${debouncedUsername}`}
                alt="Usernames avatar"
                width="95%"
                height="95%"
              />
            ) : null}
          </div>

          <input
            type="text"
            placeholder="Username"
            className={`input pl-40 rotate-[1.4deg] ${
              fields.username.error ? "mb-4" : ""
            }`}
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
            {...conform.input(fields.username)}
          />
          <ErrorList
            id={fields.username.errorId}
            errors={fields.username.errors}
          />
        </div>

        <div className="text-center">
          <input
            type="email"
            placeholder="lets@drawgether.com"
            className={`input -rotate-[1.18deg] ${
              fields.email.error ? "mb-4" : ""
            }`}
            {...conform.input(fields.email)}
          />
          <ErrorList id={fields.email.errorId} errors={fields.email.errors} />
        </div>

        <div className="text-center">
          <input
            type="password"
            placeholder="********"
            className="input rotate-[1.7deg] mb-4"
            {...conform.input(fields.password)}
          />
          <ErrorList
            id={fields.password.errorId}
            errors={fields.password.errors}
          />
        </div>

        <BoxButton degree={1} type="submit" className="px-24">
          <p className="text-60">Register</p>
        </BoxButton>
      </Form>

      <div className="text-center text-white text-25">
        <p
          className="text-border text-border-sm"
          data-text="Already registered? "
        >
          Already registered?{" "}
          <Link
            to={"/auth/login"}
            className="text-border text-border-sm underline text-pink"
            data-text="Log in."
          >
            Log in.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
