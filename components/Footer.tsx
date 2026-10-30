import Image from "next/image";
import Link from "next/link";
import SpotifyLink from "@/components/SpotifyLink";
import BrandStripe from "@/components/ui/BrandStripe";
import Container from "@/components/ui/Container";
import { navLinks, site } from "@/lib/site";

const headingClass = "text-xs font-bold uppercase tracking-[0.22em] text-brand-accent-light";

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white/70">
      <BrandStripe />
      <Container className="grid gap-12 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-4 text-white">
            <Image src="/rcm-logo.png" alt="" width={56} height={56} className="size-14 rounded-full" />
            <span className="max-w-[16rem] text-lg font-bold leading-snug">{site.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            A community of believers passionate about Jesus and people. You are welcome here.
          </p>
          <div className="mt-6 flex items-center gap-2 text-white">
            <SpotifyLink className="border border-white/15" />
            <span className="text-sm text-white/60">Listen on Spotify</span>
          </div>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className={headingClass}>Quick links</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className={headingClass}>Service times</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {site.serviceTimes.map((s) => (
              <li key={s.day}>
                <span className="block font-semibold text-white">{s.day}</span>
                {s.time}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className={headingClass}>Contact</h2>
          <address className="mt-5 space-y-3 text-sm not-italic">
            <p>{site.contact.address}</p>
            <p>{site.contact.phone}</p>
            <p>{site.contact.email}</p>
          </address>
          <Link
            href="/contact"
            className="mt-5 inline-block text-sm font-semibold text-brand-accent-light transition-colors hover:text-white"
          >
            Get in touch →
          </Link>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-6 text-center text-xs text-white/50">
          <p>{site.copyright}</p>
        </Container>
      </div>
    </footer>
  );
}
