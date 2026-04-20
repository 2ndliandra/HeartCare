import * as React from "react"

export type ToastVariant = "success" | "error" | "warning" | "info" | "default"

export interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type ToastMessage = Omit<ToastProps, "id">

// Global state for toasts
let memoryState: ToastProps[] = []
let listeners: React.Dispatch<React.SetStateAction<ToastProps[]>>[] = []

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function dispatch(action: { type: "ADD_TOAST" | "REMOVE_TOAST"; toast?: ToastProps; toastId?: string }) {
  if (action.type === "ADD_TOAST" && action.toast) {
    memoryState = [action.toast, ...memoryState].slice(0, TOAST_LIMIT)
  } else if (action.type === "REMOVE_TOAST" && action.toastId) {
    memoryState = memoryState.filter((t) => t.id !== action.toastId)
  }

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

export function toast({ ...props }: ToastMessage) {
  const id = generateId()

  const newToast: ToastProps = {
    ...props,
    id,
    variant: props.variant || "default",
    duration: props.duration || TOAST_REMOVE_DELAY,
  }

  dispatch({ type: "ADD_TOAST", toast: newToast })

  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId: id })
  }, newToast.duration)

  return {
    id,
    dismiss: () => dispatch({ type: "REMOVE_TOAST", toastId: id }),
  }
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>(memoryState)

  React.useEffect(() => {
    listeners.push(setToasts)
    return () => {
      const index = listeners.indexOf(setToasts)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toasts,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        dispatch({ type: "REMOVE_TOAST", toastId })
      } else {
        // Dismiss all
        memoryState.forEach((t) => dispatch({ type: "REMOVE_TOAST", toastId: t.id }))
      }
    },
  }
}
