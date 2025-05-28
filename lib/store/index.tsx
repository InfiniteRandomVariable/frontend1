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
}

type AppStore = AppState & AppActions;

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      searchQuery: "",
      searchResults: [],
      watchlist: [],
      purchaseData: null,
      selectedArbiters: [],
      isLoading: false,
      error: null,

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
    }),
    {
      name: "app-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        watchlist: state.watchlist,
        searchQuery: state.searchQuery,
      }),
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
  };
};

export default useAppStore;

// "use client";

// import type React from "react";

// import { createContext, useContext, useState } from "react";
// import { createStore, useStore, type StoreApi } from "zustand"; // Import StoreApi
// import { persist, type PersistOptions } from "zustand/middleware"; // Import PersistOptions
// import type { Product, Arbiter, User, PurchaseData } from "@/lib/types";

// // Define our store types
// interface StoreState {
//   // User authentication
//   user: User | null;
//   isAuthenticated: boolean;

//   // Purchase flow
//   purchaseData: PurchaseData | null;

//   // App state
//   watchlist: Product[];
//   cart: {
//     items: Array<{ product: Product; quantity: number }>;
//     total: number;
//   };

//   // Actions
//   actions: {
//     // Auth actions
//     login: (user: User) => void;
//     logout: () => void;
//     setUser: (user: User) => void;

//     // Purchase flow actions
//     setPurchaseData: (data: PurchaseData) => void;
//     clearPurchaseData: () => void;
//     updateSelectedArbiters: (arbiters: Arbiter[]) => void;

//     // Watchlist actions
//     addToWatchlist: (product: Product) => void;
//     removeFromWatchlist: (productId: number) => void;

//     // Cart actions
//     addToCart: (product: Product, quantity: number) => void;
//     removeFromCart: (productId: number) => void;
//     updateCartItemQuantity: (productId: number, quantity: number) => void;
//     clearCart: () => void;
//   };
// }

// // Create a context for our store
// // The context should hold the StoreApi type
// export const StoreContext = createContext<StoreApi<StoreState> | null>(null);

// // Create a provider component
// export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
//   const [store] = useState(() => {
//     // Define the persist options with the correct typing
//     const persistOptions: PersistOptions<
//       StoreState,
//       Pick<
//         StoreState,
//         "user" | "isAuthenticated" | "watchlist" | "cart" | "purchaseData"
//       >
//     > = {
//       name: "ecommerce-store",
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//         watchlist: state.watchlist,
//         cart: state.cart,
//         purchaseData: state.purchaseData,
//       }),
//     };

//     return createStore<StoreState>()(
//       persist(
//         (set, get) => ({
//           // Initial state
//           user: null,
//           isAuthenticated: false,
//           purchaseData: null,
//           watchlist: [],
//           cart: {
//             items: [],
//             total: 0,
//           },

//           actions: {
//             // Auth actions
//             login: (user: User, token: string) => {
//               // Store token in localStorage for axios interceptor
//               if (typeof window !== "undefined") {
//                 localStorage.setItem("auth_token", token);
//               }

//               set({
//                 user: { ...user, token },
//                 isAuthenticated: true,
//               });
//             },

//             logout: () => {
//               // Remove token from localStorage
//               if (typeof window !== "undefined") {
//                 localStorage.removeItem("auth_token");
//               }

//               set({
//                 user: null,
//                 isAuthenticated: false,
//                 purchaseData: null,
//               });
//             },

//             setUser: (user: User) => {
//               set({ user, isAuthenticated: true });
//             },

//             // Purchase flow actions
//             setPurchaseData: (data: PurchaseData) => {
//               set({ purchaseData: data });
//             },

//             clearPurchaseData: () => {
//               set({ purchaseData: null });
//             },

//             updateSelectedArbiters: (arbiters: Arbiter[]) => {
//               const currentData = get().purchaseData;
//               if (currentData) {
//                 set({
//                   purchaseData: {
//                     ...currentData,
//                     selectedArbiters: arbiters,
//                   },
//                 });
//               }
//             },

