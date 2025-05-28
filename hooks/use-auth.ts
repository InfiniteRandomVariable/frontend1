"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import { useActions } from "@/lib/store";
import type { LoginRequest, RegisterRequest, User } from "@/lib/types";

export const useLogin = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data, variables) => {
      // Create user object from form data and add the token
      const user: User = {
        uName: variables.uName,
        email: variables.email,
        userRole: variables.userRole,
        token: data.token,
      };

      login(user);

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.uName}!`,
      });

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Handle redirect logic
      if (typeof window !== "undefined") {
        const redirectUrl = sessionStorage.getItem("redirect_after_login");
        const isPurchaseFlow = sessionStorage.getItem("purchase_flow");

        // Clear session storage
        sessionStorage.removeItem("redirect_after_login");
        sessionStorage.removeItem("purchase_flow");

        if (isPurchaseFlow === "true") {
          // User was in purchase flow, redirect to purchase confirmation
          router.push("/purchase/confirm");
        } else if (redirectUrl && redirectUrl !== "purchase_confirmation") {
          // Regular redirect
          router.push(redirectUrl);
        } else {
          // Default redirect
          router.push("/");
        }
      } else {
        router.push("/");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
    onSuccess: (data, variables) => {
      // Create user object from form data and add the token
      const user: User = {
        uName: variables.uName,
        email: variables.email,
        userRole: variables.userRole,
        token: data.token,
      };

      login(user);

      toast({
        title: "Registration successful",
        description: `Welcome to TechBay, ${user.uName}!`,
      });

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Handle redirect logic
      if (typeof window !== "undefined") {
        const redirectUrl = sessionStorage.getItem("redirect_after_login");
        const isPurchaseFlow = sessionStorage.getItem("purchase_flow");

        // Clear session storage
        sessionStorage.removeItem("redirect_after_login");
        sessionStorage.removeItem("purchase_flow");

        if (isPurchaseFlow === "true") {
          // User was in purchase flow, redirect to purchase confirmation
          router.push("/purchase/confirm");
        } else if (redirectUrl && redirectUrl !== "purchase_confirmation") {
          // Regular redirect
          router.push(redirectUrl);
        } else {
          // Default redirect
          router.push("/");
        }
      } else {
        router.push("/");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description:
          error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear all cached data
      queryClient.clear();
      logout();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    },
  });
};
