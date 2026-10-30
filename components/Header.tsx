"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import FacebookLink from "@/components/FacebookLink";
import SpotifyLink from "@/components/SpotifyLink";
import YouTubeLink from "@/components/YouTubeLink";
import BrandStripe from "@/components/ui/BrandStripe";
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
          ? "bg-brand-primary shadow-lg shadow-black/20"
          : scrolled
            ? "bg-brand-primary/85 shadow-lg shadow-black/20 backdrop-blur-md"
            : "bg-brand-primary",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className="flex shrink-0 items-center rounded-full"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/rcm-logo.png"
            alt=""
            width={56}
            height={56}
            priority
            className="size-11 rounded-full ring-2 ring-white/10 transition-transform hover:scale-105 sm:size-14"
          />
        </Link>

        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative block px-3 py-2 text-sm font-semibold transition-colors hover:text-white lg:px-4 lg:text-[0.95rem]",
                    // Maroon underline marks the current page.
                    "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-brand-accent after:transition-transform lg:after:inset-x-4",
                    isActive(link.href) ? "text-white after:scale-x-100" : "text-white/70 after:scale-x-0 hover:after:scale-x-100",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          {/* Divider sets the social icons apart from the page links. */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:border-l md:border-white/15 md:pl-3">
            <SpotifyLink />
            <YouTubeLink />
            <FacebookLink />
          </div>
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
                    "block rounded-md border-l-2 px-3 py-3 text-lg font-semibold hover:bg-white/5",
                    isActive(link.href) ? "border-brand-accent text-white" : "border-transparent text-white/75",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-white/10 px-1 pt-3">
              <ul className="space-y-1">
                {[
                  { label: "Listen on Spotify", link: <SpotifyLink /> },
                  { label: "Watch on YouTube", link: <YouTubeLink /> },
                  { label: "Follow on Facebook", link: <FacebookLink /> },
                ].map((social) => (
                  <li key={social.label} className="flex items-center gap-2">
                    {social.link}
                    <span className="text-sm text-white/80">{social.label}</span>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <BrandStripe />
    </header>
  );
}
