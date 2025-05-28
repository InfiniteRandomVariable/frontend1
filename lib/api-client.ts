import axios, { type AxiosResponse } from "axios";
import { mockApi } from "./mock-api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Product,
  Arbiter,
  Category,
  ArbiterApiResponse,
  PaginatedResponse,
  PaginationParams,
  PurchaseOfferRequest,
  PurchaseOfferResponse,
} from "./types";
import {
  transformArbitersFromApi,
  transformArbiterFromApi,
} from "./transformers/arbiter-transformer";
import { iphone14Products } from "./mock-data/products";

// Determine if we're in development/preview mode
const isDevelopment = process.env.NODE_ENV === "development";
const isPreview = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";
const useMockApi = isDevelopment || isPreview;

// Base URL for the Express backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or Zustand store
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// API client that handles all communication with the backend
export const apiClient = {
  // Authentication API calls
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (useMockApi) {
      // Mock login for development - only return token
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        token: "mock_token_" + Date.now(),
      };
    }

    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        "/api/users/login",
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    if (useMockApi) {
      // Mock registration for development - only return token
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        token: "mock_token_" + Date.now(),
      };
    }

    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        "/api/users/register",
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed. Please try again.");
    }
  },

  // Purchase flow API calls
  async createPurchaseOffer(
    offerData: PurchaseOfferRequest
  ): Promise<PurchaseOfferResponse> {
    if (useMockApi) {
      // Mock purchase offer for development
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        orderId: "ORD" + Date.now(),
        message: "Purchase offer created successfully",
      };
    }

    try {
      const response: AxiosResponse<PurchaseOfferResponse> =
        await axiosInstance.post("/api/trades/purchaseoffer/make", offerData);
      return response.data;
    } catch (error) {
      console.error("Purchase offer error:", error);
      throw new Error("Failed to create purchase offer. Please try again.");
    }
  },

  // Product-related API calls
  async getProducts(): Promise<Product[]> {
    if (useMockApi) {
      return mockApi.getProducts();
    }

    try {
      const response: AxiosResponse<Product[]> = await axiosInstance.get(
        "/api/products"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  },

  async getProductById(id: string | number): Promise<Product> {
    // Always try mock API first for development
    if (useMockApi) {
      try {
        return await mockApi.getProductById(id);
      } catch (error) {
        console.error(`Product ${id} not found in mock data:`, error);
        throw new Error(`Product with ID ${id} not found`);
      }
    }

    try {
      const response: AxiosResponse<Product> = await axiosInstance.get(
        `/api/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      // Fallback to mock data if API fails
      try {
        return await mockApi.getProductById(id);
      } catch (mockError) {
        throw new Error(`Failed to fetch product with ID ${id}`);
      }
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    // Check if the search query is for iPhone 14 - use mock data
    const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");
    if (
      normalizedQuery.includes("iphone14") ||
      normalizedQuery.includes("iphone 14")
    ) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return iphone14Products;
    }

    if (useMockApi) {
      return mockApi.searchProducts(query);
    }

    try {
      const response: AxiosResponse<Product[]> = await axiosInstance.get(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      // Fallback to mock search
      return mockApi.searchProducts(query);
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (useMockApi) {
      return mockApi.getProductsByCategory(category);
    }

    try {
      const response: AxiosResponse<Product[]> = await axiosInstance.get(
        `/api/products?category=${encodeURIComponent(category)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching products for category "${category}":`,
        error
      );
      throw new Error(`Failed to fetch products for category: ${category}`);
    }
  },

  // Category-related API calls
  async getCategories(): Promise<Category[]> {
    if (useMockApi) {
      return mockApi.getCategories();
    }

    try {
      const response: AxiosResponse<Category[]> = await axiosInstance.get(
        "/api/categories"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
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

    try {
      const response: AxiosResponse<ArbiterApiResponse[]> =
        await axiosInstance.get(
          `/api/arbiters/paginated?page=${params.page}&pageSize=${params.pageSize}`
        );
      const apiArbiters = response.data;

      // Transform API response to UI-friendly format
      const transformedArbiters = transformArbitersFromApi(apiArbiters);

      // Since the API doesn't return pagination metadata, we'll estimate it
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
    } catch (error) {
      console.error("Error fetching arbiters:", error);
      // Fallback to mock data on error
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
  },

  async getArbiterById(id: string | number): Promise<Arbiter> {
    if (useMockApi) {
      return mockApi.getArbiterById(id);
    }

    try {
      const response: AxiosResponse<ArbiterApiResponse> =
        await axiosInstance.get(`/api/arbiters/${id}`);
      return transformArbiterFromApi(response.data);
    } catch (error) {
      console.error(`Error fetching arbiter ${id}:`, error);
      throw new Error(`Failed to fetch arbiter with ID ${id}`);
    }
  },

  // Watchlist-related API calls
  async getWatchlist(): Promise<Product[]> {
    if (useMockApi) {
      return mockApi.getWatchlist();
    }

    try {
      const response: AxiosResponse<Product[]> = await axiosInstance.get(
        "/api/watchlist"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      throw new Error("Failed to fetch watchlist");
    }
  },

  async addToWatchlist(productId: number): Promise<{ success: boolean }> {
    if (useMockApi) {
      return mockApi.addToWatchlist(productId);
    }

    try {
      const response: AxiosResponse<{ success: boolean }> =
        await axiosInstance.post("/api/watchlist", { productId });
      return response.data;
    } catch (error) {
      console.error(`Error adding product ${productId} to watchlist:`, error);
      throw new Error(`Failed to add product ${productId} to watchlist`);
    }
  },

  async removeFromWatchlist(productId: number): Promise<{ success: boolean }> {
    if (useMockApi) {
      return mockApi.removeFromWatchlist(productId);
    }

    try {
      const response: AxiosResponse<{ success: boolean }> =
        await axiosInstance.delete(`/api/watchlist/${productId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error removing product ${productId} from watchlist:`,
        error
      );
      throw new Error(`Failed to remove product ${productId} from watchlist`);
    }
  },

  // Checkout-related API calls
  async createOrder(orderData: any): Promise<{ orderId: string }> {
    if (useMockApi) {
      return mockApi.createOrder(orderData);
    }

    try {
      const response: AxiosResponse<{ orderId: string }> =
        await axiosInstance.post("/api/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  },

  // Arbiter selection API calls
  async selectArbiters(arbiterIds: number[]): Promise<{ success: boolean }> {
    if (useMockApi) {
      return mockApi.selectArbiters(arbiterIds);
    }

    try {
      const response: AxiosResponse<{ success: boolean }> =
        await axiosInstance.post("/api/arbiters/select", {
          arbiterIds,
        });
      return response.data;
    } catch (error) {
      console.error("Error selecting arbiters:", error);
      throw new Error("Failed to select arbiters");
    }
  },
  // Purchase flow API calls
  async makePurchaseOffer(
    offerData: PurchaseOfferRequest
  ): Promise<PurchaseOfferResponse> {
    console.log("makePurchaseOffer called with:", offerData);

    if (useMockApi) {
      // Mock purchase offer for development
      console.log("Using mock API for purchase offer");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        orderId: "ORD" + Date.now(),
        message: "Purchase offer created successfully",
      };
    }

    try {
      console.log("Making real API call to /api/trades/purchaseoffer/make");
      const response: AxiosResponse<PurchaseOfferResponse> =
        await axiosInstance.post("/api/trades/purchaseoffer/make", offerData);
      console.log("Purchase offer API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Purchase offer error:", error);
      throw new Error("Failed to create purchase offer. Please try again.");
    }
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

export default apiClient;

// import axios, { type AxiosInstance, type AxiosResponse } from "axios";
// import { mockApi } from "./mock-api";
// import type {
//   LoginRequest,
//   RegisterRequest,
//   AuthResponse,
//   Product,
//   Arbiter,
//   ArbiterApiResponse,
//   PaginatedResponse,
//   PaginationParams,
//   PurchaseOfferRequest,
//   PurchaseOfferResponse,
// } from "./types";
// import { iphone14Products } from "./mock-data/products";

// const isDevelopment = process.env.NODE_ENV === "development";
// const isPreview = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";
// const useMockApi = isDevelopment || isPreview;

// class ApiClient {
//   private client: AxiosInstance;

//   constructor() {
//     this.client = axios.create({
//       baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
//       timeout: 10000,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // Request interceptor to add auth token
//     this.client.interceptors.request.use(
//       (config) => {
//         if (typeof window !== "undefined") {
//           const token = localStorage.getItem("auth_token");
//           if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//           }
//         }
//         return config;
//       },
//       (error) => {
//         return Promise.reject(error);
//       }
//     );

//     // Response interceptor for error handling
//     this.client.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401) {
//           // Clear token and redirect to login
//           if (typeof window !== "undefined") {
//             localStorage.removeItem("auth_token");
//             window.location.href = "/auth/login";
//           }
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   // Authentication endpoints
//   async login(credentials: LoginRequest): Promise<AuthResponse> {
//     const response: AxiosResponse<AuthResponse> = await this.client.post(
//       "/api/users/login",
//       credentials
//     );
//     return response.data;
//   }

//   async register(userData: RegisterRequest): Promise<AuthResponse> {
//     const response: AxiosResponse<AuthResponse> = await this.client.post(
//       "/api/users/register",
//       userData
//     );
//     return response.data;
//   }

//   // Product endpoints
//   async getProducts(): Promise<Product[]> {
//     const response: AxiosResponse<Product[]> = await this.client.get(
//       "/api/products"
//     );
//     return response.data;
//   }

//   async getProduct(id: number): Promise<Product> {
//     const response: AxiosResponse<Product> = await this.client.get(
//       `/api/products/${id}`
//     );
//     return response.data;
//   }

//   async searchProducts(query: string): Promise<Product[]> {
//     // Check if the search query is for iPhone 14 - use mock data
//     const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");
//     if (
//       normalizedQuery.includes("iphone14") ||
//       normalizedQuery.includes("iphone 14")
//     ) {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       return iphone14Products;
//     }

//     if (useMockApi) {
//       return mockApi.searchProducts(query);
//     }

//     try {
//       const response: AxiosResponse<Product[]> = await this.client.get(
//         `/api/products/search?q=${encodeURIComponent(query)}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error(`Error searching products with query "${query}":`, error);
//       throw new Error(`Failed to search products with query: ${query}`);
//     }
//   }

//   // Arbiter endpoints
//   async getArbiters(
//     params: PaginationParams
//   ): Promise<PaginatedResponse<Arbiter>> {
//     const response: AxiosResponse<ArbiterApiResponse[]> = await this.client.get(
//       "/api/arbiters",
//       {
//         params: {
//           page: params.page,
//           limit: params.pageSize,
//         },
//       }
//     );

//     // Transform API response to match our Arbiter interface
//     const transformedData: Arbiter[] = response.data.map((item) => ({
//       id: item.arbiterUserIdFk,
//       name: item.arbiterName,
//       title: "Professional Arbiter",
//       avatar: "/placeholder.svg?height=64&width=64",
//       rating: item.overallRating || 0,
//       reviewCount: 0,
//       jobSuccess: 95,
//       hourlyRate: 50,
//       totalResolvedDisputes: item.totalResolvedDisputes,
//       totalHours: 1000,
//       totalEarned: 50000,
//       location: "Global",
//       localTime: "Available 24/7",
//       isAvailable: true,
//       isVerified: true,
//       description: "Experienced arbiter specializing in e-commerce disputes.",
//       skills: ["E-commerce", "Dispute Resolution", "Mediation"],
//       buyerReviews: item.pinBuyerReview
//         ? [
//             {
//               title: "Great Experience",
//               rating: 5,
//               date: "2024-01-15",
//               content: item.pinBuyerReview,
//               reviewer: "Anonymous Buyer",
//             },
//           ]
//         : [],
//       sellerReviews: item.pinSellerReview
//         ? [
//             {
//               title: "Professional Service",
//               rating: 5,
//               date: "2024-01-10",
//               content: item.pinSellerReview,
//               reviewer: "Anonymous Seller",
//             },
//           ]
//         : [],
//     }));

//     // Mock pagination for now
//     const pagination = {
//       page: params.page,
//       pageSize: params.pageSize,
//       total: transformedData.length,
//       totalPages: Math.ceil(transformedData.length / params.pageSize),
//       hasNext:
//         params.page < Math.ceil(transformedData.length / params.pageSize),
//       hasPrev: params.page > 1,
//     };

//     return {
//       data: transformedData,
//       pagination,
//     };
//   }

//   // Watchlist endpoints
//   async addToWatchlist(productId: number): Promise<void> {
//     await this.client.post("/api/watchlist", { productId });
//   }

//   async removeFromWatchlist(productId: number): Promise<void> {
//     await this.client.delete(`/api/watchlist/${productId}`);
//   }

//   async getWatchlist(): Promise<Product[]> {
//     const response: AxiosResponse<Product[]> = await this.client.get(
//       "/api/watchlist"
//     );
//     return response.data;
//   }

//   // Purchase endpoints
//   async makePurchaseOffer(
//     request: PurchaseOfferRequest
//   ): Promise<PurchaseOfferResponse> {
//     const response: AxiosResponse<PurchaseOfferResponse> =
//       await this.client.post("/api/trades/purchaseoffer/make", request);
//     return response.data;
//   }
// }

// export const apiClient = new ApiClient();

// import axios from "axios"; // Import Axios
// import { mockApi } from "./mock-api";
// import type {
//   Product,
//   Arbiter,
//   Category,
//   ArbiterApiResponse,
//   PaginationParams,
//   PaginatedResponse,
// } from "./types";
// import {
//   transformArbitersFromApi,
//   transformArbiterFromApi,
// } from "./transformers/arbiter-transformer";

// // Determine if we're in development/preview mode
// const isDevelopment = process.env.NODE_ENV === "development";
// const isPreview = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";
// const useMockApi = isDevelopment || isPreview;

// // Base URL for the Express backend
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // This is equivalent to fetch's credentials: "include" for all requests
//   headers: {
//     "Content-Type": "application/json", // Default content-type for POST/PUT/PATCH
//   },
// });

// // API client that handles all communication with the backend
// export const apiClient = {
//   // Product-related API calls
//   async getProducts(): Promise<Product[]> {
//     if (useMockApi) {
//       return mockApi.getProducts();
//     }

//     const response = await fetch(`${API_URL}/api/products`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch products");
//     }
//     return response.json();
//   },

//   async getProductById(id: string | number): Promise<Product> {
//     if (useMockApi) {
//       return mockApi.getProductById(id);
//     }

//     const response = await fetch(`${API_URL}/api/products/${id}`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch product with ID ${id}`);
//     }
//     return response.json();
//   },

//   async searchProducts(query: string): Promise<Product[]> {
//     if (useMockApi) {
//       return mockApi.searchProducts(query);
//     }

//     const response = await fetch(
//       `${API_URL}/api/products/search?q=${encodeURIComponent(query)}`
//     );
//     if (!response.ok) {
//       throw new Error(`Failed to search products with query: ${query}`);
//     }
//     return response.json();
//   },

//   async getProductsByCategory(category: string): Promise<Product[]> {
//     if (useMockApi) {
//       return mockApi.getProductsByCategory(category);
//     }

//     const response = await fetch(
//       `/api/products?category=${encodeURIComponent(category)}`
//     );
//     if (!response.ok) {
//       throw new Error(`Failed to fetch products for category: ${category}`);
//     }
//     return response.json();
//   },

//   // Category-related API calls
//   async getCategories(): Promise<Category[]> {
//     if (useMockApi) {
//       return mockApi.getCategories();
//     }

//     const response = await fetch(`${API_URL}/api/categories`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch categories");
//     }
//     return response.json();
//   },

//   // Arbiter-related API calls
//   async getArbiters(): Promise<Arbiter[]> {
//     if (useMockApi) {
//       return mockApi.getArbiters();
//     }

//     // Use the paginated endpoint with default pagination
//     const paginatedResult = await this.getArbitersPaginated({
//       page: 1,
//       pageSize: 50,
//     });
//     return paginatedResult.data;
//   },

//   async getArbitersPaginated(
//     params: PaginationParams
//   ): Promise<PaginatedResponse<Arbiter>> {
//     if (false && useMockApi) {
//       // For mock mode, simulate pagination
//       const allArbiters = await mockApi.getArbiters();
//       const startIndex = (params.page - 1) * params.pageSize;
//       const endIndex = startIndex + params.pageSize;
//       const paginatedData = allArbiters.slice(startIndex, endIndex);

//       return {
//         data: paginatedData,
//         pagination: {
//           page: params.page,
//           pageSize: params.pageSize,
//           total: allArbiters.length,
//           totalPages: Math.ceil(allArbiters.length / params.pageSize),
//           hasNext: endIndex < allArbiters.length,
//           hasPrev: params.page > 1,
//         },
//       };
//     }

//     const url = `${API_URL}/api/arbiters/paginated?page=${params.page}&pageSize=${params.pageSize}`;

//     const usingOldCode = false;
//     let apiArbiters: ArbiterApiResponse[];
//     if (usingOldCode) {
//       const response = await fetch(url);
//       console.log("calling api from api client");
//       if (!response.ok) {
//         throw new Error(`Failed to fetch arbiters: ${response.statusText}`);
//       }

//       apiArbiters = await response.json();
//     } else {
//       const response = await axiosInstance.get<ArbiterApiResponse[]>(
//         `${API_URL}/api/arbiters/paginated`,
//         { params: { page: params.page, pageSize: params.pageSize } } // Axios handles query params nicely
//       );
//       console.log("calling api from api client");
//       apiArbiters = response.data;
//     }
//     //new code

//     //Old code

//     // Transform API response to UI-friendly format
//     const transformedArbiters = transformArbitersFromApi(apiArbiters);

//     // Since the API doesn't return pagination metadata, we'll estimate it
//     // In a real implementation, the API should return this information
//     const estimatedTotal =
//       apiArbiters.length === params.pageSize
//         ? params.page * params.pageSize + 1
//         : (params.page - 1) * params.pageSize + apiArbiters.length;

//     return {
//       data: transformedArbiters,
//       pagination: {
//         page: params.page,
//         pageSize: params.pageSize,
//         total: estimatedTotal,
//         totalPages: Math.ceil(estimatedTotal / params.pageSize),
//         hasNext: apiArbiters.length === params.pageSize,
//         hasPrev: params.page > 1,
//       },
//     };
//   },

//   async getArbiterById(id: string | number): Promise<Arbiter> {
//     if (useMockApi) {
//       return mockApi.getArbiterById(id);
//     }

//     const response = await fetch(`${API_URL}/api/arbiters/${id}`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch arbiter with ID ${id}`);
//     }

//     const apiArbiter: ArbiterApiResponse = await response.json();
//     return transformArbiterFromApi(apiArbiter);
//   },

//   // Watchlist-related API calls
//   async getWatchlist(): Promise<Product[]> {
//     if (useMockApi) {
//       return mockApi.getWatchlist();
//     }

//     const response = await fetch(`${API_URL}/api/watchlist`, {
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error("Failed to fetch watchlist");
//     }
//     return response.json();
//   },

//   async addToWatchlist(productId: number): Promise<{ success: boolean }> {
//     if (useMockApi) {
//       return mockApi.addToWatchlist(productId);
//     }

//     const response = await fetch(`${API_URL}/api/watchlist`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ productId }),
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error(`Failed to add product ${productId} to watchlist`);
//     }
//     return response.json();
//   },

//   async removeFromWatchlist(productId: number): Promise<{ success: boolean }> {
//     if (useMockApi) {
//       return mockApi.removeFromWatchlist(productId);
//     }

//     const response = await fetch(`${API_URL}/api/watchlist/${productId}`, {
//       method: "DELETE",
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error(`Failed to remove product ${productId} from watchlist`);
//     }
//     return response.json();
//   },

//   // Checkout-related API calls
//   async createOrder(orderData: any): Promise<{ orderId: string }> {
//     if (useMockApi) {
//       return mockApi.createOrder(orderData);
//     }

//     const response = await fetch(`${API_URL}/api/orders`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(orderData),
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error("Failed to create order");
//     }
//     return response.json();
//   },

//   // Arbiter selection API calls
//   async selectArbiters(arbiterIds: number[]): Promise<{ success: boolean }> {
//     if (useMockApi) {
//       return mockApi.selectArbiters(arbiterIds);
//     }

//     const response = await fetch(`${API_URL}/api/arbiters/select`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ arbiterIds }),
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error("Failed to select arbiters");
//     }
//     return response.json();
//   },

//   async getRandomArbiters(count = 6): Promise<Arbiter[]> {
//     if (useMockApi) {
//       return mockApi.getRandomArbiters(count);
//     }

//     // For random arbiters, we can use the paginated endpoint and shuffle the results
//     const paginatedResult = await this.getArbitersPaginated({
//       page: 1,
//       pageSize: count * 2,
//     });
//     const shuffled = paginatedResult.data.sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, count);
//   },
// };

// // --- Request Interceptor ---
// // This interceptor will be called BEFORE every request leaves your application.
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // 1. Get the authentication token from where it's stored (e.g., localStorage, Zustand store)
//     const token = localStorage.getItem("authToken"); // Or from your Zustand store: useAuthStore.getState().token;

//     // 2. If a token exists, attach it to the Authorization header
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // 3. Return the modified config
//     return config;
//   },
//   (error) => {
//     // Handle request errors here (e.g., network issues)
//     return Promise.reject(error);
//   }
// );

// // --- Response Interceptor (Optional, but good practice for error handling) ---
// // This interceptor will be called AFTER the response is received but BEFORE it's returned to your component.
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // You can inspect/transform successful responses here if needed
//     return response;
//   },
//   (error) => {
//     // Handle response errors here (e.g., 401 Unauthorized, 403 Forbidden, 500 Internal Server Error)
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // Unauthorized: Redirect to login or refresh token
//           console.error("Unauthorized request. Redirecting to login...");
//           // Example: window.location.href = '/login';
//           break;
//         case 403:
//           // Forbidden: Show a specific message
//           console.error("Access forbidden.");
//           break;
//         case 404:
//           // Not Found
//           console.error("Resource not found.");
//           break;
//         case 500:
//           // Server Error
//           console.error("Server error occurred.");
//           break;
//         default:
//           // Handle other errors
//           console.error(
//             `API Error: ${error.response.status} - ${
//               error.response.data.message || error.message
//             }`
//           );
//       }
//     } else if (error.request) {
//       // The request was made but no response was received (e.g., network down)
//       console.error(
//         "No response received from server. Please check your network connection."
//       );
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error("Error setting up request:", error.message);
//     }
//     return Promise.reject(error); // Re-throw the error so it can be caught by the calling code
//   }
// );
