import Link from "next/link";
import { Button, Card, Eyebrow, Heading, Hero, Reveal, Section } from "@/components/ui";
import { site } from "@/lib/site";

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
    </>
  );
}
