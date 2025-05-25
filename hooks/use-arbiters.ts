import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query"; // <-- Ensure useQueryClient is imported here
import { apiClient } from "@/lib/api-client";

import type { PaginationParams, PaginatedResponse, Arbiter } from "@/lib/types";

// Hook for fetching all arbiters (non-paginated)
export function useArbiters() {
  return useQuery({
    queryKey: ["arbiters"],
    queryFn: () => apiClient.getArbiters(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching arbiters with pagination
export function useArbitersPaginated(params: PaginationParams) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["arbiters", "paginated", params.page, params.pageSize],
    queryFn: () => apiClient.getArbitersPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Correct placeholderData for "keep previous data" in v5
    placeholderData: (context) => {
      // This function runs every time the query key changes.
      // We want to fetch the data for the *previous page number* from the cache.
      if (params.page > 1) {
        // Attempt to get the data for the preceding page from the cache
        return queryClient.getQueryData<PaginatedResponse<Arbiter>>([
          "arbiters",
          "paginated",
          params.page - 1, // Look for the previous page's data
          params.pageSize,
        ]);
      }
      // If it's the first page (or page <= 1), there's no "previous" page data to show
      return undefined;
    },
  });
}

// Hook for infinite scroll pagination
export function useArbitersInfinite(pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ["arbiters", "infinite", pageSize],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getArbitersPaginated({ page: pageParam, pageSize }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // ADD THIS LINE: Specify the initial page parameter
    initialPageParam: 1, // Or whatever your first page number should be
  });
}

// Hook for fetching a single arbiter by ID
export function useArbiterDetails(id: string | number) {
  return useQuery({
    queryKey: ["arbiters", id],
    queryFn: () => apiClient.getArbiterById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching random arbiters
export function useRandomArbiters(count = 6) {
  return useQuery({
    queryKey: ["arbiters", "random", count],
    queryFn: () => apiClient.getRandomArbiters(count),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for selecting arbiters
export function useSelectArbiters() {
  return useMutation({
    mutationFn: (arbiterIds: number[]) => apiClient.selectArbiters(arbiterIds),
  });
}
