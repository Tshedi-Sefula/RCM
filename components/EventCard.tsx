import Image from "next/image";
import Card from "@/components/ui/Card";
import Heading from "@/components/ui/Heading";
import { isOptimizableImage } from "@/lib/media";
import { site } from "@/lib/site";
import type { ChurchEvent } from "@/lib/types/database";

const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: site.timeZone,
});

const timeFormat = new Intl.DateTimeFormat("en-ZA", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: site.timeZone,
});

export default function EventCard({ event }: { event: ChurchEvent }) {
  const date = new Date(event.event_date);

  return (
    <Card padded={false} className="flex h-full flex-col">
      {event.poster_url && (
        <a
          href={event.poster_url}
          target="_blank"
          rel="noopener noreferrer"
          // Posters carry the details, so show them whole (contain, not cover).
          className="group relative block aspect-[4/5] bg-brand-primary"
          aria-label={`Open the poster for ${event.title} in a new tab`}
        >
          <Image
            src={event.poster_url}
            alt=""
            fill
            unoptimized={!isOptimizableImage(event.poster_url)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
        </a>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent-strong">
          <time dateTime={event.event_date}>
            {dateFormat.format(date)} · {timeFormat.format(date)}
          </time>
        </p>
        <Heading level={2} size={3} className="mt-2">
          {event.title}
        </Heading>
        {event.location && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-brand-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden>
              <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>
              <span className="sr-only">Location: </span>
              {event.location}
            </span>
          </p>
        )}
        {event.description && (
          <p className="mt-4 whitespace-pre-line text-brand-ink/85">{event.description}</p>
        )}
        {event.poster_url && (
          <a
            href={event.poster_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto pt-5 text-sm font-semibold text-brand-accent-strong underline-offset-4 hover:underline"
          >
            View poster ↗
          </a>
        )}
      </div>
    </Card>
  );
}
