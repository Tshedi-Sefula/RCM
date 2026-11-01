import type { Metadata } from "next";
import { Button, Eyebrow, Heading, Hero, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Our purpose, functions, vision, mission and dreams at Restoration Center Ministries Toitskraal.",
  alternates: { canonical: "/about" },
};

const dreams = [
  {
    title: "Environments for the Hurting",
    scripture: "Revelation 22:17; John 13:34–35; Matthew 9:35–38",
    body: "Creating environments where the hurting, the stressed, the weary, the depressed, the lonely, the frustrated, and the confused can find love, acceptance, help, hope, forgiveness, guidance, and encouragement.",
  },
  {
    title: "Sharing the Good News in Nellmapius & Beyond",
    scripture: "Matthew 28:18–20; Acts 4:32",
    body: "Sharing the Good News of Jesus Christ with the residents of Nellmapius, believing that God will use us as a catalyst for spiritual renewal in Nellmapius and beyond.",
  },
  {
    title: "Developing the Total Person",
    scripture: "Luke 4:18–19",
    body: "Developing the total person—physically, mentally, emotionally, spiritually, and relationally—through the teaching and training of the Word of God, including Bible studies, Restoration groups, seminars, workshops, retreats, and conferences.",
  },
  {
    title: "Equipping People for God-Given Roles",
    scripture: "Ephesians 4:1–3",
    body: "Equipping people to understand the significance of their God-given roles in relationships as Husband, Wife, Father, Mother, Son, Daughter, friend, neighbor, co-worker, church member, and citizen, and giving the Biblical knowledge and practical application needed to fulfill these responsibilities to the glory of God.",
  },
  {
    title: "Biblical Principles for Marriages",
    scripture: "Galatians 6:2; Acts 16:31–32",
    body: 'Providing Biblical principles and spiritual counsel to thousands of marriages as instruments of grace and reconciliation—starting a "Marital Revolution" through personality studies, communication skills, financial management, child development skills, harmony in blended families, unity in the home, and divorce recovery for adults and children.',
  },
  {
    title: "Ministering Healing & New Life",
    scripture: "Matthew 11:28–30; John 10:10; 1 John 4:4; John 8:34–36",
    body: 'Ministering healing, in the name of Jesus Christ, to those in crisis, addictions, afflictions, abuse, and depression—believing that Jesus Christ brings new life to the weary and heavy-hearted and provides hope for the future.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About Us"
        subtitle="Restoring lives, Broken marriages, Families and Futures."
        image="/images/about-hero.jpg"
      />

      <Section tone="white">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          <article className="rounded-2xl border border-brand-line bg-brand-cream p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-brand-primary">Our Vision</h2>
            <p className="mt-2 text-brand-ink">Restoring lives, Broken marriages, Families and Futures.</p>
          </article>
          <article className="rounded-2xl border border-brand-line bg-brand-cream p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-brand-primary">Our Mission</h2>
            <p className="mt-2 text-brand-ink">Heal the PAST ~ Live the PRESENT ~ Dream the FUTURE.</p>
          </article>
          <article className="rounded-2xl border border-brand-line bg-brand-cream p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-brand-primary">Core Scripture</h2>
            <p className="mt-2 italic text-brand-ink">
              Expecting the Unexpected because of Luke 1:37, &lsquo;For with God, nothing will be impossible.&rsquo;
            </p>
          </article>
        </div>

        <article className="prose prose-lg prose-stone mx-auto mt-16 max-w-4xl prose-headings:font-display prose-headings:font-semibold prose-h2:text-brand-primary">
          <h2>Purpose &amp; Functions</h2>

          <h3>Our Purpose</h3>
          <p>
            The primary purpose of {site.name} is to call one another to visible unity in one faith, fellowship
            expressed in worship and common life in Christ, through witness and service to the world, and to advance
            towards unity in order that the world may believe in Salvation and Eternal life.
          </p>

          <h3>Our Functions</h3>
          <ul>
            <li>
              Promote prayerful search for forgiveness of sins, reconciliation in a spirit of mutual accountability, the
              development of deeper relationships through theological dialogue, and the sharing of human, spiritual, and
              material resources with one another.
            </li>
            <li>
              Facilitate a common goal in each place or all places and support each other in our work for mission and
              evangelism.
            </li>
          </ul>
        </article>
      </Section>

      <Section tone="cream">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Our Heart</Eyebrow>
          <Heading level={2}>Our Dreams</Heading>
          <p className="mt-4 text-lg text-brand-muted">
            We operate in faith with great confidence of expecting the unexpected because with God, nothing will be
            impossible.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dreams.map((dream) => (
            <article key={dream.title} className="flex flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-card">
              <h3 className="font-display text-xl font-semibold text-brand-primary">{dream.title}</h3>
              <p className="mt-3 flex-1 text-brand-muted">{dream.body}</p>
              <p className="mt-4 border-t border-brand-line pt-3 text-xs font-semibold uppercase tracking-wider text-brand-accent">
                {dream.scripture}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button href="/beliefs">Read Our Articles of Faith</Button>
          <Button href="/contact" variant="secondary">
            Get in Touch
          </Button>
        </div>
      </Section>
    </>
  );
}
