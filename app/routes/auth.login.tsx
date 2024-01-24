import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  type MetaFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { z } from "zod";
import BoxButton from "~/components/BoxButton";
import ErrorList from "~/components/ErrorList";
import { GeneralErrorBoundary } from "~/components/ErrorBoundry";
import { checkCSRF } from "~/utils/csrf.server";
import { checkHoneypot } from "~/utils/honeypot.server";
import { EmailSchema, PasswordSchema } from "~/utils/user-validation";
import { sessionStorage } from "~/utils/session.server";
import {
  getSessionExpirationDate,
  login,
  requireAnonymous,
} from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Drawgether | Login" },
    { name: "description", content: "Login into drawgether" },
  ];
};

const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  remember: z.boolean().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  await requireAnonymous(request);

  const formData = await request.formData();

  await checkCSRF(formData, request);
  checkHoneypot(formData);

  const submission = await parse(formData, {
    schema: (intent) =>
      LoginSchema.transform(async (data, ctx) => {
        if (intent !== "submit") return { ...data, artist: null };

        const artist = await login(data);
        if (!artist) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid username or password",
          });
          return z.NEVER;
        }

        return { ...data, artist };
      }),
    async: true,
  });
  delete submission.payload.password;

  if (submission.intent !== "submit") {
    // @ts-expect-error - conform
    delete submission.value?.password;
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value?.artist) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  const { artist, remember } = submission.value;

  const cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  cookieSession.set("artistId", artist.id);

  return redirect("/app/home", {
    headers: {
      "set-cookie": await sessionStorage.commitSession(cookieSession, {
        expires: remember ? getSessionExpirationDate() : undefined,
      }),
    },
  });
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
        <AuthenticityTokenInput />

        <input
          placeholder="lets@drawgether.com"
          className="input rotate-[1.4deg]"
          {...conform.input(fields.email)}
        />
        <ErrorList id={fields.email.errorId} errors={fields.email.errors} />

        <input
          type="password"
          placeholder="********"
          className="input -rotate-[1.18deg] mb-4"
          {...conform.input(fields.password)}
        />
        <ErrorList
          id={fields.password.errorId}
          errors={fields.password.errors}
        />

        <div>
          <div className="checkbox">
            <input type="checkbox" className="check" id="check2" />
            <label
              htmlFor="check2"
              className="flex items-center justify-center"
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 100 100"
                className="drop-shadow-filter"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={28}
                  strokeWidth="4"
                  stroke="#212121"
                  fill="#ffffff"
                />
                <g transform="translate(0,-952.36222)">
                  <path
                    d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4 "
                    stroke="#de6b9b"
                    strokeWidth="5"
                    fill="none"
                    className="path1"
                  />
                </g>
              </svg>
              <span
                className="text-20 text-border text-border-sm text-white"
                data-text="Remember me?"
              >
                Remember me?
              </span>
            </label>
          </div>
        </div>

        <ErrorList id={form.errorId} errors={form.errors} />
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

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
