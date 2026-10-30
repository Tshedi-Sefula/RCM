import type { Metadata } from "next";
import { Suspense } from "react";
import { deleteStreamVideo } from "@/app/admin/streams/actions";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Badge, DataTableSkeleton, type Column } from "@/components/admin/DataTable";
import DeleteButton from "@/components/admin/DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import StreamFormButton from "@/components/admin/StreamFormButton";
import { Notice } from "@/components/ui";
import { getAllStreamVideos } from "@/lib/data/admin";
import { streamWatchUrl } from "@/lib/media";
import type { StreamPlatform, StreamVideo } from "@/lib/types/database";

export const metadata: Metadata = { title: "Stream videos" };

// `date` columns are plain "YYYY-MM-DD"; format them as UTC so the day
// never shifts with the server's time zone.
const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const platformLabels: Record<StreamPlatform, string> = { youtube: "YouTube", facebook: "Facebook" };

function formatDate({ stream_date }: StreamVideo) {
  return stream_date ? dateFormat.format(new Date(`${stream_date}T00:00:00Z`)) : "No date";
}

const columns: Column<StreamVideo>[] = [
  {
    header: "Stream",
    cell: (stream) => {
      const watchUrl = streamWatchUrl(stream.platform, stream.video_id_or_url);
      return (
        <div className="min-w-48">
          <p className="font-semibold text-brand-ink">{stream.title}</p>
          {watchUrl ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline underline-offset-2 hover:text-brand-accent-strong"
            >
              Watch on {platformLabels[stream.platform]}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <p className="text-error">This link can&apos;t be played. Edit it to fix it.</p>
          )}
          <p className="text-brand-muted md:hidden">{formatDate(stream)}</p>
        </div>
      );
    },
  },
  {
    header: "Date",
    className: "hidden md:table-cell whitespace-nowrap",
    cell: formatDate,
  },
  {
    header: "Platform",
    cell: (stream) => (
      <div className="flex flex-wrap gap-1.5">
        <Badge>{platformLabels[stream.platform]}</Badge>
        {stream.is_memorable && <Badge className="bg-brand-accent-soft text-brand-accent-strong">Memorable</Badge>}
      </div>
    ),
  },
  {
    header: "Actions",
    srOnlyHeader: true,
    className: "text-right",
    cell: (stream) => (
      <div className="flex justify-end gap-1">
        <StreamFormButton stream={stream} />
        <DeleteButton action={deleteStreamVideo.bind(null, stream.id)} itemName={stream.title} />
      </div>
    ),
  },
];

export default function AdminStreamsPage() {
  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Content"
        title="Stream videos"
        description="YouTube and Facebook recordings. The home page plays the newest memorable stream, or the newest stream if none are marked memorable."
        action={<StreamFormButton />}
      />
      <Suspense fallback={<DataTableSkeleton />}>
        <StreamsTable />
      </Suspense>
    </AdminLayout>
  );
}

async function StreamsTable() {
  const { data: streams, error } = await getAllStreamVideos();

  if (error !== null) {
    return (
      <Notice tone="error" title="Stream videos couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }

  return (
    <DataTable
      caption="All stream videos, latest first"
      columns={columns}
      rows={streams}
      getKey={(stream) => stream.id}
      empty={<Notice title="No streams yet">Use “Add stream” to add the first one.</Notice>}
    />
  );
}
