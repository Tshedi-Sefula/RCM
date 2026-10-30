import SocialLink from "@/components/SocialLink";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import { site } from "@/lib/site";

export default function SpotifyLink({ className }: { className?: string }) {
  return (
    <SocialLink
      href={site.spotifyUrl}
      label="Listen on Spotify"
      icon={<SpotifyIcon className="size-5" />}
      brandClassName="hover:text-spotify focus-visible:text-spotify"
      className={className}
    />
  );
}
