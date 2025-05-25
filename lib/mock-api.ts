import { mockProducts, iphone14Products } from "./mock-data/products"
import { mockArbiters } from "./mock-data/arbiters"
import { mockCategories } from "./mock-data/categories"
import type { Product, Arbiter, Category } from "./types"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  // Product-related API calls
  async getProducts(): Promise<Product[]> {
    await delay(800)
    return [...mockProducts, ...iphone14Products]
  },

  async getProductById(id: string | number): Promise<Product> {
    await delay(600)
    const numericId = typeof id === "string" ? Number.parseInt(id, 10) : id
    const allProducts = [...mockProducts, ...iphone14Products]
    const product = allProducts.find((p) => p.id === numericId)

    if (!product) {
      throw new Error(`Product with ID ${id} not found`)
    }

    return product
  },

  async searchProducts(query: string): Promise<Product[]> {
    await delay(1000)

    if (!query) return []

    // Special case for iPhone 14 searches
    if (query.toLowerCase().includes("iphone14") || query.toLowerCase().includes("iphone 14")) {
      return iphone14Products
    }

    return [...mockProducts, ...iphone14Products].filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(query.toLowerCase())),
    )
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    await delay(800)
    return [...mockProducts, ...iphone14Products].filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    )
  },

  // Category-related API calls
  async getCategories(): Promise<Category[]> {
    await delay(500)
    return mockCategories
  },

  // Arbiter-related API calls
  async getArbiters(): Promise<Arbiter[]> {
    await delay(700)
    return mockArbiters
  },

  async getArbiterById(id: string | number): Promise<Arbiter> {
    await delay(500)
    const numericId = typeof id === "string" ? Number.parseInt(id, 10) : id
    const arbiter = mockArbiters.find((a) => a.id === numericId)

    if (!arbiter) {
      throw new Error(`Arbiter with ID ${id} not found`)
    }

    return arbiter
  },

  // Watchlist-related API calls
  async getWatchlist(): Promise<Product[]> {
    await delay(600)
    // Return a subset of products as "watched" items
    return [mockProducts[0], iphone14Products[0], mockProducts[2]].map((product) => ({
      ...product,
      isWatched: true,
    }))
  },

  async addToWatchlist(productId: number): Promise<{ success: boolean }> {
    await delay(400)
    return { success: true }
  },

  async removeFromWatchlist(productId: number): Promise<{ success: boolean }> {
    await delay(400)
    return { success: true }
  },

  // Checkout-related API calls
  async createOrder(orderData: any): Promise<{ orderId: string }> {
    await delay(1000)
    return { orderId: `ORD${Math.floor(Math.random() * 1000000)}` }
  },

  // Arbiter selection API calls
  async selectArbiters(arbiterIds: number[]): Promise<{ success: boolean }> {
    await delay(800)
    return { success: true }
  },

  async getRandomArbiters(count = 6): Promise<Arbiter[]> {
    await delay(600)
    // Shuffle and return a subset of arbiters
    return [...mockArbiters].sort(() => 0.5 - Math.random()).slice(0, Math.min(count, mockArbiters.length))
  },
}
