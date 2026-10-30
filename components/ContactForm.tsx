"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const inputClass =
  "mt-1 w-full rounded-md border border-brand-line bg-white px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent-soft";

// Submission is not wired up yet; messages will be stored in Supabase later.
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="rounded-md bg-success-soft p-4 text-success">
        Thank you! Online messages aren&apos;t connected yet — please reach us in person at a service for now.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor="name" className="font-medium">Name</label>
        <input id="name" name="name" type="text" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="font-medium">Email</label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="font-medium">Message</label>
        <textarea id="message" name="message" rows={5} required className={inputClass} />
      </div>
      <Button type="submit">Send Message</Button>
    </form>
  );
}
