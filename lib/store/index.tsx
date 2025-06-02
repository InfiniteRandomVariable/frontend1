import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Arbiter, User, PurchaseData } from "../types";

interface AppState {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;

  // Search state
  searchQuery: string;
  searchResults: Product[];

  // Watchlist state
  watchlist: Product[];

  // Purchase flow state
  purchaseData: PurchaseData | null;
  selectedArbiters: Arbiter[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Hydration state
  _hasHydrated: boolean;
}

interface AppActions {
  // Authentication actions
  login: (user: User) => void;
  logout: () => void;

  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Product[]) => void;
  clearSearch: () => void;

  // Watchlist actions
  addToWatchlist: (product: Product) => void;
  removeFromWatchlist: (productId: number) => void;
  clearWatchlist: () => void;

  // Purchase flow actions
  setPurchaseData: (data: PurchaseData) => void;
  setSelectedArbiters: (arbiters: Arbiter[]) => void;
  clearPurchaseData: () => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Hydration actions
  setHasHydrated: (state: boolean) => void;
}

type AppStore = AppState & AppActions;

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  searchQuery: "",
  searchResults: [],
  watchlist: [],
  purchaseData: null,
  selectedArbiters: [],
  isLoading: false,
  error: null,
  _hasHydrated: false,
};

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Authentication actions
      login: (user: User) => {
        // Store token in localStorage for API requests
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", user.token);
        }
        set({
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        // Clear token from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        set({
          user: null,
          isAuthenticated: false,
          purchaseData: null,
          selectedArbiters: [],
          error: null,
        });
      },

      // Search actions
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setSearchResults: (results: Product[]) => set({ searchResults: results }),
      clearSearch: () => set({ searchQuery: "", searchResults: [] }),

      // Watchlist actions
      addToWatchlist: (product: Product) => {
        const { watchlist } = get();
        if (!watchlist.find((p) => p.id === product.id)) {
          set({ watchlist: [...watchlist, product] });
        }
      },

      removeFromWatchlist: (productId: number) => {
        const { watchlist } = get();
        set({ watchlist: watchlist.filter((p) => p.id !== productId) });
      },

      clearWatchlist: () => set({ watchlist: [] }),

      // Purchase flow actions
      setPurchaseData: (data: PurchaseData) => set({ purchaseData: data }),
      setSelectedArbiters: (arbiters: Arbiter[]) =>
        set({ selectedArbiters: arbiters }),
      clearPurchaseData: () =>
        set({ purchaseData: null, selectedArbiters: [] }),

      // UI actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      // Hydration actions
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: "app-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        watchlist: state.watchlist,
        searchQuery: state.searchQuery,
        purchaseData: state.purchaseData,
        selectedArbiters: state.selectedArbiters,
      }),
      // Set hydration flag when rehydration is complete
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// Selector hooks for easier access to state
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAppStore((state) => state.isAuthenticated);
export const useSearchQuery = () => useAppStore((state) => state.searchQuery);
export const useSearchResults = () =>
  useAppStore((state) => state.searchResults);
export const useWatchlist = () => useAppStore((state) => state.watchlist);
export const usePurchaseData = () => useAppStore((state) => state.purchaseData);
export const useSelectedArbiters = () =>
  useAppStore((state) => state.selectedArbiters);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useHasHydrated = () => useAppStore((state) => state._hasHydrated);

// Individual action hooks to avoid object recreation
export const useLogin = () => useAppStore((state) => state.login);
export const useLogout = () => useAppStore((state) => state.logout);
export const useSetSearchQuery = () =>
  useAppStore((state) => state.setSearchQuery);
export const useSetSearchResults = () =>
  useAppStore((state) => state.setSearchResults);
export const useClearSearch = () => useAppStore((state) => state.clearSearch);
export const useAddToWatchlist = () =>
  useAppStore((state) => state.addToWatchlist);
export const useRemoveFromWatchlist = () =>
  useAppStore((state) => state.removeFromWatchlist);
export const useClearWatchlist = () =>
  useAppStore((state) => state.clearWatchlist);
export const useSetPurchaseData = () =>
  useAppStore((state) => state.setPurchaseData);
export const useSetSelectedArbiters = () =>
  useAppStore((state) => state.setSelectedArbiters);
export const useClearPurchaseData = () =>
  useAppStore((state) => state.clearPurchaseData);
export const useSetLoading = () => useAppStore((state) => state.setLoading);
export const useSetError = () => useAppStore((state) => state.setError);
export const useSetHasHydrated = () =>
  useAppStore((state) => state.setHasHydrated);

// Legacy useActions hook for backward compatibility - but prefer individual hooks above
export const useActions = () => {
  const login = useAppStore((state) => state.login);
  const logout = useAppStore((state) => state.logout);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const setSearchResults = useAppStore((state) => state.setSearchResults);
  const clearSearch = useAppStore((state) => state.clearSearch);
  const addToWatchlist = useAppStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useAppStore((state) => state.removeFromWatchlist);
  const clearWatchlist = useAppStore((state) => state.clearWatchlist);
  const setPurchaseData = useAppStore((state) => state.setPurchaseData);
  const setSelectedArbiters = useAppStore((state) => state.setSelectedArbiters);
  const clearPurchaseData = useAppStore((state) => state.clearPurchaseData);
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);
  const setHasHydrated = useAppStore((state) => state.setHasHydrated);

  return {
    login,
    logout,
    setSearchQuery,
    setSearchResults,
    clearSearch,
    addToWatchlist,
    removeFromWatchlist,
    clearWatchlist,
    setPurchaseData,
    setSelectedArbiters,
    clearPurchaseData,
    setLoading,
    setError,
    setHasHydrated,
  };
};

export default useAppStore;
