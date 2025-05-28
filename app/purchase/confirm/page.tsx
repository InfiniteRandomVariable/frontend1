"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  usePurchaseData,
  useSelectedArbiters,
  useIsAuthenticated,
} from "@/lib/store";
import { useCompletePurchase } from "@/hooks/use-purchase";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PurchaseConfirmPage() {
  const router = useRouter();
  const { toast } = useToast();
  const isAuthenticated = useIsAuthenticated();
  const purchaseData = usePurchaseData();
  const selectedArbiters = useSelectedArbiters();
  const completePurchase = useCompletePurchase();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your purchase.",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    // Check if we have purchase data
    if (!purchaseData) {
      toast({
        title: "No purchase data",
        description: "Please start your purchase from a product page.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    // Check if we have selected arbiters
    if (selectedArbiters.length === 0) {
      toast({
        title: "No arbiters selected",
        description: "Please select arbiters first.",
        variant: "destructive",
      });
      router.push("/arbiters");
      return;
    }

    // All checks passed, complete the purchase
    completePurchase();
  }, [
    isAuthenticated,
    purchaseData,
    selectedArbiters,
    completePurchase,
    router,
    toast,
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg p-8 border text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-500" />
          <h1 className="text-2xl font-bold mb-2">Processing Your Purchase</h1>
          <p className="text-gray-600">
            Please wait while we submit your purchase offer...
          </p>

          {purchaseData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Purchase Summary:</h3>
              <p className="text-sm">Product: {purchaseData.product.name}</p>
              <p className="text-sm">Price: ${purchaseData.product.price}</p>
              <p className="text-sm">
                Arbiters Selected: {selectedArbiters.length}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
