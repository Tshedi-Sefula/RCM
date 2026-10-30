import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Placeholder: admin features (auth, event and gallery management) come later.
export default function AdminPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Admin</h1>
      <p className="mt-4 text-brand-muted">Coming soon.</p>
    </section>
  );
}