//             // Watchlist actions
//             addToWatchlist: (product: Product) =>
//               set((state) => {
//                 const exists = state.watchlist.some(
//                   (item) => item.id === product.id
//                 );
//                 if (exists) return state;

//                 return {
//                   watchlist: [...state.watchlist, product],
//                 };
//               }),

//             removeFromWatchlist: (productId: number) =>
//               set((state) => ({
//                 watchlist: state.watchlist.filter(
//                   (product) => product.id !== productId
//                 ),
//               })),

//             // Cart actions
//             addToCart: (product: Product, quantity: number) =>
//               set((state) => {
//                 const existingItemIndex = state.cart.items.findIndex(
//                   (item) => item.product.id === product.id
//                 );
//                 const newItems = [...state.cart.items];

//                 if (existingItemIndex >= 0) {
//                   newItems[existingItemIndex] = {
//                     ...newItems[existingItemIndex],
//                     quantity: newItems[existingItemIndex].quantity + quantity,
//                   };
//                 } else {
//                   newItems.push({ product, quantity });
//                 }

//                 const newTotal = newItems.reduce(
//                   (sum, item) => sum + item.product.price * item.quantity,
//                   0
//                 );

//                 return {
//                   cart: {
//                     items: newItems,
//                     total: newTotal,
//                   },
//                 };
//               }),

//             removeFromCart: (productId: number) =>
//               set((state) => {
//                 const newItems = state.cart.items.filter(
//                   (item) => item.product.id !== productId
//                 );
//                 const newTotal = newItems.reduce(
//                   (sum, item) => sum + item.product.price * item.quantity,
//                   0
//                 );

//                 return {
//                   cart: {
//                     items: newItems,
//                     total: newTotal,
//                   },
//                 };
//               }),

//             updateCartItemQuantity: (productId: number, quantity: number) =>
//               set((state) => {
//                 const newItems = state.cart.items.map((item) =>
//                   item.product.id === productId ? { ...item, quantity } : item
//                 );
//                 const newTotal = newItems.reduce(
//                   (sum, item) => sum + item.product.price * item.quantity,
//                   0
//                 );

//                 return {
//                   cart: {
//                     items: newItems,
//                     total: newTotal,
//                   },
//                 };
//               }),

//             clearCart: () =>
//               set({
//                 cart: {
//                   items: [],
//                   total: 0,
//                 },
//               }),
//           },
//         }),
//         persistOptions // Pass the defined persist options
//       )
//     );
//   });

//   return (
//     <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
//   );
// };

// // Custom hook to use the store
// export const useAppStore = <T,>(selector: (state: StoreState) => T): T => {
//   const store = useContext(StoreContext);
//   if (!store) {
//     throw new Error("useAppStore must be used within a StoreProvider");
//   }
//   // The useStore hook expects a StoreApi, which `store` now correctly is.
//   return useStore(store, selector);
// };

// // Export specific selectors as custom hooks
// export const useUser = () => useAppStore((state) => state.user);
// export const useIsAuthenticated = () =>
//   useAppStore((state) => state.isAuthenticated);
// export const usePurchaseData = () => useAppStore((state) => state.purchaseData);
// export const useWatchlist = () => useAppStore((state) => state.watchlist);
// export const useCart = () => useAppStore((state) => state.cart);
// export const useActions = () => useAppStore((state) => state.actions);

// "use client";

// import type React from "react";

// import { createContext, useContext, useState } from "react";
// import { createStore, useStore, StoreApi } from "zustand";
// import type { Product } from "@/lib/types";

// // Define our store types
// interface StoreState {
//   user: {
//     id: string | null;
//     name: string | null;
//     email: string | null;
//     role: "user" | "admin" | null;
//     token: string | null;
//   };
//   watchlist: Product[];
//   cart: {
//     items: Array<{ product: Product; quantity: number }>;
//     total: number;
//   };
//   actions: {
//     login: (userData: {
//       id: string;
//       name: string;
//       email: string;
//       role: "user" | "admin";
//       token: string;
//     }) => void;
//     logout: () => void;
//     addToWatchlist: (product: Product) => void;
//     removeFromWatchlist: (productId: number) => void;
//     addToCart: (product: Product, quantity: number) => void;
//     removeFromCart: (productId: number) => void;
//     updateCartItemQuantity: (productId: number, quantity: number) => void;
//     clearCart: () => void;
//   };
// }
// // const StoreContext = React.createContext<StoreContextType | null>(null);
// // Create a context for our store
// export const StoreContext = createContext<StoreApi<StoreState> | null>(null);

