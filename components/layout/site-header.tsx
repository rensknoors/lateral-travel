"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ContentContainer } from "@/components/layout/content-container";
import { cn } from "@/lib/utils";

const primaryNavigation = [
  { href: "/", label: "Stays" },
  { href: "/bookings", label: "Bookings" },
] as const;

const LogoMark = ({ accentColor }: { accentColor: string }) => (
  <svg viewBox="0 0 40 40" fill="none" aria-hidden className="size-5">
    <line
      x1="8"
      y1="20"
      x2="30"
      y2="20"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <polyline
      points="23,13.5 30.5,20 23,26.5"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8.5" cy="20" r="3.5" fill={accentColor} />
  </svg>
);

const SiteHeader = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 transition-[background-color,box-shadow,border-color] duration-250",
        isTransparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/70 bg-card/95 shadow-sm backdrop-blur-md",
      )}
    >
      <ContentContainer
        size="xl"
        className="flex h-full items-center justify-between gap-6"
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors",
              isTransparent ? "bg-white/18" : "bg-primary",
            )}
          >
            <LogoMark
              accentColor={isTransparent ? "rgba(239,98,48,0.85)" : "#EF6230"}
            />
          </div>
          <div>
            <div
              className={cn(
                "font-serif text-lg leading-none tracking-[-0.02em]",
                isTransparent ? "text-white" : "text-foreground",
              )}
            >
              Lateral
            </div>
            <div
              className={cn(
                "mt-0.5 text-[9px] font-medium tracking-[2.2px] uppercase",
                isTransparent ? "text-white/60" : "text-muted-foreground",
              )}
            >
              Travel
            </div>
          </div>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-1"
        >
          {primaryNavigation.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? isTransparent
                      ? "font-medium text-white"
                      : "bg-accent font-medium text-primary"
                    : isTransparent
                      ? "text-white/90 hover:text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </ContentContainer>
    </header>
  );
};

export { SiteHeader };
