import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ArtistCircle from "~/components/ArtistCircle";
import BoxLabel from "~/components/BoxLabel";
import SettingsIcon from "~/assets/misc/settings.svg";
import ProfileArtContainer from "~/components/ProfileArtContainer";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({
    username: params.username,
  });
}

const Profile = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col">
      <div className="mt-44 flex items-center gap-12 mb-32">
        <ArtistCircle size={16.9} avatarSeed={data.username} />
        <BoxLabel>
          <div className="flex items-center justify-between gap-20 py-4 px-8">
            <p className="text-border text-25" data-text={`@${data.username}`}>
              @{data.username}
            </p>
            <img src={SettingsIcon} alt="" className="w-20" />
          </div>
        </BoxLabel>
      </div>

      <ProfileArtContainer />
    </div>
  );
};

export default Profile;
