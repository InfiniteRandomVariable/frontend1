"use client"

import { createContext, useContext, useState } from "react"
import { createStore, useStore } from "zustand"

// Define our store types
const createAppStore = (initialState = {}) => {
  return createStore((set) => ({
    user: {
      id: null,
      name: null,
      email: null,
      role: null,
      token: null,
      ...initialState.user,
    },
    watchlist: initialState.watchlist || [],
    cart: {
      items: [],
      total: 0,
      ...initialState.cart,
    },
    actions: {
      login: (userData) =>
        set((state) => ({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            token: userData.token,
          },
        })),
      logout: () =>
        set((state) => ({
          user: {
            id: null,
            name: null,
            email: null,
            role: null,
            token: null,
          },
        })),
      addToWatchlist: (product) =>
        set((state) => {
          // Check if product is already in watchlist
          const exists = state.watchlist.some((item) => item.id === product.id)
          if (exists) return state

          return {
            watchlist: [...state.watchlist, product],
          }
        }),
      removeFromWatchlist: (productId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((product) => product.id !== productId),
        })),
      addToCart: (product, quantity) =>
        set((state) => {
          const existingItemIndex = state.cart.items.findIndex((item) => item.product.id === product.id)

          const newItems = [...state.cart.items]

          if (existingItemIndex >= 0) {
            // Update quantity if item already exists
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity,
            }
          } else {
            // Add new item
            newItems.push({ product, quantity })
          }

          // Calculate new total
          const newTotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return {
            cart: {
              items: newItems,
              total: newTotal,
            },
          }
        }),
      removeFromCart: (productId) =>
        set((state) => {
          const newItems = state.cart.items.filter((item) => item.product.id !== productId)
          const newTotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return {
            cart: {
              items: newItems,
              total: newTotal,
            },
          }
        }),
      updateCartItemQuantity: (productId, quantity) =>
        set((state) => {
          const newItems = state.cart.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          )
          const newTotal = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

          return {
            cart: {
              items: newItems,
              total: newTotal,
            },
          }
        }),
      clearCart: () =>
        set((state) => ({
          cart: {
            items: [],
            total: 0,
          },
        })),
    },
  }))
}

// Create a context for our store
export const StoreContext = createContext(null)

// Create a provider component
export const StoreProvider = ({ children, initialState = {} }) => {
  const [store] = useState(() => createAppStore(initialState))

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

// Custom hook to use the store
export const useAppStore = (selector) => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error("useAppStore must be used within a StoreProvider")
  }
  return useStore(store, selector)
}

// Export specific selectors as custom hooks
export const useUser = () => useAppStore((state) => state.user)
export const useWatchlist = () => useAppStore((state) => state.watchlist)
export const useCart = () => useAppStore((state) => state.cart)
export const useActions = () => useAppStore((state) => state.actions)
