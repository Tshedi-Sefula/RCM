import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/cn";
import type { ServiceTime } from "@/lib/site";

// "Online via WhatsApp" under an online service's time. Becomes a join link
// once the service has a WhatsApp group invite URL in lib/site.ts.
export default function OnlineServiceNote({ service, className }: { service: ServiceTime; className?: string }) {
  if (!service.online) return null;

  const content = (
    <>
      <WhatsAppIcon className="size-3.5 shrink-0" />
      {service.whatsappUrl ? "Join on WhatsApp" : "Online via WhatsApp"}
    </>
  );
  const classes = cn("mt-0.5 inline-flex items-center gap-1.5 text-xs", className);

  return service.whatsappUrl ? (
    <a
      href={service.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(classes, "underline decoration-current/40 underline-offset-2 transition-colors hover:decoration-current")}
    >
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <span className={classes}>{content}</span>
  );
}
