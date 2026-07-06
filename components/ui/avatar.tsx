import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-visible align-middle select-none",
  {
    variants: {
      size: {
        xs: "size-6 text-xs",
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-14 text-lg",
        xl: "size-18 text-xl",
      },
      shape: {
        circle: "[--avatar-radius:var(--radius-full,9999px)]",
        rounded: "[--avatar-radius:var(--radius-md)]",
        square: "[--avatar-radius:0px]",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  }
)

const statusColors = {
  online: "bg-success",
  busy: "bg-destructive",
  away: "bg-warning",
  offline: "bg-border",
} as const

const initialsFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")

interface AvatarProps
  extends AvatarPrimitive.Root.Props,
    VariantProps<typeof avatarVariants> {
  /** Photo URL — falls back to initials when absent */
  src?: string
  /** Full name — used for initials fallback and alt text */
  name?: string
  /** Presence / availability indicator dot */
  status?: keyof typeof statusColors
}

function Avatar({
  className,
  src,
  name,
  size = "md",
  shape = "circle",
  status,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={name ?? ""}
          className="size-full rounded-(--avatar-radius) object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className="flex size-full items-center justify-center rounded-(--avatar-radius) bg-accent font-medium text-accent-foreground"
      >
        {name ? initialsFromName(name) : null}
      </AvatarPrimitive.Fallback>
      {status && (
        <span
          data-slot="avatar-status"
          className={cn(
            "absolute right-0 bottom-0 size-1/4 min-w-2 rounded-full ring-2 ring-background",
            statusColors[status]
          )}
        >
          <span className="sr-only">{status}</span>
        </span>
      )}
    </AvatarPrimitive.Root>
  )
}

export { Avatar }
