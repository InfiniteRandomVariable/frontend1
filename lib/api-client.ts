import axios from "axios"; // Import Axios
import { mockApi } from "./mock-api";
import type {
  Product,
  Arbiter,
  Category,
  ArbiterApiResponse,
  PaginationParams,
  PaginatedResponse,
} from "./types";
import {
  transformArbitersFromApi,
  transformArbiterFromApi,
} from "./transformers/arbiter-transformer";

// Determine if we're in development/preview mode
const isDevelopment = process.env.NODE_ENV === "development";
const isPreview = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";
const useMockApi = isDevelopment || isPreview;

// Base URL for the Express backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is equivalent to fetch's credentials: "include" for all requests
  headers: {
    "Content-Type": "application/json", // Default content-type for POST/PUT/PATCH
  },
});

// API client that handles all communication with the backend
export const apiClient = {
  // Product-related API calls
  async getProducts(): Promise<Product[]> {
    if (useMockApi) {
      return mockApi.getProducts();
    }

    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  },

  async getProductById(id: string | number): Promise<Product> {
    if (useMockApi) {
      return mockApi.getProductById(id);
    }

    const response = await fetch(`${API_URL}/api/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID ${id}`);
    }
    return response.json();
  },

  async searchProducts(query: string): Promise<Product[]> {
    if (useMockApi) {
      return mockApi.searchProducts(query);
    }

    const response = await fetch(
      `${API_URL}/api/products/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to search products with query: ${query}`);
    }
    return response.json();
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (useMockApi) {
      return mockApi.getProductsByCategory(category);
    }

    const response = await fetch(
      `/api/products?category=${encodeURIComponent(category)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch products for category: ${category}`);
    }
    return response.json();
  },

  // Category-related API calls
  async getCategories(): Promise<Category[]> {
    if (useMockApi) {
      return mockApi.getCategories();
    }

    const response = await fetch(`${API_URL}/api/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  },

  // Arbiter-related API calls
  async getArbiters(): Promise<Arbiter[]> {
    if (useMockApi) {
      return mockApi.getArbiters();
    }

    // Use the paginated endpoint with default pagination
    const paginatedResult = await this.getArbitersPaginated({
      page: 1,
      pageSize: 50,
    });
    return paginatedResult.data;
  },

  async getArbitersPaginated(
    params: PaginationParams
  ): Promise<PaginatedResponse<Arbiter>> {
    if (false && useMockApi) {
      // For mock mode, simulate pagination
      const allArbiters = await mockApi.getArbiters();
      const startIndex = (params.page - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedData = allArbiters.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        pagination: {
          page: params.page,
          pageSize: params.pageSize,
          total: allArbiters.length,
          totalPages: Math.ceil(allArbiters.length / params.pageSize),
          hasNext: endIndex < allArbiters.length,
          hasPrev: params.page > 1,
        },
      };
    }

    const url = `${API_URL}/api/arbiters/paginated?page=${params.page}&pageSize=${params.pageSize}`;

    const usingOldCode = false;
    let apiArbiters: ArbiterApiResponse[];
    if (usingOldCode) {
      const response = await fetch(url);
      console.log("calling api from api client");
      if (!response.ok) {
        throw new Error(`Failed to fetch arbiters: ${response.statusText}`);
      }

      apiArbiters = await response.json();
    } else {
      const response = await axiosInstance.get<ArbiterApiResponse[]>(
        `${API_URL}/api/arbiters/paginated`,
        { params: { page: params.page, pageSize: params.pageSize } } // Axios handles query params nicely
      );
      console.log("calling api from api client");
      apiArbiters = response.data;
    }
    //new code

    //Old code

    // Transform API response to UI-friendly format
    const transformedArbiters = transformArbitersFromApi(apiArbiters);

    // Since the API doesn't return pagination metadata, we'll estimate it
    // In a real implementation, the API should return this information
    const estimatedTotal =
      apiArbiters.length === params.pageSize
        ? params.page * params.pageSize + 1
        : (params.page - 1) * params.pageSize + apiArbiters.length;

    return {
      data: transformedArbiters,
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        total: estimatedTotal,
        totalPages: Math.ceil(estimatedTotal / params.pageSize),
        hasNext: apiArbiters.length === params.pageSize,
        hasPrev: params.page > 1,
      },
    };
  },

  async getArbiterById(id: string | number): Promise<Arbiter> {
    if (useMockApi) {
      return mockApi.getArbiterById(id);
    }

    const response = await fetch(`${API_URL}/api/arbiters/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch arbiter with ID ${id}`);
    }

    const apiArbiter: ArbiterApiResponse = await response.json();
    return transformArbiterFromApi(apiArbiter);
  },

  // Watchlist-related API calls
  async getWatchlist(): Promise<Product[]> {
    if (useMockApi) {
      return mockApi.getWatchlist();
    }

    const response = await fetch(`${API_URL}/api/watchlist`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch watchlist");
    }
    return response.json();
  },

  async addToWatchlist(productId: number): Promise<{ success: boolean }> {
    if (useMockApi) {
      return mockApi.addToWatchlist(productId);
    }

    const response = await fetch(`${API_URL}/api/watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to add product ${productId} to watchlist`);
    }
    return response.json();
  },

  async removeFromWatchlist(productId: number): Promise<{ success: boolean }> {
    if (useMockApi) {
      return mockApi.removeFromWatchlist(productId);
    }

    const response = await fetch(`${API_URL}/api/watchlist/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to remove product ${productId} from watchlist`);
    }
    return response.json();
  },

  // Checkout-related API calls
  async createOrder(orderData: any): Promise<{ orderId: string }> {
    if (useMockApi) {
      return mockApi.createOrder(orderData);
    }

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    return response.json();
  },

  // Arbiter selection API calls
  async selectArbiters(arbiterIds: number[]): Promise<{ success: boolean }> {
    if (useMockApi) {
      return mockApi.selectArbiters(arbiterIds);
    }

    const response = await fetch(`${API_URL}/api/arbiters/select`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ arbiterIds }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to select arbiters");
    }
    return response.json();
  },

  async getRandomArbiters(count = 6): Promise<Arbiter[]> {
    if (useMockApi) {
      return mockApi.getRandomArbiters(count);
    }

    // For random arbiters, we can use the paginated endpoint and shuffle the results
    const paginatedResult = await this.getArbitersPaginated({
      page: 1,
      pageSize: count * 2,
    });
    const shuffled = paginatedResult.data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },
};

// --- Request Interceptor ---
// This interceptor will be called BEFORE every request leaves your application.
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Get the authentication token from where it's stored (e.g., localStorage, Zustand store)
    const token = localStorage.getItem("authToken"); // Or from your Zustand store: useAuthStore.getState().token;

    // 2. If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Return the modified config
    return config;
  },
  (error) => {
    // Handle request errors here (e.g., network issues)
    return Promise.reject(error);
  }
);

// --- Response Interceptor (Optional, but good practice for error handling) ---
// This interceptor will be called AFTER the response is received but BEFORE it's returned to your component.
axiosInstance.interceptors.response.use(
  (response) => {
    // You can inspect/transform successful responses here if needed
    return response;
  },
  (error) => {
    // Handle response errors here (e.g., 401 Unauthorized, 403 Forbidden, 500 Internal Server Error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized: Redirect to login or refresh token
          console.error("Unauthorized request. Redirecting to login...");
          // Example: window.location.href = '/login';
          break;
        case 403:
          // Forbidden: Show a specific message
          console.error("Access forbidden.");
          break;
        case 404:
          // Not Found
          console.error("Resource not found.");
          break;
        case 500:
          // Server Error
          console.error("Server error occurred.");
          break;
        default:
          // Handle other errors
          console.error(
            `API Error: ${error.response.status} - ${
              error.response.data.message || error.message
            }`
          );
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network down)
      console.error(
        "No response received from server. Please check your network connection."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error); // Re-throw the error so it can be caught by the calling code
  }
);
