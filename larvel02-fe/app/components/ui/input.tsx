import * as React from "react"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { cn } from "~/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  suffix?: string
  passwordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, iconLeft, iconRight, suffix, passwordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const currentType = isPassword && showPassword ? "text" : type

    return (
      <div className="relative w-full">
        {iconLeft && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5">
            {iconLeft}
          </div>
        )}
        <input
          type={currentType}
          className={cn(
            "flex w-full h-11 rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 font-normal transition-all duration-150",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-slate-400",
            "focus-visible:outline-none focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100",
            error
              ? "border-red-500 bg-red-50 focus-visible:border-red-500 focus-visible:ring-red-500/10"
              : "border-slate-200",
            iconLeft && "pl-10",
            (passwordToggle || iconRight || suffix) && "pr-12",
            className
          )}
          ref={ref}
          {...props}
        />
        {(passwordToggle || iconRight || suffix) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
            {suffix && <span className="text-xs font-bold text-slate-400">{suffix}</span>}
            {iconRight && <div className="w-5 h-5">{iconRight}</div>}
            {passwordToggle && isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Helper components for Form
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, required, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-[13px] font-medium text-slate-700 mb-2 leading-snug",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
))
Label.displayName = "Label"

const HelperText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-1.5 text-xs text-slate-500 leading-normal", className)}
    {...props}
  />
))
HelperText.displayName = "HelperText"

const ErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  if (!children) return null
  return (
    <p
      ref={ref}
      className={cn(
        "mt-1.5 flex items-center text-xs font-medium text-red-600",
        className
      )}
      {...props}
    >
      <AlertCircle className="mr-1 h-3 w-3" />
      {children}
    </p>
  )
})
ErrorMessage.displayName = "ErrorMessage"

export { Input, Label, HelperText, ErrorMessage }
