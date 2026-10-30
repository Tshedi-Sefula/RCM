import type { Metadata } from "next";
import Hero from "@/components/ui/Hero";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with RCM Toitskraal for questions, prayer requests or to find out how to join us.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Hero title="Get in Touch" subtitle="We’d love to hear from you" />
      <section className="mx-auto max-w-2xl px-4 py-16">
        <p className="mb-8 text-center text-brand-muted">
          Whether you have questions, need prayer, or want to join our community, we are here to connect with you.
        </p>
        <ContactForm />
      </section>
    </>
  );
}
