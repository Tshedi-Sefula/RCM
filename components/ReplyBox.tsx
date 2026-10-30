"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import Button from "@/components/ui/Button";
import { REPLY_MAX_LENGTH } from "@/lib/threads";

type ReplyBoxProps = {
  // Resolves to an error message, or undefined once the reply is saved.
  onSend: (message: string) => Promise<string | undefined>;
  placeholder?: string;
};

// Message input under a conversation. Ctrl/⌘ + Enter sends.
export default function ReplyBox({ onSend, placeholder = "Write a reply…" }: ReplyBoxProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function send() {
    const text = message.trim();
    if (!text || pending) return;
    setPending(true);
    setError(undefined);
    const failure = await onSend(text);
    setPending(false);
    if (failure) setError(failure);
    else setMessage("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void send();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-brand-line bg-white p-3 sm:p-4">
      <label htmlFor="reply" className="sr-only">
        Your message
      </label>
      <div className="flex items-end gap-2 sm:gap-3">
        <textarea
          id="reply"
          name="message"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={REPLY_MAX_LENGTH}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? "reply-error" : undefined}
          className="min-h-11 flex-1 resize-y rounded-lg border border-brand-line bg-white px-3.5 py-2.5 leading-relaxed transition focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
        />
        <Button type="submit" disabled={pending || !message.trim()} className="shrink-0">
          {pending ? "Sending…" : "Send"}
        </Button>
      </div>
      {error && (
        <p id="reply-error" role="alert" className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </form>
  );
}
