import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";
import { Card, Heading, Notice } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.svg" alt="" width={56} height={56} priority />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-strong">
            {site.shortName}
          </p>
          <Heading level={1} size={2} className="mt-2">
            Admin sign in
          </Heading>
        </div>

        {isSupabaseConfigured ? (
          <Card>
            <LoginForm />
          </Card>
        ) : (
          <Notice tone="error" title="Supabase is not configured">
            Add the keys from .env.local.example to .env.local, then restart the dev server.
          </Notice>
        )}

        <p className="mt-8 text-center text-sm">
          <Link href="/" className="font-semibold text-brand-accent-strong underline-offset-4 hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
