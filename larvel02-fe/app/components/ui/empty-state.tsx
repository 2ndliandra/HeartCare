// @ts-nocheck
import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-16 px-6 text-center max-w-sm mx-auto flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="mx-auto mb-6 text-slate-300">
        <Icon className="w-24 h-24" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2 font-display">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="default" onClick={onAction} className="mx-auto">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
