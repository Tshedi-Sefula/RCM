import type { Metadata } from "next";
import { Suspense } from "react";
import { deleteContactMessage } from "@/app/admin/messages/actions";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/admin/DataTable";
import DeleteButton from "@/components/admin/DeleteButton";
import MarkReadButton from "@/components/admin/MarkReadButton";
import PageHeader from "@/components/admin/PageHeader";
import { Notice } from "@/components/ui";
import { cn } from "@/lib/cn";
import { contactTopicLabel } from "@/lib/contact";
import { getAllContactMessages } from "@/lib/data/admin";
import { site } from "@/lib/site";
import type { ContactMessage } from "@/lib/types/database";

export const metadata: Metadata = { title: "Messages" };

const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: site.timeZone,
});

// wa.me needs the number in international form without "+"; South African
// numbers are often written locally, e.g. 082 123 4567 → 27821234567.
function whatsappUrl(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? `27${digits.slice(1)}` : digits}`;
}

const linkClass = "text-brand-primary underline underline-offset-2 hover:text-brand-accent-strong";

export default function AdminMessagesPage() {
  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Questions and prayer requests sent through the website's contact form, newest first. Only admins can see these."
      />
      <Suspense fallback={<MessagesSkeleton />}>
        <MessageList />
      </Suspense>
    </AdminLayout>
  );
}

async function MessageList() {
  const { data: messages, error } = await getAllContactMessages();

  if (error !== null) {
    return (
      <Notice tone="error" title="Messages couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }

  if (messages.length === 0) {
    return <Notice title="No messages yet">Messages from the website&apos;s contact form will appear here.</Notice>;
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <>
      <p className="mb-4 text-sm text-brand-muted">
        {messages.length} {messages.length === 1 ? "message" : "messages"}
        {unread > 0 && `, ${unread} unread`}
      </p>
      <ul className="space-y-4">
        {messages.map((message) => (
          <li key={message.id}>
            <MessageCard message={message} />
          </li>
        ))}
      </ul>
    </>
  );
}

function MessageCard({ message }: { message: ContactMessage }) {
  return (
    <article
      className={cn(
        "rounded-lg border bg-white p-5 shadow-card sm:p-6",
        message.is_read ? "border-brand-line" : "border-brand-accent/40 border-l-4 border-l-brand-accent",
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">{message.name}</h2>
            {!message.is_read && <Badge className="bg-brand-accent text-white">New</Badge>}
            <Badge className={message.topic === "prayer" ? "bg-brand-accent-soft text-brand-accent-strong" : undefined}>
              {contactTopicLabel(message.topic)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-brand-muted">
            <time dateTime={message.created_at}>{dateFormat.format(new Date(message.created_at))}</time>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <MarkReadButton id={message.id} isRead={message.is_read} />
          <DeleteButton
            action={deleteContactMessage.bind(null, message.id)}
            itemName={`the message from ${message.name}`}
          />
        </div>
      </header>

      <p className="mt-4 whitespace-pre-wrap break-words text-brand-ink">{message.message}</p>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-brand-line pt-4 text-sm">
        {message.email && (
          <li>
            <a href={`mailto:${message.email}`} className={linkClass}>
              {message.email}
            </a>
          </li>
        )}
        {message.phone && (
          <>
            <li>
              <a href={`tel:${message.phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
                {message.phone}
              </a>
            </li>
            <li>
              <a href={whatsappUrl(message.phone)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp<span className="sr-only"> {message.name} (opens in a new tab)</span>
              </a>
            </li>
          </>
        )}
      </ul>
    </article>
  );
}

function MessagesSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-lg bg-brand-cream" />
      ))}
    </div>
  );
}
