"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/events", label: "Upcoming Events" },
  { href: "/admin/calendar", label: "Calendar Entries" },
  { href: "/admin/gallery", label: "Gallery Images" },
  { href: "/admin/streams", label: "Stream Videos" },
] as const;

// Horizontal scroller on small screens, vertical list in the md+ sidebar.
export default function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav aria-label="Admin">
      <ul className="-mx-1 flex gap-1 overflow-x-auto pb-1 md:mx-0 md:flex-col md:overflow-visible md:pb-0">
        {adminLinks.map((link) => (
          <li key={link.href} className="shrink-0">
            <Link
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-white/10 text-brand-accent"
                  : "text-white/85 hover:bg-white/5 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
