import type { Metadata } from "next";
import { Suspense } from "react";
import ChurchCalendar, { CalendarSkeleton } from "@/components/ChurchCalendar";
import { Container, Hero, Notice } from "@/components/ui";
import { calendarCategories } from "@/lib/calendar";
import { getCalendarEntries } from "@/lib/data/public";
import { placeholderCalendarEntries } from "@/lib/placeholder-events";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Calendar" };

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
  const { data: entries, error } = await getCalendarEntries();

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

  return <ChurchCalendar entries={entries} />;
}

function CalendarLegend() {
  return (
    <section aria-labelledby="calendar-legend" className="mt-10 rounded-2xl border border-brand-line bg-white p-6">
      <h2 id="calendar-legend" className="font-display text-lg font-semibold">
        What the colours mean
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {Object.entries(calendarCategories).map(([key, category]) => (
          <div key={key} className="flex items-start gap-3">
            <span aria-hidden className={`mt-1 size-4 shrink-0 rounded ${category.swatch}`} />
            <div>
              <dt className="font-semibold">{category.label}</dt>
              <dd className="text-sm text-brand-muted">{category.description}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
