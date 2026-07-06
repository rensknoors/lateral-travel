import Link from "next/link";

import { ContentContainer } from "@/components/layout/content-container";

const SiteFooter = () => (
  <footer className="mt-auto bg-[#0f1720] text-[#98aebc]">
    <ContentContainer size="xl" className="py-12 pb-8">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <svg
            width="20"
            height="20"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden
          >
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
            <circle cx="8.5" cy="20" r="3.5" fill="#EF6230" />
          </svg>
        </div>
        <div>
          <div className="font-serif text-lg leading-none text-white">
            Lateral
          </div>
          <div className="mt-0.5 text-[9px] font-medium tracking-[2.5px] text-[#54717f] uppercase">
            Travel
          </div>
        </div>
      </div>

      <p className="mb-8 max-w-[300px] text-sm leading-[1.65]">
        Find extraordinary places to stay, handpicked for curious travelers who
        want more than just a bed.
      </p>

      <div className="flex flex-col gap-3 border-t border-[#1b2832] pt-6 text-xs sm:flex-row sm:justify-between">
        <span>© 2026 Lateral Travel, Inc. · All rights reserved</span>
        <span className="flex gap-3">
          <Link href="#" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <span aria-hidden>·</span>
          <Link href="#" className="transition-colors hover:text-white">
            Terms
          </Link>
          <span aria-hidden>·</span>
          <Link href="#" className="transition-colors hover:text-white">
            Sitemap
          </Link>
        </span>
      </div>
    </ContentContainer>
  </footer>
);

export { SiteFooter };
