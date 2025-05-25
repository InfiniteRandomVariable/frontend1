import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

// Hook for fetching all products
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.getProducts(),
  })
}

// Hook for searching products
export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => apiClient.searchProducts(query),
    enabled: !!query, // Only run the query if there's a search term
  })
}

// Hook for fetching products by category
export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => apiClient.getProductsByCategory(category),
    enabled: !!category, // Only run the query if there's a category
  })
}

// Hook for fetching a single product by ID
export function useProductDetails(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => apiClient.getProductById(id),
    enabled: !!id, // Only run the query if there's an ID
  })
}
