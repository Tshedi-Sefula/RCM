"use server";

import { createClient } from "@supabase/supabase-js";
import type { ActionResult } from "@/lib/action-result";
import { CONTACT_LIMITS, isContactTopic } from "@/lib/contact";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import type { Database } from "@/lib/types/database";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits with optional +, spaces, dashes and brackets, e.g. "+27 82 123 4567".
const PHONE_PATTERN = /^\+?[\d\s()-]{5,30}$/;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// Saves a message from the public contact form. Visitors aren't signed in, so
// this uses a cookie-less anon client; RLS lets anyone insert but only admins read.
export async function submitContactMessage(formData: FormData): Promise<ActionResult> {
  // Honeypot: hidden from people, so only bots fill it. Pretend it worked.
  if (text(formData, "website")) return { ok: true };

  const name = text(formData, "name");
  const email = text(formData, "email");
  const phone = text(formData, "phone");
  const message = text(formData, "message");
  const topic = formData.get("topic");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Enter your name.";
  else if (name.length > CONTACT_LIMITS.name) fieldErrors.name = "Keep your name under 100 characters.";
  if (email && (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email))) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (phone && !PHONE_PATTERN.test(phone)) fieldErrors.phone = "Enter a valid phone number.";
  if (!email && !phone) fieldErrors.email = "Enter an email address or phone number so we can reply.";
  if (!message) fieldErrors.message = "Enter your message.";
  else if (message.length > CONTACT_LIMITS.message) {
    fieldErrors.message = "Keep your message under 5,000 characters.";
  }
  if (!isContactTopic(topic)) fieldErrors.topic = "Choose what your message is about.";

  if (Object.keys(fieldErrors).length > 0 || !isContactTopic(topic)) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, error: "Messages can't be sent right now. Please try again later." };
  }

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createClient<Database>(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  // No .select(): anon can't read rows back, so asking for them would fail.
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email: email || null, phone: phone || null, topic, message });

  if (error) {
    console.error("Couldn't save contact message:", error.message);
    return { ok: false, error: "Your message couldn't be sent. Please try again in a moment." };
  }
  return { ok: true };
}
