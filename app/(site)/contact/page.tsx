import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm, { ContactFormWithTopic } from "@/components/ContactForm";
import OnlineServiceNote from "@/components/OnlineServiceNote";
import { Eyebrow, Heading, Hero, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with RCM Toitskraal for questions, prayer requests or to find out how to join us.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Hero title="Get in Touch" subtitle="We’d love to hear from you" />
      <Section tone="white">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <Eyebrow>Contact us</Eyebrow>
            <Heading level={2} size={3} className="text-3xl sm:text-4xl">
              Questions, prayer or planning a visit?
            </Heading>
            <p className="mt-5 text-lg text-brand-muted">
              Whether you have questions, need prayer, or want to join our community, we are here to connect with
              you. Send us a message and someone from the church will get back to you.
            </p>

            <dl className="mt-10 space-y-6 border-t border-brand-line pt-8">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">Visit us</dt>
                <dd className="mt-1.5">{site.contact.address}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">Service times</dt>
                {site.serviceTimes.map((s) => (
                  <dd key={s.day} className="mt-1.5">
                    <span className="font-semibold">
                      {s.day}
                      {s.group && ` (${s.group})`}:
                    </span>{" "}
                    {s.time}
                    <OnlineServiceNote service={s} className="ml-2 align-middle text-brand-muted" />
                  </dd>
                ))}
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">Call or email</dt>
                <dd className="mt-1.5">{site.contact.phone}</dd>
                <dd>{site.contact.email}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-brand-line bg-white p-6 shadow-card sm:p-10">
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithTopic />
            </Suspense>
          </div>
        </div>
      </Section>
    </>
  );
}
