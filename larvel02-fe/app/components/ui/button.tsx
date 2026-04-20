import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 active:scale-[0.98] disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald-600 text-white shadow-sm rounded-xl hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none",
        secondary:
          "bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 hover:text-slate-900 disabled:bg-slate-50 disabled:text-slate-300",
        outline:
          "bg-transparent text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-50 hover:border-emerald-700 hover:text-emerald-700 disabled:border-slate-200 disabled:text-slate-300",
        ghost:
          "bg-transparent text-slate-700 rounded-xl hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        danger:
          "bg-red-600 text-white shadow-sm rounded-xl hover:bg-red-700 hover:shadow-md disabled:bg-red-200 disabled:text-red-400",
      },
      size: {
        default: "h-10 px-5 py-2.5 text-sm", // md
        sm: "h-9 px-4 py-2 text-sm",
        lg: "h-12 px-6 py-3 text-base",
        icon: "h-10 w-10 p-2.5 rounded-lg", // icon-only
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
