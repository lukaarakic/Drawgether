import ArtistCircle from "~/components/ArtistCircle";
import BoxLabel from "~/components/BoxLabel";
import SettingsIcon from "~/assets/misc/settings.svg";
import ProfileArtContainer from "~/components/ProfileArtContainer";
import { GeneralErrorBoundary } from "~/components/ErrorBoundry";
import { useOptionalUser } from "~/utils/artist";
import Modal from "~/components/Modal";
import { useState } from "react";
import BoxButton from "~/components/BoxButton";
import { Form, useLoaderData } from "@remix-run/react";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { invariantResponse } from "~/utils/misc";

export async function loader({ params }: LoaderFunctionArgs) {
  const artist = await prisma.artist.findFirst({
    select: {
      id: true,
      username: true,
      arts: true,
      avatar: true,
      email: true,
      email_verified: true,
    },
    where: {
      username: params.username,
    },
  });

  invariantResponse(artist, "User not found", { status: 404 });

  return json({ artist });
}

const Profile = () => {
  const [isModalOpen, setIsOpen] = useState(false);

  const data = useLoaderData<typeof loader>();
  const artist = data.artist;

  const loggedInArtist = useOptionalUser();
  const isLoggedInArtist = data.artist.id === loggedInArtist?.id;

  const maskedEmail = maskEmail(artist.email);

  return (
    <div className="w-[80rem] mx-auto mt-24">
      <div className="mt-44 flex items-center justify-center gap-16 mb-32">
        <ArtistCircle
          size={16.9}
          avatar={{
            avatarUrl: artist.avatar,
            seed: artist.username,
          }}
        />
        <BoxLabel degree={-2}>
          <div className="flex items-center justify-between gap-20 px-4 w-[41.3rem] h-40">
            <p
              className="text-border text-32"
              data-text={`@${artist.username}`}
            >
              @{artist.username}
            </p>

            {isLoggedInArtist ? (
              <button onClick={() => setIsOpen(true)}>
                <img src={SettingsIcon} alt="" className="w-20" />
              </button>
            ) : null}
          </div>
        </BoxLabel>
      </div>

      {artist.arts.length > 0 ? (
        <ProfileArtContainer arts={artist.arts} />
      ) : (
        <BoxLabel>
          <p
            className="text-32 text-white text-border text-border-sm text-center w-full"
            data-text="No arts available"
          >
            No arts available
          </p>
        </BoxLabel>
      )}

      {isLoggedInArtist ? (
        <Modal
          setIsOpen={setIsOpen}
          isModalOpen={isModalOpen}
          className="flex flex-col items-center mt-12"
        >
          <p
            className="text-blue text-32 text-border text-center mb-12"
            data-text="Settings"
          >
            Settings
          </p>

          <ArtistCircle
            size={16.9}
            avatar={{ avatarUrl: artist.avatar, seed: artist.username }}
          />

          <p className="text-29 text-black mt-8">
            Username: 🎨{artist.username}
          </p>
          <p className="text-29 text-black">Email: {maskedEmail}</p>

          <p
            className={`text-29 capitalize mb-10 mt-8 ${
              artist.email_verified ? "text-blue" : "text-pink"
            }`}
          >
            {artist.email_verified ? "Email Verified" : "email not verified!"}
          </p>

          <Form method="POST" action="/auth/logout">
            <AuthenticityTokenInput />
            <BoxButton>
              <p
                className="text-38 px-12 py-2 font-zyzol text-border uppercase"
                data-text="Log out"
              >
                Log out
              </p>
            </BoxButton>
          </Form>
        </Modal>
      ) : null}
    </div>
  );
};

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      className="!h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      statusHandlers={{
        404: ({ params }) => {
          // eslint-disable-next-line react/no-unescaped-entities
          return <p>There is no artist with username "{params.username}"</p>;
        },
      }}
    />
  );
}

function maskEmail(email: string): string {
  const [username, domain] = email.split("@");
  const maskedUsername =
    username.charAt(0) + "*".repeat(3) + username.charAt(username.length - 1);
  return maskedUsername + "@" + domain;
}

export default Profile;
