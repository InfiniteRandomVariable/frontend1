"use client"

import type React from "react"

import { useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

type ToasterToast = Toast

const useToast = () => {
  const [mounted, setMounted] = useState(false)
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  const toast = ({ title, description, action, variant }: Omit<ToasterToast, "id">) => {
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

  const dismiss = (toastId: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }

  const dismissAll = () => {
    setToasts([])
  }

  return {
    toast,
    dismiss,
    dismissAll,
    toasts: mounted ? toasts : [],
  }
}

export { useToast }

// Create a toast function that can be imported directly
export const toast = ({
  title,
  description,
  variant,
}: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
  // This is a dummy function that will be replaced by the actual toast function at runtime
  console.log("Toast:", title, description, variant)
}
