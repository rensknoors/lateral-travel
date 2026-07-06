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
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
