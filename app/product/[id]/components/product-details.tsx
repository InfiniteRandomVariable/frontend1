"use client";

import { useState } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { Heart, HelpCircle } from "lucide-react";
import { useActions, useWatchlist } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useInitiatePurchase } from "@/hooks/use-purchase";

import type { Product, PurchaseData } from "@/lib/types";

export default function ProductDetails({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null
  );
  const [selectedStorage, setSelectedStorage] = useState(
    product.storage?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.imageUrl);

  const watchlist = useWatchlist();
  const { addToWatchlist, removeFromWatchlist } = useActions();
  const { toast } = useToast();
  const initiatePurchase = useInitiatePurchase();

  const isInWatchlist = watchlist.some((item) => item.id === product.id);

  // Add to watchlist mutation
  const addToWatchlistMutation = useMutation({
    mutationFn: (productId: number) => apiClient.addToWatchlist(productId),
    onSuccess: () => {
      addToWatchlist(product);
      toast({
        title: "Added to watchlist",
        description: `${product.name} has been added to your watchlist.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to watchlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove from watchlist mutation
  const removeFromWatchlistMutation = useMutation({
    mutationFn: (productId: number) => apiClient.removeFromWatchlist(productId),
    onSuccess: () => {
      removeFromWatchlist(product.id);
      toast({
        title: "Removed from watchlist",
        description: `${product.name} has been removed from your watchlist.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBuyNow = () => {
    // Prepare purchase data

    const purchaseData: PurchaseData = {
      product,
      selectedArbiters: [], // Will be filled in arbiter selection
      quantity,
      selectedColor: selectedColor || undefined,
      selectedStorage: selectedStorage || undefined,
    };

    // Initiate purchase flow
    initiatePurchase(purchaseData);
  };

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlistMutation.mutate(product.id);
    } else {
      addToWatchlistMutation.mutate(product.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="bg-white p-6 rounded-lg">
        <div className="relative aspect-square mb-4 flex items-center justify-center">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="object-contain max-h-full"
          />
          {product.badge && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {product.badge}
            </div>
          )}
        </div>

        {product.images && (
          <div className="grid grid-cols-5 gap-2">
            {[product.imageUrl, ...product.images].map((img, index) => (
              <button
                key={index}
                className={`border rounded-md p-1 ${
                  mainImage === img ? "border-blue-500" : "border-gray-200"
                }`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-contain h-16 w-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-xl font-bold mb-2">{product.name}</h1>

        <div className="mb-4">
          <div className="text-2xl font-bold">{formatPrice(product.price)}</div>
          {product.originalCurrency && (
            <div className="text-sm text-gray-500">
              {product.originalCurrency} {product.originalPrice?.toFixed(2)}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500">
            {product.shipping && `${formatPrice(product.shipping)} shipping`}
          </div>
          <div className="text-sm">
            {product.estimatedDelivery &&
              `Est. delivery ${product.estimatedDelivery}`}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-1">
            <span className="text-sm">Condition:</span>
            <span className="text-sm font-medium">{product.condition}</span>
            {product.condition && (
              <HelpCircle className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>

        {product.storage && product.storage.length > 0 && (
          <div className="mb-4">
            <label className="text-sm mb-1 block">
              Storage: {selectedStorage}
            </label>
            <Select
              value={selectedStorage || ""}
              onValueChange={setSelectedStorage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {product.storage.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <label className="text-sm mb-1 block">
              Colour: {selectedColor}
            </label>
            <Select
              value={selectedColor || ""}
              onValueChange={setSelectedColor}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {product.colors.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mb-6">
          <label className="text-sm mb-1 block">Quantity: {quantity}</label>
          <Select
            value={quantity.toString()}
            onValueChange={(value) => setQuantity(Number.parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="1" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mb-3"
          onClick={handleBuyNow}
        >
          Buy It Now
        </Button>

        <Button
          variant="outline"
          className={`w-full py-3 rounded-md mb-6 flex items-center justify-center gap-2 ${
            isInWatchlist
              ? "border-red-600 text-red-600 hover:bg-red-50"
              : "border-blue-600 text-blue-600 hover:bg-blue-50"
          }`}
          onClick={handleWatchlistToggle}
          disabled={
            addToWatchlistMutation.isPending ||
            removeFromWatchlistMutation.isPending
          }
        >
          <Heart className={`h-5 w-5 ${isInWatchlist ? "fill-red-600" : ""}`} />
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </Button>

        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Breathe easy. Returns accepted.</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              People want this. {product.watchers || 64} people are watching
              this.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
