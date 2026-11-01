import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import ServiceBar from "@/components/ServiceBar";
import StreamEmbed from "@/components/StreamEmbed";
import { BrandStripe, Button, Card, Container, Eyebrow, Heading, Notice, Reveal, Section } from "@/components/ui";
import { getGalleryImages, getLatestStream } from "@/lib/data/public";
import { isOptimizableImage } from "@/lib/media";
import { ministries } from "@/lib/ministries";
import { site } from "@/lib/site";

const streamDateFormat = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: site.timeZone,
});

const homeTitle = `Welcome to ${site.name}`;

export const metadata: Metadata = {
  // The root layout's default title, without the "| RCM Toitskraal" suffix.
  title: { absolute: homeTitle },
  description: site.description,
  alternates: { canonical: "/" },
  // openGraph replaces the layout's object rather than merging, so repeat its fields.
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: site.name,
    title: homeTitle,
    description: site.description,
    url: "/",
    images: [{ url: "/images/hero.jpg", alt: `${site.name} congregation` }],
  },
  twitter: {
    title: homeTitle,
    description: site.description,
    images: ["/images/hero.jpg"],
  },
};

const values = ["Restoration", "Worship", "The Word", "Prayer", "Fellowship", "Outreach", "Discipleship"];

// Shown in the gallery preview until photos are uploaded in the admin.
const fallbackGallery = [
  { id: "hero", src: "/images/hero.jpg", alt: "The congregation gathered for a Sunday service" },
  { id: "img1", src: "/images/img1.jpg", alt: "Children holding Restoration Kids banners" },
  { id: "img2", src: "/images/img2.jpg", alt: "A member worshipping during the service" },
  { id: "img3", src: "/images/img3.jpg", alt: "A speaker sharing the Word from the pulpit" },
  { id: "outreach", src: "/images/videos-hero.jpg", alt: "Families at a children's outreach day" },
];

