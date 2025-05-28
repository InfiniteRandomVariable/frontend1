"use client";

import type React from "react";
import { useEffect, useState } from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToasterToast = Toast;

// Global store for toasts
const TOAST_STORE: {
  toasts: ToasterToast[];
  listeners: Array<(toasts: ToasterToast[]) => void>;
} = {
  toasts: [],
  listeners: [],
};

const addToast = (toast: Omit<ToasterToast, "id">) => {
  const id = genId();
  const newToast = { id, ...toast };

  TOAST_STORE.toasts = [...TOAST_STORE.toasts, newToast].slice(-TOAST_LIMIT);
  TOAST_STORE.listeners.forEach((listener) => listener(TOAST_STORE.toasts));

  setTimeout(() => {
    TOAST_STORE.toasts = TOAST_STORE.toasts.filter((t) => t.id !== id);
    TOAST_STORE.listeners.forEach((listener) => listener(TOAST_STORE.toasts));
  }, TOAST_REMOVE_DELAY);

  return id;
};

const useToast = () => {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  useEffect(() => {
    setMounted(true);

    // Subscribe to toast store
    const handleToastsChange = (newToasts: ToasterToast[]) => {
      setToasts([...newToasts]);
    };

    TOAST_STORE.listeners.push(handleToastsChange);
    setToasts(TOAST_STORE.toasts);

    return () => {
      setMounted(false);
      TOAST_STORE.listeners = TOAST_STORE.listeners.filter(
        (listener) => listener !== handleToastsChange
      );
    };
  }, []);

  const toast = (props: Omit<ToasterToast, "id">) => {
    return addToast(props);
  };

  const dismiss = (toastId: string) => {
    TOAST_STORE.toasts = TOAST_STORE.toasts.filter((t) => t.id !== toastId);
    TOAST_STORE.listeners.forEach((listener) => listener(TOAST_STORE.toasts));
  };

  const dismissAll = () => {
    TOAST_STORE.toasts = [];
    TOAST_STORE.listeners.forEach((listener) => listener([]));
  };

  return {
    toast,
    dismiss,
    dismissAll,
    toasts: mounted ? toasts : [],
  };
};

// Create a toast function that can be imported directly
export const toast = (props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}) => {
  return addToast(props);
};

export { useToast };
