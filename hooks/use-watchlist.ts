import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

// Hook for fetching the user's watchlist
export function useWatchlist() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: () => apiClient.getWatchlist(),
  })
}

// Hook for adding a product to the watchlist
export function useAddToWatchlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: number) => apiClient.addToWatchlist(productId),
    onSuccess: () => {
      // Invalidate the watchlist query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["watchlist"] })
    },
  })
}

// Hook for removing a product from the watchlist
export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: number) => apiClient.removeFromWatchlist(productId),
    onSuccess: () => {
      // Invalidate the watchlist query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["watchlist"] })
    },
  })
}
