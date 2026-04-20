import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2",
  {
    variants: {
      variant: {
        success: "bg-emerald-100 text-emerald-900",
        warning: "bg-amber-100 text-amber-900",
        danger: "bg-red-100 text-red-900",
        info: "bg-blue-100 text-blue-900",
        neutral: "bg-slate-100 text-slate-700",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  }
)

const dotVariants = cva("rounded-full flex-shrink-0", {
  variants: {
    variant: {
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
      info: "bg-blue-500",
      neutral: "bg-slate-500",
    },
    size: {
      sm: "w-1 h-1",
      default: "w-1.5 h-1.5",
      lg: "w-2 h-2",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "default",
  },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean
}

function Badge({ className, variant, size, showDot = true, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {showDot && <div className={cn(dotVariants({ variant, size }))} />}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
