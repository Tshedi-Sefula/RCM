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
        <article className="rounded-lg border border-dashed border-brand-line p-6 sm:col-span-2">
          <h2 className="font-display text-xl font-semibold">Statement of Faith</h2>
          <p className="mt-2 text-brand-muted">[Insert beliefs and doctrine here]</p>
        </article>
      </section>
    </>
  );
}
