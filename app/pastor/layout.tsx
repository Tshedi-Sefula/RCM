import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Pastor", template: "%s | Pastor" },
  robots: { index: false, follow: false },
};

// Pages add the dashboard chrome with <PastorLayout>; the login page has none.
export default function PastorRootLayout({ children }: LayoutProps<"/pastor">) {
  return children;
}
