"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import OnlineServiceNote from "@/components/OnlineServiceNote";
import Container from "@/components/ui/Container";
import { site } from "@/lib/site";

// South Africa is UTC+2 with no daylight saving (see lib/data/public.ts).
const OFFSET_MS = 2 * 60 * 60 * 1000;
// A service counts as "in progress" for this long after it starts.
const SERVICE_LENGTH_MS = 2 * 60 * 60 * 1000;

// Ticks once a second; the snapshot is the current whole second so React
// only re-renders when the countdown actually changes.
function subscribeToClock(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000);

// The most recent and next service start times (UTC ms) around `now`.
function serviceWindow(now: number) {
  // UTC getters on this Date read the church's wall-clock time.
  const local = new Date(now + OFFSET_MS);
  let next = Infinity;
  let previous = -Infinity;
  for (const s of site.serviceSchedule) {
    const start = new Date(local);
    start.setUTCDate(local.getUTCDate() + ((s.weekday - local.getUTCDay() + 7) % 7));
    start.setUTCHours(s.hour, s.minute, 0, 0);
    let t = start.getTime() - OFFSET_MS;
    if (t <= now) {
      previous = Math.max(previous, t);
      t += 7 * 24 * 60 * 60 * 1000;
    } else {
      previous = Math.max(previous, t - 7 * 24 * 60 * 60 * 1000);
    }
    next = Math.min(next, t);
  }
  return { next, previous };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function ServiceBar() {
  // Null during prerender and hydration, so the server HTML never shows a stale time.
  const seconds = useSyncExternalStore(subscribeToClock, nowInSeconds, () => null);

  let parts: Array<[string, string]> = [
    ["Days", "--"],
    ["Hours", "--"],
    ["Min", "--"],
    ["Sec", "--"],
  ];
  let live = false;
  if (seconds !== null) {
    const now = seconds * 1000;
    const { next, previous } = serviceWindow(now);
    live = now - previous < SERVICE_LENGTH_MS;
    const left = Math.max(0, Math.floor((next - now) / 1000));
    parts = [
      ["Days", pad(Math.floor(left / 86400))],
      ["Hours", pad(Math.floor((left % 86400) / 3600))],
      ["Min", pad(Math.floor((left % 3600) / 60))],
      ["Sec", pad(left % 60)],
    ];
  }

  return (
    <section id="service-times" aria-label="Service times" className="scroll-mt-16 bg-brand-accent text-white sm:scroll-mt-20">
      <Container className="flex flex-col gap-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em] text-white/80">
            {live ? "Service in progress" : "Next service in"}
          </p>
          <div className="flex items-center gap-2 tabular-nums sm:gap-3" aria-live="off">
            {parts.map(([label, value], i) => (
              <div key={label} className="flex items-center gap-2 sm:gap-3">
                {i > 0 && (
                  <span aria-hidden className="text-xl font-bold text-white/50">
                    :
                  </span>
                )}
                <div className="min-w-12 rounded-md bg-black/20 px-2 py-1.5 text-center">
                  <p className="text-xl font-extrabold leading-none sm:text-2xl">{value}</p>
                  <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white/70">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/20 pt-5 sm:flex-row sm:items-center sm:gap-8 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 xl:flex-nowrap">
            {site.serviceTimes.map((s) => (
              <li key={s.day} className="xl:whitespace-nowrap">
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  {s.day}
                  {s.group && ` · ${s.group}`}
                </span>
                <span className="block font-semibold">{s.time}</span>
                <OnlineServiceNote service={s} className="text-white/80" />
              </li>
            ))}
          </ul>
          <Link
            href="/calendar"
            className="whitespace-nowrap text-sm font-semibold underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
          >
            Church calendar →
          </Link>
        </div>
      </Container>
    </section>
  );
}
