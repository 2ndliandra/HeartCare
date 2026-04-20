// @ts-nocheck
import * as React from "react"
import { Badge } from "~/components/ui/badge"

export type RiskLevel = "RENDAH" | "SEDANG" | "TINGGI" | "INFO" | "NEUTRAL"

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
  size?: "sm" | "default" | "lg"
}

export function RiskBadge({ level, className, size = "default" }: RiskBadgeProps) {
  const getBadgeVariant = () => {
    switch (level) {
      case "RENDAH":
        return "success"
      case "SEDANG":
        return "warning"
      case "TINGGI":
        return "danger"
      case "INFO":
        return "info"
      default:
        return "neutral"
    }
  }

  const getLabel = () => {
    switch (level) {
      case "TINGGI":
      case "SEDANG":
        return "Perlu Perhatian Medis"
      case "RENDAH":
        return "Kondisi Terpantau Baik"
      case "INFO":
        return "Informasi Medis"
      default:
        return level.charAt(0) + level.slice(1).toLowerCase()
    }
  }

  return (
    <Badge variant={getBadgeVariant()} size={size} className={className}>
      {getLabel()}
    </Badge>
  )
}
