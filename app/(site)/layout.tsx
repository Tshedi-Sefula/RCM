import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Public pages get the site header and footer; /admin has its own shell.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