// // Create a provider component
// export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
//   const [store] = useState(() =>
//     createStore<StoreState>((set) => ({
//       user: {
//         id: null,
//         name: null,
//         email: null,
//         role: null,
//         token: null,
//       },
//       watchlist: [],
//       cart: {
//         items: [],
//         total: 0,
//       },
//       actions: {
//         login: (userData) =>
//           set((state) => ({
//             user: {
//               id: userData.id,
//               name: userData.name,
//               email: userData.email,
//               role: userData.role,
//               token: userData.token,
//             },
//           })),
//         logout: () =>
//           set((state) => ({
//             user: {
//               id: null,
//               name: null,
//               email: null,
//               role: null,
//               token: null,
//             },
//           })),
//         addToWatchlist: (product) =>
//           set((state) => {
//             // Check if product is already in watchlist
//             const exists = state.watchlist.some(
//               (item) => item.id === product.id
//             );
//             if (exists) return state;

//             return {
//               watchlist: [...state.watchlist, product],
//             };
//           }),
//         removeFromWatchlist: (productId) =>
//           set((state) => ({
//             watchlist: state.watchlist.filter(
//               (product) => product.id !== productId
//             ),
//           })),
//         addToCart: (product, quantity) =>
//           set((state) => {
//             const existingItemIndex = state.cart.items.findIndex(
//               (item) => item.product.id === product.id
//             );

//             const newItems = [...state.cart.items];

//             if (existingItemIndex >= 0) {
//               // Update quantity if item already exists
//               newItems[existingItemIndex] = {
//                 ...newItems[existingItemIndex],
//                 quantity: newItems[existingItemIndex].quantity + quantity,
//               };
//             } else {
//               // Add new item
//               newItems.push({ product, quantity });
//             }

//             // Calculate new total
//             const newTotal = newItems.reduce(
//               (sum, item) => sum + item.product.price * item.quantity,
//               0
//             );

//             return {
//               cart: {
//                 items: newItems,
//                 total: newTotal,
//               },
//             };
//           }),
//         removeFromCart: (productId) =>
//           set((state) => {
//             const newItems = state.cart.items.filter(
//               (item) => item.product.id !== productId
//             );
//             const newTotal = newItems.reduce(
//               (sum, item) => sum + item.product.price * item.quantity,
//               0
//             );

//             return {
//               cart: {
//                 items: newItems,
//                 total: newTotal,
//               },
//             };
//           }),
//         updateCartItemQuantity: (productId, quantity) =>
//           set((state) => {
//             const newItems = state.cart.items.map((item) =>
//               item.product.id === productId ? { ...item, quantity } : item
//             );
//             const newTotal = newItems.reduce(
//               (sum, item) => sum + item.product.price * item.quantity,
//               0
//             );

//             return {
//               cart: {
//                 items: newItems,
//                 total: newTotal,
//               },
//             };
//           }),
//         clearCart: () =>
//           set((state) => ({
//             cart: {
//               items: [],
//               total: 0,
//             },
//           })),
//       },
//     }))
//   );

//   return (
//     <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
//   );
// };

// // Custom hook to use the store
// export const useAppStore = <T extends unknown>(
//   selector: (state: StoreState) => T
// ): T => {
//   const store = useContext(StoreContext);
//   if (!store) {
//     throw new Error("useAppStore must be used within a StoreProvider");
//   }
//   return useStore(store, selector);
// };

// // Export specific selectors as custom hooks
// export const useUser = () => useAppStore((state) => state.user);
// export const useWatchlist = () => useAppStore((state) => state.watchlist);
// export const useCart = () => useAppStore((state) => state.cart);
// export const useActions = () => useAppStore((state) => state.actions);
