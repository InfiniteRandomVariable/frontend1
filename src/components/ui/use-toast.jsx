"use client"

import { createContext, useContext, useState } from "react"

const ToastContext = createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
  dismissAll: () => {},
})

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, action, variant }) => {
    const id = genId()
    const newToast = {
      id,
      title,
      description,
      action,
      variant,
    }

    setToasts((prevToasts) => {
      const updatedToasts = [...prevToasts, newToast].slice(-TOAST_LIMIT)
      return updatedToasts
    })

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, TOAST_REMOVE_DELAY)

    return id
  }

  const dismiss = (toastId) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }

  const dismissAll = () => {
    setToasts([])
  }

  return <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}
