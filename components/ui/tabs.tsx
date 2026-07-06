"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva("group/tabs-list flex w-fit items-center", {
  variants: {
    variant: {
      underline: "gap-4 border-b border-border",
      filled: "gap-1 rounded-md bg-muted p-1",
      pill: "flex-wrap gap-2",
    },
    size: {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "underline",
    size: "md",
  },
})

function TabsList({
  className,
  variant = "underline",
  size = "md",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-size={size}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        // underline — quiet tab with a 2px primary underline when selected
        "group-data-[variant=underline]/tabs-list:-mb-px group-data-[variant=underline]/tabs-list:border-b-2 group-data-[variant=underline]/tabs-list:border-transparent group-data-[variant=underline]/tabs-list:pb-2 group-data-[variant=underline]/tabs-list:aria-selected:border-primary group-data-[variant=underline]/tabs-list:aria-selected:text-primary",
        // filled — segmented control, selected tab pops on a raised card
        "group-data-[variant=filled]/tabs-list:rounded-md group-data-[variant=filled]/tabs-list:px-3 group-data-[variant=filled]/tabs-list:py-1.5 group-data-[variant=filled]/tabs-list:aria-selected:bg-card group-data-[variant=filled]/tabs-list:aria-selected:text-foreground group-data-[variant=filled]/tabs-list:aria-selected:shadow-xs",
        // pill — bordered chips, selected chip becomes solid ocean
        "group-data-[variant=pill]/tabs-list:rounded-full group-data-[variant=pill]/tabs-list:border group-data-[variant=pill]/tabs-list:border-border group-data-[variant=pill]/tabs-list:bg-background group-data-[variant=pill]/tabs-list:px-3.5 group-data-[variant=pill]/tabs-list:py-1.5 group-data-[variant=pill]/tabs-list:aria-selected:border-primary group-data-[variant=pill]/tabs-list:aria-selected:bg-primary group-data-[variant=pill]/tabs-list:aria-selected:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsPanel }
