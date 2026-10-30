import SocialLink from "@/components/SocialLink";
import FacebookIcon from "@/components/icons/FacebookIcon";
import { site } from "@/lib/site";

export default function FacebookLink({ className }: { className?: string }) {
  return (
    <SocialLink
      href={site.facebookUrl}
      label="Follow on Facebook"
      icon={<FacebookIcon className="size-5" />}
      brandClassName="hover:text-facebook focus-visible:text-facebook"
      className={className}
    />
  );
}
