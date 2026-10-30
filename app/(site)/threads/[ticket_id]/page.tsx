import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import PublicThreadView from "@/components/PublicThreadView";
import { Container, Notice } from "@/components/ui";
import { contactTopicLabel } from "@/lib/contact";
import { getPublicThread } from "@/lib/data/threads";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Your conversation",
  // The URL is the sender's only key: keep it out of search engines and out
  // of the Referer header sent to any linked site.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

// Every ticket_id is private and only known at request time, so there's no
// static shell to prerender: the site Header's usePathname() would otherwise
// block it. Render on the server per request instead.
export const instant = false;

export default function ThreadPage({ params }: PageProps<"/threads/[ticket_id]">) {
  return (
    <Container width="narrow" className="py-12 sm:py-16">
      <Suspense fallback={<ThreadSkeleton />}>
        {params.then(({ ticket_id }) => (
          <Thread ticketId={ticket_id} />
        ))}
      </Suspense>
    </Container>
  );
}

async function Thread({ ticketId }: { ticketId: string }) {
  if (!isSupabaseConfigured) {
    return <Notice title="Messages aren't available right now">Please try again later.</Notice>;
  }

  // Outside the try: during prerendering this rejects on purpose, and that
  // must reach Next.js rather than show the error notice.
  await connection();
  let thread;
  try {
    thread = await getPublicThread(ticketId);
  } catch (error) {
    console.error("Couldn't load thread:", error);
    return (
      <Notice tone="error" title="Your conversation couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }
  if (!thread) notFound();

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
        {contactTopicLabel(thread.topic)}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Your conversation with the church</h1>
      <p className="mt-3 text-brand-muted">
        Bookmark this page to come back to it. Anyone with this link can read the conversation, so keep it private.
      </p>
      <div className="mt-8">
        <PublicThreadView ticketId={ticketId} initial={thread} />
      </div>
      <p className="mt-6 text-sm">
        <Link href="/contact" className="font-semibold text-brand-accent-strong underline-offset-4 hover:underline">
          Send a new message
        </Link>
      </p>
    </>
  );
}

function ThreadSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-4 w-32 animate-pulse rounded bg-brand-cream" />
      <div className="mt-3 h-10 w-96 max-w-full animate-pulse rounded bg-brand-cream" />
      <div className="mt-8 h-96 animate-pulse rounded-lg bg-brand-cream" />
    </div>
  );
}
