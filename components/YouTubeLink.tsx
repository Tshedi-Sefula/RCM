import SocialLink from "@/components/SocialLink";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import { site } from "@/lib/site";

export default function YouTubeLink({ className }: { className?: string }) {
  return (
    <SocialLink
      href={site.youtubeUrl}
      label="Watch on YouTube"
      icon={<YouTubeIcon className="size-5" />}
      brandClassName="hover:text-youtube focus-visible:text-youtube"
      className={className}
    />
  );
}
