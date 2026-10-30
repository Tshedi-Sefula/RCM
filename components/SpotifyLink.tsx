import SpotifyIcon from "@/components/icons/SpotifyIcon";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

// Circular icon button. Inherits the surrounding text colour at rest,
// turns Spotify green on hover/focus.
export default function SpotifyLink({ className }: { className?: string }) {
  return (
    <a
      href={site.spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Listen on Spotify"
      title="Listen on Spotify"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-spotify focus-visible:text-spotify",
        className,
      )}
    >
      <SpotifyIcon className="size-5" />
    </a>
  );
}
