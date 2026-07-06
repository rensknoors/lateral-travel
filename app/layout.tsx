import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lateral Travel",
    template: "%s | Lateral Travel",
  },
  description:
    "Curated remote-work stays with clear availability, transparent pricing and a fast booking flow.",
  applicationName: "Lateral Travel",
  openGraph: {
    title: "Lateral Travel",
    description:
      "Curated remote-work stays with clear availability, transparent pricing and a fast booking flow.",
    siteName: "Lateral Travel",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full motion-safe:scroll-smooth">
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <a
          href="#main-content"
          className="absolute top-4 left-4 z-50 -translate-y-24 rounded-md bg-card px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground shadow-lg ring-1 ring-border transition-transform focus-visible:translate-y-0"
        >
          Skip to main content
        </a>
        <Providers>
          <SiteHeader />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
