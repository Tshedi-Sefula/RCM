import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { deleteEvent } from "@/app/admin/events/actions";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Badge, DataTableSkeleton, type Column } from "@/components/admin/DataTable";
import DeleteButton from "@/components/admin/DeleteButton";
import EventFormButton from "@/components/admin/EventFormButton";
import PageHeader from "@/components/admin/PageHeader";
import { Notice } from "@/components/ui";
import { getAllEvents } from "@/lib/data/admin";
import { isOptimizableImage } from "@/lib/media";
import { site } from "@/lib/site";
import type { ChurchEvent } from "@/lib/types/database";

export const metadata: Metadata = { title: "Upcoming events" };

const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: site.timeZone,
});

const columns: Column<ChurchEvent>[] = [
  {
    header: "Poster",
    srOnlyHeader: true,
    className: "w-16",
    cell: (event) =>
      event.poster_url ? (
        <div className="relative h-15 w-12 overflow-hidden rounded bg-brand-cream">
          <Image
            src={event.poster_url}
            alt=""
            fill
            sizes="48px"
            unoptimized={!isOptimizableImage(event.poster_url)}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-15 w-12 items-center justify-center rounded border border-dashed border-brand-line text-[10px] text-brand-muted">
          None
        </div>
      ),
  },
  {
    header: "Event",
    cell: (event) => (
      <div className="min-w-48">
        <p className="font-semibold text-brand-ink">{event.title}</p>
        {event.location && <p className="text-brand-muted">{event.location}</p>}
        {/* The date column is hidden on small screens, so repeat it here. */}
        <p className="text-brand-muted md:hidden">
          <time dateTime={event.event_date}>{dateFormat.format(new Date(event.event_date))}</time>
        </p>
      </div>
    ),
  },
  {
    header: "Date",
    className: "hidden md:table-cell whitespace-nowrap",
    cell: (event) => <time dateTime={event.event_date}>{dateFormat.format(new Date(event.event_date))}</time>,
  },
  {
    header: "Status",
    cell: (event) => (
      <div className="flex flex-wrap gap-1.5">
        {event.is_featured && <Badge className="bg-brand-accent-soft text-brand-accent-strong">Featured</Badge>}
        {new Date(event.event_date) < new Date() && <Badge>Past</Badge>}
      </div>
    ),
  },
  {
    header: "Actions",
    srOnlyHeader: true,
    className: "text-right",
    cell: (event) => (
      <div className="flex justify-end gap-1">
        <EventFormButton event={event} />
        <DeleteButton action={deleteEvent.bind(null, event.id)} itemName={event.title}>
          {event.poster_url && <p className="mt-2">Its poster image will be deleted too.</p>}
        </DeleteButton>
      </div>
    ),
  },
];

export default function AdminEventsPage() {
  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Content"
        title="Upcoming events"
        description="Events shown on the website's Events page. Past events stay listed here until you delete them."
        action={<EventFormButton />}
      />
      <Suspense fallback={<DataTableSkeleton />}>
        <EventsTable />
      </Suspense>
    </AdminLayout>
  );
}

async function EventsTable() {
  const { data: events, error } = await getAllEvents();

  if (error !== null) {
    return (
      <Notice tone="error" title="Events couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }

  return (
    <DataTable
      caption="All events, newest first"
      columns={columns}
      rows={events}
      getKey={(event) => event.id}
      empty={
        <Notice title="No events yet">Use “Create new event” to add the first one.</Notice>
      }
    />
  );
}
