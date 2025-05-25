import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

// Hook for fetching product details for checkout
export function useCheckoutProduct(productId: string) {
  return useQuery({
    queryKey: ["checkout", "product", productId],
    queryFn: () => apiClient.getProductById(productId),
    enabled: !!productId, // Only run the query if there's a product ID
  })
}
