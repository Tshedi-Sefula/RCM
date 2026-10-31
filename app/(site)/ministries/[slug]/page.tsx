import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button, Eyebrow, Heading, Hero, Section } from "@/components/ui";
import { getMinistry, ministries } from "@/lib/ministries";

// Every ministry is prerendered at build time. With Cache Components on,
// `dynamicParams` isn't available, so unknown slugs reach the page and hit
// notFound() below.
export function generateStaticParams() {
  return ministries.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ministries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ministry = getMinistry(slug);
  if (!ministry) return {};

  const url = `/ministries/${ministry.slug}`;
  const images = ministry.coverImage ? [{ url: ministry.coverImage, alt: ministry.title }] : undefined;
  return {
    title: ministry.title,
    description: ministry.description,
    alternates: { canonical: url },
    openGraph: { title: ministry.title, description: ministry.description, url, images },
  };
}

export default async function MinistryPage({ params }: PageProps<"/ministries/[slug]">) {
  const { slug } = await params;
  const ministry = getMinistry(slug);
  if (!ministry) notFound();

  // Blank lines in fullDescription separate paragraphs.
  const paragraphs = ministry.fullDescription
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Hero eyebrow="Our Fellowships" title={ministry.title} image={ministry.coverImage ?? undefined} />

      <Section tone="white" containerWidth="narrow">
        <article className="prose prose-lg prose-stone mx-auto">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </Section>

      {ministry.gallery.length > 0 && (
        <Section tone="cream">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Gallery</Eyebrow>
            <Heading level={2}>Moments from {ministry.title}</Heading>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ministry.gallery.map((src, i) => (
              <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-surface shadow-card">
                <Image
                  src={src}
                  alt={`${ministry.title} photo ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105 motion-reduce:transition-none"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="primary" spacing="sm">
        <div className="mx-auto max-w-2xl text-center">
          <Heading level={2} className="text-white">
            Get involved
          </Heading>
          <p className="mt-5 text-lg text-white/80">
            Want to join {ministry.title} or find out more? We&apos;d love to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" tone="inverse" size="lg">
              Contact us
            </Button>
            <Button href="/" variant="secondary" tone="inverse" size="lg">
              Back to home
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
