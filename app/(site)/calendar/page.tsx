import type { Metadata } from "next";
import { Suspense } from "react";
import ChurchCalendar, { CalendarSkeleton } from "@/components/ChurchCalendar";
import { Container, Hero, Notice } from "@/components/ui";
import { calendarCategories } from "@/lib/calendar";
import { getCalendarChurchEvents, getCalendarEntries } from "@/lib/data/public";
import { placeholderCalendarEntries } from "@/lib/placeholder-events";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Services, special events and public holidays on the RCM Toitskraal church calendar.",
  alternates: { canonical: "/calendar" },
};

export default function CalendarPage() {
  return (
    <>
      <Hero title="Church Calendar" subtitle="Services, special events and holidays for the year." />
      <Container className="py-16">
        <Suspense fallback={<CalendarSkeleton />}>
          <Calendar />
        </Suspense>
        <CalendarLegend />
      </Container>
    </>
  );
}

async function Calendar() {
  const [{ data: entries, error }, { data: churchEvents }] = await Promise.all([
    getCalendarEntries(),
    getCalendarChurchEvents(),
  ]);

  if (error !== null) {
    // Local development without Supabase: preview with sample dates.
    if (!isSupabaseConfigured) {
      return (
        <>
          <Notice title="Showing sample dates" className="mb-8 p-5">
            Connect Supabase to show the church&apos;s real calendar.
          </Notice>
          <ChurchCalendar entries={placeholderCalendarEntries} />
        </>
      );
    }
    return (
      <Notice tone="error" title="We couldn't load the calendar">
        Please try again in a little while.
      </Notice>
    );
  }

  return <ChurchCalendar entries={entries} churchEvents={churchEvents ?? []} />;
}

function CalendarLegend() {
  const legendItems = [
    ...Object.entries(calendarCategories).map(([key, category]) => ({
      key,
      label: category.label,
      description: category.description,
      swatch: category.swatch,
    })),
    {
      key: "church-event",
      label: "Featured church events",
      description: "Upcoming events and gatherings from our Events page",
      swatch: "bg-brand-accent",
    },
  ];

  return (
    <section aria-labelledby="calendar-legend" className="mt-10 rounded-2xl border border-brand-line bg-white p-6">
      <h2 id="calendar-legend" className="font-display text-lg font-semibold">
        What the colours mean
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {legendItems.map((item) => (
          <div key={item.key} className="flex items-start gap-3">
            <span aria-hidden className={`mt-1 size-4 shrink-0 rounded ${item.swatch}`} />
            <div>
              <dt className="font-semibold">{item.label}</dt>
              <dd className="text-sm text-brand-muted">{item.description}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
