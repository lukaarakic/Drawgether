import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ArtistCircle from "~/components/ArtistCircle";
import BoxLabel from "~/components/BoxLabel";
import SettingsIcon from "~/assets/misc/settings.svg";
import ProfileArtContainer from "~/components/ProfileArtContainer";
import { GeneralErrorBoundary } from "~/components/ErrorBoundry";
import { prisma } from "~/utils/db.server";
import { invariantResponse } from "~/utils/misc";

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.artist.findUnique({
    where: {
      username: params.username,
    },
    select: {
      avatar: true,
      username: true,
      arts: {
        select: {
          id: true,
          art: true,
        },
      },
    },
  });

  if (!user) {
    invariantResponse(user, `User does not exist`, { status: 404 });
  }

  return json({
    user,
  });
}

const Profile = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col">
      <div className="mt-44 flex items-center gap-12 mb-32">
        <ArtistCircle
          size={16.9}
          avatar={{
            avatarUrl: data.user?.avatar,
            seed: data?.user?.username,
          }}
        />
        <BoxLabel>
          <div className="flex items-center justify-between gap-20 py-4 px-8">
            <p
              className="text-border text-25"
              data-text={`@${data.user?.username}`}
            >
              @{data.user?.username}
            </p>
            <img src={SettingsIcon} alt="" className="w-20" />
          </div>
        </BoxLabel>
      </div>

      {data.user.arts.length > 0 ? (
        <ProfileArtContainer arts={data.user.arts} />
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

export default Profile;
