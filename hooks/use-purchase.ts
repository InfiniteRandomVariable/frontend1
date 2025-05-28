"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import {
  usePurchaseData,
  useSelectedArbiters,
  useIsAuthenticated,
  useSetPurchaseData,
  useClearPurchaseData,
} from "@/lib/store";
import type { PurchaseData, PurchaseOfferRequest, Arbiter } from "@/lib/types";

export const useInitiatePurchase = () => {
  const router = useRouter();
  const setPurchaseData = useSetPurchaseData();

  return (purchaseData: PurchaseData) => {
    // Save purchase data to store
    setPurchaseData(purchaseData);

    // Navigate to arbiter selection
    router.push("/arbiters");
  };
};

export const useCompletePurchase = () => {
  const router = useRouter();
  const { toast } = useToast();
  const isAuthenticated = useIsAuthenticated();
  const purchaseData = usePurchaseData();
  const selectedArbiters = useSelectedArbiters();
  const clearPurchaseData = useClearPurchaseData();

  const purchaseMutation = useMutation({
    mutationFn: (request: PurchaseOfferRequest) =>
      apiClient.makePurchaseOffer(request),
    onSuccess: (response) => {
      console.log("Purchase API success:", response);

      toast({
        title: "Purchase successful!",
        description: "Your purchase offer has been submitted successfully.",
      });

      // Redirect to confirmation page with order ID
      const orderId = response.orderId || "ORD" + Date.now();
      console.log("Redirecting to confirmation with orderId:", orderId);

      // Navigate first, then clear data after a delay to prevent redirect issues
      router.push(`/checkout/confirmation?orderId=${orderId}`);

      // Clear purchase data after navigation
      setTimeout(() => {
        clearPurchaseData();
      }, 1000);
    },
    onError: (error: Error) => {
      console.error("Purchase API error:", error);
      toast({
        title: "Purchase failed",
        description:
          error.message || "Failed to submit purchase offer. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Return a function that accepts arbiters as parameter to ensure we use the latest data
  return (arbitersToUse?: Arbiter[]) => {
    console.log("=== useCompletePurchase called ===");

    // Use passed arbiters or fall back to store arbiters
    const arbitersForPurchase = arbitersToUse || selectedArbiters;

    console.log("isAuthenticated:", isAuthenticated);
    console.log("purchaseData:", purchaseData);
    console.log("selectedArbiters from store:", selectedArbiters);
    console.log("arbitersToUse (passed):", arbitersToUse);
    console.log("arbitersForPurchase (final):", arbitersForPurchase);

    // Check if we have purchase data and selected arbiters
    if (!purchaseData) {
      console.log("No purchase data, redirecting to home");
      toast({
        title: "Missing purchase data",
        description: "Please start your purchase from a product page.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    if (arbitersForPurchase.length === 0) {
      console.log("No arbiters selected");
      toast({
        title: "No arbiters selected",
        description: "Please select arbiters to complete your purchase.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");

      // Store current path for redirect after login
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirect_after_login", "purchase_confirmation");
        sessionStorage.setItem("purchase_flow", "true");
        console.log("Stored purchase flow in sessionStorage");
      }

      toast({
        title: "Login required",
        description: "Please log in to complete your purchase.",
      });

      // Force navigation to login
      setTimeout(() => {
        router.push("/auth/login");
      }, 100);
      return;
    }

    console.log("User is authenticated, proceeding with purchase");

    // User is authenticated, proceed with purchase
    const request: PurchaseOfferRequest = {
      phoneIdFk: purchaseData.product.id,
      arbiter1UserIdFk: arbitersForPurchase[0]?.id || null,
      arbiter2UserIdFk: arbitersForPurchase[1]?.id || null,
      arbiter3UserIdFk: arbitersForPurchase[2]?.id || null,
      arbiter4UserIdFk: arbitersForPurchase[3]?.id || null,
      arbiter5UserIdFk: arbitersForPurchase[4]?.id || null,
      arbiter6UserIdFk: arbitersForPurchase[5]?.id || null,
    };

    console.log("Submitting purchase request:", request);

    // Submit purchase offer
    purchaseMutation.mutate(request);
  };
};

export const usePurchaseStatus = () => {
  const purchaseData = usePurchaseData();
  const selectedArbiters = useSelectedArbiters();
  const isAuthenticated = useIsAuthenticated();

  return {
    hasProduct: !!purchaseData?.product,
    hasArbiters: selectedArbiters.length > 0,
    isAuthenticated,
    canPurchase:
      !!purchaseData?.product &&
      selectedArbiters.length === 6 &&
      isAuthenticated,
  };
};
