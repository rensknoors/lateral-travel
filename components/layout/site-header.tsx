import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ContentContainer } from "@/components/layout/content-container";

const primaryNavigation = [
  { href: "/", label: "Browse stays" },
  { href: "/bookings", label: "Bookings" },
] as const;

const SiteHeader = () => (
  <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
    <ContentContainer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
      <Link
        href="/"
        className="group flex items-center gap-3 font-serif text-xl tracking-tight text-foreground"
      >
        <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-sans font-semibold text-primary-foreground shadow-[0_10px_30px_rgb(var(--shadow-color)/0.14)] transition-transform group-hover:-translate-y-0.5">
          LT
        </span>
        <span>Lateral Travel</span>
      </Link>

      <nav
        aria-label="Primary navigation"
        className="order-last flex basis-full items-center gap-5 border-t border-border/70 pt-3 text-sm font-medium text-muted-foreground md:order-none md:basis-auto md:border-0 md:pt-0"
      >
        {primaryNavigation.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="transition-colors hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </nav>

      <Link
        href="/"
        className={buttonVariants({
          size: "sm",
          className: "hidden sm:inline-flex",
        })}
      >
        Find a stay
      </Link>
    </ContentContainer>
  </header>
);

export { SiteHeader };
