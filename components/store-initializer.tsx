"use client";

import type React from "react";
import { useEffect } from "react";
import { useSetHasHydrated, useHasHydrated } from "@/lib/store";

interface StoreInitializerProps {
  children: React.ReactNode;
}

export function StoreInitializer({ children }: StoreInitializerProps) {
  const hasHydrated = useHasHydrated();
  const setHasHydrated = useSetHasHydrated();

  // Set hydration flag when component mounts on client
  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  // Show loading state until hydration is complete
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-sm text-gray-500">Loading TechBay...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
