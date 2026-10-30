import type { Metadata } from "next";
import Hero from "@/components/ui/Hero";
import ChurchCalendar from "@/components/ChurchCalendar";
import { placeholderEvents } from "@/lib/placeholder-events";

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <>
      <Hero title="Church Calendar" subtitle="Services, gatherings and special events." />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <ChurchCalendar events={placeholderEvents} />
      </section>
    </>
  );
}