export default function Home() {
  return (
    <>
      <HomeHero />
      <ServiceBar />
      <ValuesMarquee />

      <Section tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Who we are</Eyebrow>
            <Heading level={2}>Restoring lives, Broken marriages, Families and Futures.</Heading>
            <div className="mt-6 space-y-4 text-lg text-brand-muted">
              <p>
                <strong className="font-semibold text-brand-ink">Vision:</strong> Restoring lives, Broken marriages,
                Families and Futures.
              </p>
              <p>
                <strong className="font-semibold text-brand-ink">Mission:</strong> Heal the PAST ~ Live the PRESENT ~
                Dream the FUTURE.
              </p>
              <blockquote className="rounded-lg border-l-4 border-brand-accent bg-brand-cream px-4 py-3 text-base italic text-brand-ink">
                Expecting the Unexpected because of Luke 1:37, &lsquo;For with God, nothing will be impossible.&rsquo;
              </blockquote>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/about">About Us</Button>
              <Button href="/beliefs" variant="secondary">
                What we believe
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <StreamEmbed platform="youtube" source={site.introVideo.youtubeId} title={site.introVideo.title} />
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeader eyebrow="Fellowships" title="Our Fellowships">
          There is a place for every age and season of life. Find your people and grow together.
        </SectionHeader>
        {/* Flex rather than grid so a short last row stays centred. */}
        <ul className="mt-14 flex flex-wrap justify-center gap-6">
          {ministries.map((m, i) => (
            <li key={m.slug} className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
              <Reveal delay={i * 80} className="h-full">
                {/* The whole card is the link, so "Learn more" below is a styled span, not a nested link. */}
                <Link
                  href={`/ministries/${m.slug}`}
                  className="group block h-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
                >
                  <Card interactive padded={false} className="flex h-full flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream">
                      {m.coverImage ? (
                        <Image
                          src={m.coverImage}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
                        />
                      ) : (
                        <FellowshipPlaceholder title={m.title} />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <Heading level={3} size={4} className="text-xl">
                        {m.title}
                      </Heading>
                      <p className="mt-3 text-[0.95rem] text-brand-muted">{m.description}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold uppercase tracking-wider text-brand-accent transition-colors group-hover:text-brand-accent-strong">
                        Learn more
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </Card>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <PrayerBanner />

      <Section tone="white">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow="Recent gallery" title="Moments from our services" align="left" />
          <Button href="/gallery" variant="secondary" className="shrink-0 self-start sm:self-auto">
            View gallery
          </Button>
        </div>
        <Suspense fallback={<GalleryPreviewSkeleton />}>
          <GalleryPreview />
        </Suspense>
      </Section>

      <Section tone="cream" containerWidth="narrow">
        <SectionHeader eyebrow="Watch" title="Latest Stream" />
        <Suspense fallback={<div className="mt-12 aspect-video animate-pulse rounded-lg bg-brand-line" aria-hidden />}>
          <LatestStream />
        </Suspense>
      </Section>
    </>
  );
}

function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-brand-primary py-24 text-white sm:min-h-[calc(100svh-5rem)]">
      <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(15_15_17/0.72),rgb(15_15_17/0.94)_75%)]"
      />

      <Container className="text-center">
        <Reveal>
          <Image
            src="/rcm-logo.png"
            alt=""
            width={96}
            height={96}
            priority
            className="mx-auto size-20 rounded-full shadow-lg shadow-black/40 ring-4 ring-white/10 sm:size-24"
          />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-brand-accent-light sm:text-sm">
            {site.name}
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl">
            Welcome <span className="text-brand-accent-light">Home</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            We are a community of believers passionate about Jesus and people. Come as you are.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/calendar" size="lg">
              Plan a Visit
            </Button>
            <Button href="/beliefs" size="lg" variant="secondary" tone="inverse">
              Learn More
            </Button>
          </div>
        </Reveal>
      </Container>

      <a
        href="#service-times"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-white/60 transition-colors hover:text-white sm:block"
        aria-label="Scroll to service times"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className="animate-bounce motion-reduce:animate-none">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}

function ValuesMarquee() {
  // The list is rendered twice so the -50% scroll loops seamlessly.
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {values.map((v) => (
        <li key={v} className="flex items-center whitespace-nowrap px-6 text-sm font-extrabold uppercase tracking-[0.25em] text-brand-ink/80 sm:px-8 sm:text-base">
          {v}
          <span aria-hidden className="ml-12 size-1.5 rotate-45 bg-brand-accent sm:ml-16" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-b border-brand-line bg-white py-5">
      <div className="marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

// Stand-in for a fellowship card photo, in the same dark-and-maroon look as
// the prayer banner. Replace by giving the fellowship an image in lib/site.ts.
function FellowshipPlaceholder({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-primary text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(142_27_32/0.55),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgb(30_58_110/0.45),transparent_55%)] transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
      />
      {/* Group of people */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative size-14 text-brand-accent-light"
      >
        <circle cx="12" cy="7" r="3" />
        <path d="M6.5 20v-1.5a5.5 5.5 0 0 1 11 0V20" />
        <circle cx="5" cy="9.5" r="2" />
        <path d="M1.5 19v-.8A3.5 3.5 0 0 1 6 14.9" />
        <circle cx="19" cy="9.5" r="2" />
        <path d="M22.5 19v-.8a3.5 3.5 0 0 0-4.5-3.3" />
      </svg>
      <span className="relative text-sm font-bold uppercase tracking-[0.22em] text-white/80">{title}</span>
    </div>
  );
}

function PrayerBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-primary py-24 text-white sm:py-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgb(142_27_32/0.45),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(30_58_110/0.35),transparent_50%)]"
      />
      <Container width="narrow" className="text-center">
        <Reveal>
          <Eyebrow className="text-brand-accent-light">Need prayer?</Eyebrow>
          <Heading level={2} className="text-white">
            Do you need prayer? We&apos;ll pray for you.
          </Heading>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Whatever you are facing, you don&apos;t have to face it alone. Send us your request and our prayer team will
            stand with you.
          </p>
          <Button href="/contact?topic=prayer" size="lg" className="mt-10 min-w-56">
            Request Prayer
          </Button>
        </Reveal>
      </Container>
      <BrandStripe className="absolute inset-x-0 bottom-0" />
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  children,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading level={2}>{title}</Heading>
      {children && <p className="mt-5 text-lg text-brand-muted">{children}</p>}
    </Reveal>
  );
}

async function GalleryPreview() {
  const { data } = await getGalleryImages();
  // Fall back to the bundled photos when there are none yet or the load failed;
  // the full gallery page shows the error.
  const images =
    data && data.length > 0
      ? data.slice(0, 5).map((img) => ({
          id: img.id,
          src: img.image_url,
          alt: img.caption ?? "Photo from a church gathering",
        }))
      : fallbackGallery;

  return (
    <ul className="mt-12 grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:gap-4 lg:grid-cols-4">
      {images.map((img, i) => (
        <li key={img.id} className={i === 0 ? "col-span-2 row-span-2" : undefined}>
          <Link href="/gallery" className="group relative block size-full overflow-hidden rounded-lg bg-brand-cream">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              unoptimized={!isOptimizableImage(img.src)}
              sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
              className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
            <span aria-hidden className="absolute inset-0 bg-brand-primary/0 transition-colors group-hover:bg-brand-primary/20" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function GalleryPreviewSkeleton() {
  return (
    <div className="mt-12 grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:gap-4 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={`animate-pulse rounded-lg bg-brand-cream ${i === 0 ? "col-span-2 row-span-2" : ""}`} />
      ))}
    </div>
  );
}

async function LatestStream() {
  const { data: stream, error } = await getLatestStream();

  if (error !== null) {
    return (
      <Notice tone="error" title="We couldn't load the latest stream" className="mt-12">
        Please try again in a little while.
      </Notice>
    );
  }
  if (!stream) {
    return (
      <Notice title="No streams yet" className="mt-12">
        Recordings of our services will appear here.
      </Notice>
    );
  }

  return (
    <div className="mt-12">
      <StreamEmbed platform={stream.platform} source={stream.video_id_or_url} title={stream.title} />
      <p className="mt-4 text-center">
        <span className="font-semibold">{stream.title}</span>
        {stream.stream_date && (
          <span className="text-brand-muted">
            {" · "}
            {/* `date` columns have no time; read at UTC midnight so the day doesn't shift. */}
            <time dateTime={stream.stream_date}>
              {streamDateFormat.format(new Date(`${stream.stream_date}T00:00:00Z`))}
            </time>
          </span>
        )}
      </p>
    </div>
  );
}
