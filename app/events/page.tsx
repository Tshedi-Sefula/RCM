import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/ui/Hero";
import { placeholderEvents } from "@/lib/placeholder-events";

export const metadata: Metadata = { title: "Upcoming Events" };

const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
});

// One-off events only; weekly services are shown on the home page and calendar.
const upcoming = placeholderEvents
  .filter((e) => e.start)
  .sort((a, b) => String(a.start).localeCompare(String(b.start)));

export default function EventsPage() {
  return (
    <>
      <Hero title="Upcoming Events" image="/images/videos-hero.jpg" />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <ul className="space-y-4">
          {upcoming.map((event) => (
            <li key={event.id} className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold">{event.title}</h2>
              <p className="mt-1 text-brand-muted">
                {dateFormat.format(new Date(String(event.start)))}
              </p>
            </li>
          ))}
        </ul>
        <Link href="/calendar" className="mt-8 inline-block font-medium text-brand-accent-strong hover:underline">
          See everything on the calendar →
        </Link>
      </section>
    </>
  );
}
