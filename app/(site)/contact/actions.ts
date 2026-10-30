"use server";

import { createClient } from "@supabase/supabase-js";
import type { ActionResult } from "@/lib/action-result";
import { CONTACT_LIMITS, isContactTopic } from "@/lib/contact";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import type { Database } from "@/lib/types/database";

// On success, the ticket for the sender's /threads/[ticket_id] link.
export type ContactResult = { ok: true; ticketId: string } | Exclude<ActionResult, { ok: true }>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits with optional +, spaces, dashes and brackets, e.g. "+27 82 123 4567".
const PHONE_PATTERN = /^\+?[\d\s()-]{5,30}$/;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// Opens a conversation from the public contact form. Visitors aren't signed
// in, so this uses a cookie-less anon client; RLS lets anyone insert but only
// admins and the assigned pastor read.
export async function submitContactMessage(formData: FormData): Promise<ContactResult> {
  // Honeypot: hidden from people, so only bots fill it. Pretend it worked
  // with a ticket that matches no thread.
  if (text(formData, "website")) return { ok: true, ticketId: crypto.randomUUID() };

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
  // The ticket is made here rather than by the column default because anon
  // can't read rows back, so .select() after the insert would fail.
  const ticketId = crypto.randomUUID();
  const { error } = await supabase.from("contact_threads").insert({
    ticket_id: ticketId,
    sender_name: name,
    sender_email: email || null,
    sender_phone: phone || null,
    topic,
    original_message: message,
  });

  if (error) {
    console.error("Couldn't save contact message:", error.message);
    return { ok: false, error: "Your message couldn't be sent. Please try again in a moment." };
  }
  return { ok: true, ticketId };
}
