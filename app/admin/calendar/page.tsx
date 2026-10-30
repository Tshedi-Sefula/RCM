import type { Metadata } from "next";
import { Suspense } from "react";
import { deleteCalendarEntry } from "@/app/admin/calendar/actions";
import AdminLayout from "@/components/admin/AdminLayout";
import CalendarEntryFormButton from "@/components/admin/CalendarEntryFormButton";
import DataTable, { Badge, DataTableSkeleton, type Column } from "@/components/admin/DataTable";
import DeleteButton from "@/components/admin/DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import { Notice } from "@/components/ui";
import { calendarCategories, shortTime } from "@/lib/calendar";
import { getAllCalendarEntries } from "@/lib/data/admin";
import type { CalendarEntry } from "@/lib/types/database";

export const metadata: Metadata = { title: "Calendar entries" };

// `date` columns are plain "YYYY-MM-DD"; format them as UTC so the day
// never shifts with the server's time zone.
const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDates({ start_date, end_date, start_time, end_time }: CalendarEntry) {
  const start = dateFormat.format(new Date(`${start_date}T00:00:00Z`));
  const dates =
    !end_date || end_date === start_date
      ? start
      : `${start} – ${dateFormat.format(new Date(`${end_date}T00:00:00Z`))}`;
  if (!start_time) return dates;
  return `${dates}, ${shortTime(start_time)}${end_time ? `–${shortTime(end_time)}` : ""}`;
}

const columns: Column<CalendarEntry>[] = [
  {
    header: "Entry",
    cell: (entry) => (
      <div className="min-w-48">
        <p className="font-semibold text-brand-ink">{entry.title}</p>
        {entry.description && <p className="line-clamp-1 text-brand-muted">{entry.description}</p>}
        {entry.location && <p className="line-clamp-1 text-brand-muted">At {entry.location}</p>}
        <p className="text-brand-muted md:hidden">{formatDates(entry)}</p>
      </div>
    ),
  },
  {
    header: "Dates",
    className: "hidden md:table-cell whitespace-nowrap",
    cell: formatDates,
  },
  {
    header: "Category",
    cell: (entry) => {
      const category = calendarCategories[entry.category] ?? calendarCategories.other;
      return (
        <Badge>
          <span className={`mr-1.5 size-2 rounded-full ${category.swatch}`} aria-hidden />
          {category.label}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    srOnlyHeader: true,
    className: "text-right",
    cell: (entry) => (
      <div className="flex justify-end gap-1">
        <CalendarEntryFormButton entry={entry} />
        <DeleteButton action={deleteCalendarEntry.bind(null, entry.id)} itemName={entry.title} />
      </div>
    ),
  },
];

export default function AdminCalendarPage() {
  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Content"
        title="Calendar entries"
        description="Services, special events and holidays shown on the website's calendar. The weekly Sunday service is added automatically and isn't listed here."
        action={<CalendarEntryFormButton />}
      />
      <Suspense fallback={<DataTableSkeleton />}>
        <CalendarTable />
      </Suspense>
    </AdminLayout>
  );
}

async function CalendarTable() {
  const { data: entries, error } = await getAllCalendarEntries();

  if (error !== null) {
    return (
      <Notice tone="error" title="Calendar entries couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }

  return (
    <DataTable
      caption="All calendar entries, latest first"
      columns={columns}
      rows={entries}
      getKey={(entry) => entry.id}
      empty={<Notice title="No calendar entries yet">Use “Add calendar entry” to add the first one.</Notice>}
    />
  );
}
