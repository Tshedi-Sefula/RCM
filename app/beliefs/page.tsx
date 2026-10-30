import type { Metadata } from "next";
import Hero from "@/components/ui/Hero";

export const metadata: Metadata = { title: "Our Beliefs" };

const sections = [
  {
    title: "Our Vision",
    body: "To impact lives and build a Christ-centered community where everyone feels welcome and empowered to grow in faith.",
  },
  {
    title: "Our Mission",
    body: "We strive to provide a nurturing environment for spiritual growth, meaningful relationships, and community outreach.",
  },
  {
    title: "Leadership",
    body: "Pastor VVM Mashele, along with a dedicated team of elders and ministry leaders, guides our church family.",
  },
  {
    title: "History",
    body: "Founded in 2024, RCM Toitskraal has been committed to serving the community of Toitskraal and Siyabuswa through worship, teaching, and outreach programs.",
  },
];

// Statement of faith. Placeholder wording: edit the titles and paragraphs
// freely; add or remove entries and the page updates. Each string in
// `paragraphs` is one paragraph.
const beliefs = [
  {
    title: "The Scriptures",
    paragraphs: ["We believe the Bible is the inspired Word of God, our final authority for faith and life. [Edit this paragraph.]"],
  },
  {
    title: "God",
    paragraphs: ["We believe in one God, eternally existing in three persons: Father, Son and Holy Spirit. [Edit this paragraph.]"],
  },
  {
    title: "Jesus Christ",
    paragraphs: ["We believe Jesus Christ is the Son of God, who lived a sinless life, died for our sins, rose from the dead and will return. [Edit this paragraph.]"],
  },
  {
    title: "The Holy Spirit",
    paragraphs: ["We believe the Holy Spirit lives in every believer, empowering us to live a godly life and to serve others. [Edit this paragraph.]"],
  },
  {
    title: "Salvation",
    paragraphs: ["We believe salvation is a gift of God's grace, received through faith in Jesus Christ. [Edit this paragraph.]"],
  },
  {
    title: "The Church",
    paragraphs: ["We believe the church is the body of Christ, called to worship, grow together and share the gospel with our community. [Edit this paragraph.]"],
  },
];

export default function BeliefsPage() {
  return (
    <>
      <Hero title="Our Beliefs" image="/images/about-hero.jpg" />
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:grid-cols-2">
        {sections.map((s) => (
          <article key={s.title} className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-brand-muted">{s.body}</p>
          </article>
        ))}
      </section>

      <section className="bg-white py-16 sm:py-24">
        <article className="prose prose-lg prose-stone mx-auto px-4 prose-headings:font-display prose-headings:font-semibold prose-h2:text-brand-primary">
          <h2>Statement of Faith</h2>
          {beliefs.map((b) => (
            <section key={b.title}>
              <h3>{b.title}</h3>
              {b.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </section>
    </>
  );
}
