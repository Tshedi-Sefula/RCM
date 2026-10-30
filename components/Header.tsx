"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import SpotifyLink from "@/components/SpotifyLink";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { navLinks, site } from "@/lib/site";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const isScrolled = () => window.scrollY > 8;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, () => false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 text-white transition-[background-color,box-shadow] duration-300",
        open
          ? "bg-brand-primary shadow-lg shadow-black/10"
          : scrolled
            ? "bg-brand-primary/85 shadow-lg shadow-black/10 backdrop-blur-md"
            : "bg-brand-primary",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-18">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.svg" alt="" width={40} height={40} priority />
          <span className="font-display text-base font-semibold leading-tight sm:text-lg">
            <span className="hidden xl:inline">{site.name}</span>
            <span className="xl:hidden">{site.shortName}</span>
          </span>
        </Link>

        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-brand-accent lg:text-[0.95rem]",
                    isActive(link.href) ? "text-brand-accent" : "text-white/90",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <SpotifyLink />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full hover:bg-white/10 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {/* Slide-down panel: grid-rows animates height without measuring. */}
      <div
        id="mobile-nav"
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav aria-label="Mobile" className="overflow-hidden">
          <ul className="flex flex-col border-t border-white/10 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-lg font-medium hover:bg-white/5 hover:text-brand-accent",
                    isActive(link.href) && "text-brand-accent",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex items-center gap-2 border-t border-white/10 px-1 pt-3">
              <SpotifyLink />
              <span className="text-sm text-white/80">Listen on Spotify</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
