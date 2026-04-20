import * as React from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"

import { useToast, type ToastProps } from "~/hooks/useToast"
import { cn } from "~/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[60] flex max-w-md flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastProps; onDismiss: () => void }) {
  const [isShowing, setIsShowing] = React.useState(false)

  React.useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsShowing(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const variantStyles = {
    success: "border-l-4 border-l-emerald-500",
    error: "border-l-4 border-l-red-500",
    warning: "border-l-4 border-l-amber-500",
    info: "border-l-4 border-l-blue-500",
    default: "border border-slate-200",
  }

  const IconComponent = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />,
    error: <XCircle className="w-5 h-5 text-red-500 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />,
    info: <Info className="w-5 h-5 text-blue-500 mt-0.5" />,
    default: null,
  }[toast.variant || "default"]

  return (
    <div
      className={cn(
        "relative flex w-full items-start gap-3 rounded-xl bg-white p-4 shadow-lg border border-slate-200 pointer-events-auto transition-all duration-300",
        variantStyles[toast.variant || "default"],
        isShowing ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      {IconComponent}
      <div className="flex-1 flex flex-col pt-0.5">
        <h4 className="text-sm font-semibold text-slate-900 mb-1">{toast.title}</h4>
        {toast.description && (
          <p className="text-sm text-slate-600 line-clamp-2">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 rounded p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <X className="w-4 h-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}
