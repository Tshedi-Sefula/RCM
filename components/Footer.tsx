import Link from "next/link";
import SpotifyLink from "@/components/SpotifyLink";
import Container from "@/components/ui/Container";
import { navLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-xl font-semibold text-white">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            A community of believers passionate about Jesus and people. You are welcome here.
          </p>
          <div className="mt-5 flex items-center gap-1 text-white">
            <SpotifyLink className="-ml-2" />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">Visit</h2>
          <address className="mt-4 space-y-2 text-sm not-italic">
            <p>{site.contact.address}</p>
            <p>{site.contact.phone}</p>
            <p>{site.contact.email}</p>
          </address>
          <ul className="mt-4 space-y-1 text-sm">
            {site.serviceTimes.map((s) => (
              <li key={s.day}>
                <span className="text-white">{s.day}:</span> {s.time}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brand-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-6 text-center text-xs text-white/60 sm:text-left">
          <p>{site.copyright}</p>
        </Container>
      </div>
    </footer>
  );
}
