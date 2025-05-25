export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
}

export interface Seller {
  id: number;
  name: string;
  feedback: number;
  joined: string;
  responseTime: string;
  description: string;
  totalFeedback?: string;
  feedbackCount?: string;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  originalCurrency?: string;
  imageUrl: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  purchases?: string;
  badge?: string;
  brand?: string;
  colors?: string[];
  storage?: string[];
  features?: string[];
  freeDelivery?: boolean;
  deliveryDate?: string;
  sustainability?: number;
  description?: string;
  condition?: string;
  conditionDescription?: string;
  sold?: number;
  available?: number;
  itemNumber?: string;
  processor?: string;
  shipping?: number;
  estimatedDelivery?: string;
  watchers?: number;
  seller: Seller;
}

export type PaymentMethod =
  | "paypal"
  | "venmo"
  | "card"
  | "googlepay"
  | "paypalcredit";

export interface Review {
  title: string;
  rating: number;
  date: string;
  content: string;
  reviewer: string;
}

// API Response type for arbiters
export interface ArbiterApiResponse {
  arbiterName: string;
  arbiterUserIdFk: number;
  overallRating: number | null;
  pinBuyerReview: string | null;
  pinSellerReview: string | null;
  totalResolvedDisputes: number;
}

// UI-friendly Arbiter type (transformed from API response)
export interface Arbiter {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  jobSuccess: number;
  hourlyRate: number;
  isVerified: boolean;
  isAvailable: boolean;
  location: string;
  localTime: string;
  totalJobs: number;
  totalHours: number;
  totalEarned: string;
  skills: string[];
  description: string;
  buyerReviews: Review[];
  sellerReviews: Review[];
  // Additional fields from API
  totalResolvedDisputes: number;
  pinBuyerReview: string | null;
  pinSellerReview: string | null;
}

// Pagination types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
