import Image from "next/image";
import Link from "next/link";
import FacebookLink from "@/components/FacebookLink";
import OnlineServiceNote from "@/components/OnlineServiceNote";
import SpotifyLink from "@/components/SpotifyLink";
import YouTubeLink from "@/components/YouTubeLink";
import BrandStripe from "@/components/ui/BrandStripe";
import Container from "@/components/ui/Container";
import { navLinks, site } from "@/lib/site";

const socialRing = "border border-white/15";

const socialLinks = [
  { label: "Listen on Spotify", link: <SpotifyLink className={socialRing} /> },
  { label: "Watch on YouTube", link: <YouTubeLink className={socialRing} /> },
  { label: "Follow on Facebook", link: <FacebookLink className={socialRing} /> },
];

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
          <ul className="mt-6 space-y-3 text-white">
            {socialLinks.map((social) => (
              <li key={social.label} className="flex items-center gap-2">
                {social.link}
                <span className="text-sm text-white/60">{social.label}</span>
              </li>
            ))}
          </ul>
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
                <span className="block font-semibold text-white">
                  {s.day}
                  {s.group && ` (${s.group})`}
                </span>
                <span className="block">{s.time}</span>
                <OnlineServiceNote service={s} className="text-white/55" />
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className={headingClass}>Contact</h2>
          <address className="mt-5 space-y-3 text-sm not-italic">
            <p>{site.contact.address}</p>
            <p>
              <a href={`tel:${site.contact.phone}`} className="transition-colors hover:text-white">
                {site.contact.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-white">
                {site.contact.email}
              </a>
            </p>
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
        <Container className="flex flex-col items-center gap-3 py-6 text-center text-xs text-white/50 sm:flex-row sm:justify-between sm:text-left">
          <p>{site.copyright}</p>
          <Link
            href="/login"
            rel="nofollow"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white focus-visible:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                clipRule="evenodd"
              />
            </svg>
            Pastor &amp; staff login
          </Link>
        </Container>
      </div>
    </footer>
  );
}
