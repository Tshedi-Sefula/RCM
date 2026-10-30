import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import StreamEmbed from "@/components/StreamEmbed";
import { Button, Card, Eyebrow, Heading, Hero, Notice, Reveal, Section } from "@/components/ui";
import { getLatestStream } from "@/lib/data/public";
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

export default function Home() {
  return (
    <>
      <Hero
        size="lg"
        eyebrow={site.shortName}
        title="Welcome Home"
        subtitle="We are a community of believers passionate about Jesus and people."
        image="/images/hero.jpg"
        actions={
          <>
            <Button href="/calendar" size="lg">
              Plan a Visit
            </Button>
            <Button href="/beliefs" size="lg" variant="secondary" tone="inverse">
              Learn More
            </Button>
          </>
        }
      />

      <Section tone="surface" containerWidth="narrow" className="text-center">
        <Reveal>
          <Eyebrow>Our Mission</Eyebrow>
          <Heading level={2}>A Christ-centered community for everyone</Heading>
          <p className="mt-6 text-lg text-brand-muted">
            To build a Christ-centered community where everyone feels welcome and empowered to grow in faith.
          </p>
        </Reveal>
      </Section>

      <Section tone="white" containerWidth="narrow">
        <Reveal className="text-center">
          <Eyebrow>Get to know us</Eyebrow>
          <Heading level={2}>{site.introVideo.title}</Heading>
        </Reveal>
        <StreamEmbed
          platform="youtube"
          source={site.introVideo.youtubeId}
          title={site.introVideo.title}
          className="mt-10"
        />
      </Section>

      <Section tone="cream">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>Join Us</Eyebrow>
            <Heading level={2}>Service Times</Heading>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {site.serviceTimes.map((s, i) => (
              <li key={s.day}>
                <Reveal delay={i * 100}>
                  <Card interactive>
                    <Heading level={3}>{s.day}</Heading>
                    <p className="mt-2 text-brand-muted">{s.time}</p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>
          <Link
            href="/calendar"
            className="mt-10 inline-block font-semibold text-brand-accent-strong underline-offset-4 hover:underline"
          >
            View the church calendar →
          </Link>
        </div>
      </Section>

      <Section tone="surface" containerWidth="narrow">
        <div className="text-center">
          <Eyebrow>Watch</Eyebrow>
          <Heading level={2}>Latest Stream</Heading>
        </div>
        <Suspense fallback={<div className="mt-10 aspect-video animate-pulse rounded-2xl bg-brand-cream" aria-hidden />}>
          <LatestStream />
        </Suspense>
      </Section>
    </>
  );
}

async function LatestStream() {
  const { data: stream, error } = await getLatestStream();

  if (error !== null) {
    return (
      <Notice tone="error" title="We couldn't load the latest stream" className="mt-10">
        Please try again in a little while.
      </Notice>
    );
  }
  if (!stream) {
    return (
      <Notice title="No streams yet" className="mt-10">
        Recordings of our services will appear here.
      </Notice>
    );
  }

  return (
    <div className="mt-10">
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
