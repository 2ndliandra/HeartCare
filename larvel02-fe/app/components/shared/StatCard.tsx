// @ts-nocheck
import * as React from "react"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"

import { cn } from "~/lib/utils"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon: LucideIcon
  iconContainerClass?: string
  iconClass?: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconContainerClass,
  iconClass,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        className
      )}
      {...props}
    >
      <div 
        className={cn(
          "w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4",
          iconContainerClass
        )}
      >
        <Icon className={cn("w-6 h-6 text-emerald-600", iconClass)} />
      </div>
      
      <h3 className="text-3xl font-bold text-slate-900 mt-2 font-display">
        {value}
      </h3>
      
      <p className="text-sm text-slate-500 mt-1">
        {title}
      </p>

      {trend && (
        <div className="flex items-center gap-1 mt-3">
          {trend.isPositive ? (
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-emerald-600" : "text-red-600"
            )}
          >
            {trend.value}
          </span>
        </div>
      )}
    </div>
  )
}
