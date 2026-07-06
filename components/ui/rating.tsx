import { useId } from "react"

import { formatCompactCount } from "@/lib/format"
import { cn } from "@/lib/utils"

const STAR_PATH = "M12 2l2.9 7H22l-5.9 4.3L18.2 21 12 17l-6.2 4 2.1-7.7L2 9h7.1L12 2z"

const starSizes = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
} as const

const textSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const

interface RatingProps {
  /** Numeric rating value (0 – max) */
  value?: number
  /** Total number of stars rendered */
  max?: number
  /** Star size preset */
  size?: "sm" | "md" | "lg"
  /** Show numeric value next to stars */
  showValue?: boolean
  /** Review count displayed in parentheses */
  count?: number
  className?: string
}

function Rating({
  value = 0,
  max = 5,
  size = "md",
  showValue = false,
  count,
  className,
}: RatingProps) {
  const gradientId = useId()

  return (
    <div
      data-slot="rating"
      className={cn("inline-flex items-center gap-1", className)}
    >
      <span className="sr-only">
        {`Rated ${value.toFixed(1)} out of ${max}${
          count !== undefined ? `, ${count} reviews` : ""
        }`}
      </span>
      <div aria-hidden className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const fillPercent = Math.round(
            Math.min(1, Math.max(0, value - index)) * 100
          )
          const starId = `${gradientId}-${index}`

          return (
            <svg
              key={index}
              viewBox="0 0 24 24"
              fill="none"
              className={cn("shrink-0", starSizes[size])}
            >
              <defs>
                <linearGradient id={starId} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${fillPercent}%`} stopColor="var(--gold)" />
                  <stop offset={`${fillPercent}%`} stopColor="var(--border)" />
                </linearGradient>
              </defs>
              <path
                d={STAR_PATH}
                fill={`url(#${starId})`}
                stroke={fillPercent > 0 ? "var(--gold)" : "var(--border)"}
                strokeWidth="0.4"
              />
            </svg>
          )
        })}
      </div>
      {showValue && (
        <span
          aria-hidden
          className={cn("font-semibold text-foreground", textSizes[size])}
        >
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span aria-hidden className={cn("text-muted-foreground", textSizes[size])}>
          ({formatCompactCount(count)})
        </span>
      )}
    </div>
  )
}

export { Rating }
