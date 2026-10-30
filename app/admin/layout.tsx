import type { Metadata } from "next";

export const metadata: Metadata = {
  // Child segments (e.g. /admin/login) get "… | Admin"; a template does not
  // apply to this segment's own page, so app/admin/page.tsx sets a full title.
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

// Pages add the dashboard chrome with <AdminLayout>; the login page has none.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
