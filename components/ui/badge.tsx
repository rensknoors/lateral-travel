import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-full border border-transparent leading-none font-medium tracking-[0.01em] whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        brand: "bg-accent text-accent-foreground",
        accent: "bg-brand-accent/15 text-brand-accent-hover",
        warm: "bg-warm text-warm-foreground",
        success: "bg-success/15 text-success",
        warning: "bg-warning/25 text-warning-foreground",
        error: "bg-destructive/10 text-destructive",
        outline: "border-border text-muted-foreground",
        inverse: "bg-foreground text-background",
      },
      size: {
        sm: "gap-1 px-[7px] py-[2px] text-xs",
        md: "gap-[5px] px-[9px] py-[3px] text-xs",
        lg: "gap-1.5 px-[11px] py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const dotSizes = {
  sm: "size-[5px]",
  md: "size-1.5",
  lg: "size-[7px]",
} as const

function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  children,
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { dot?: boolean }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
        children: (
          <>
            {dot && (
              <span
                aria-hidden
                className={cn(
                  "shrink-0 rounded-full bg-current",
                  dotSizes[size ?? "md"]
                )}
              />
            )}
            {children}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
