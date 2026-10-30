import type { ContactTopic } from "@/lib/types/database";

// Contact form rules, shared by the form (input limits) and its Server Action.
// Mirrors the checks in supabase/migrations/20261030000200_contact_messages.sql.

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  message: 5000,
} as const;

export const CONTACT_TOPICS: { value: ContactTopic; label: string }[] = [
  { value: "general", label: "General question" },
  { value: "prayer", label: "Prayer request" },
  { value: "visit", label: "Planning a visit" },
];

export function isContactTopic(value: unknown): value is ContactTopic {
  return CONTACT_TOPICS.some((t) => t.value === value);
}

export function contactTopicLabel(topic: ContactTopic) {
  return CONTACT_TOPICS.find((t) => t.value === topic)?.label ?? topic;
}
