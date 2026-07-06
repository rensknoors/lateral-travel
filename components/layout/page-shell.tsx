import type { ComponentProps, ReactNode } from "react";

import { ContentContainer } from "@/components/layout/content-container";
import { cn } from "@/lib/utils";

interface PageShellProps extends Omit<ComponentProps<"main">, "title"> {
  actions?: ReactNode;
  contentClassName?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
}

const PageShell = ({
  actions,
  children,
  className,
  contentClassName,
  description,
  eyebrow,
  title,
  ...props
}: PageShellProps) => (
  <main className={cn("flex-1 py-10 sm:py-14", className)} {...props}>
    {(eyebrow || title || description || actions) && (
      <ContentContainer className="mb-10">
        <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-primary uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-balance font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
        </div>
      </ContentContainer>
    )}

    <ContentContainer className={contentClassName}>{children}</ContentContainer>
  </main>
);

export { PageShell };
