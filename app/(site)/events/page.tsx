import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import { Container, Hero, Notice } from "@/components/ui";
import { getUpcomingEvents } from "@/lib/data/public";

export const metadata: Metadata = { title: "Upcoming Events" };

export default function EventsPage() {
  return (
    <>
      <Hero title="Upcoming Events" image="/images/videos-hero.jpg" />
      <Container className="py-16">
        <Suspense fallback={<EventsSkeleton />}>
          <EventList />
        </Suspense>
        <Link
          href="/calendar"
          className="mt-10 inline-block font-semibold text-brand-accent-strong underline-offset-4 hover:underline"
        >
          See everything on the calendar →
        </Link>
      </Container>
    </>
  );
}

async function EventList() {
  const { data: events, error } = await getUpcomingEvents();

  if (error !== null) {
    return (
      <Notice tone="error" title="We couldn't load events">
        Please try again in a little while, or check the calendar for regular services.
      </Notice>
    );
  }
  if (events.length === 0) {
    return (
      <Notice title="No upcoming events right now">
        Join us at our regular services, and check back soon for special events.
      </Notice>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}

function EventsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-2xl bg-brand-cream" />
      ))}
    </div>
  );
}
