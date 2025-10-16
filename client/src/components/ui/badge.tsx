import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1" +
  " hover-elevate " ,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:shadow",
        secondary: "border-transparent bg-secondary text-secondary-foreground shadow-xs hover:shadow-sm",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:shadow",
        success:
          "border-transparent bg-chart-2 text-white shadow-sm hover:shadow",
        warning:
          "border-transparent bg-chart-3 text-white shadow-sm hover:shadow",
        outline: " border [border-color:var(--badge-outline)] shadow-xs hover:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }
