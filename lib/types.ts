export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  originalCurrency?: string;
  imageUrl: string;
  images?: string[];
  category: string;
  condition: string;
  shipping?: number;
  estimatedDelivery?: string;
  badge?: string;
  colors?: string[];
  storage?: string[];
  watchers?: number;
  description?: string;
  seller?: {
    name: string;
    rating: number;
    feedbackCount: number;
  };
}
export interface AuthResponse {
  token: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  href: string;
}

export interface Review {
  title: string;
  rating: number;
  date: string;
  content: string;
  reviewer: string;
}

export interface Arbiter {
  id: number;
  name: string;
  title: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  jobSuccess: number;
  hourlyRate: number;
  totalResolvedDisputes: number;
  totalHours: number;
  totalEarned: number;
  location: string;
  localTime: string;
  isAvailable: boolean;
  isVerified: boolean;
  description: string;
  skills: string[];
  buyerReviews: Review[];
  sellerReviews: Review[];
}

export interface ArbiterApiResponse {
  arbiterName: string;
  arbiterUserIdFk: number;
  overallRating: number | null;
  pinBuyerReview: string | null;
  pinSellerReview: string | null;
  totalResolvedDisputes: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Authentication types
export interface User {
  uName: string;
  email: string;
  userRole: "BUYER" | "SELLER" | "ARBITER";
  token: string;
}

export interface LoginRequest {
  uName: string;
  email: string;
  password: string;
  userRole: "BUYER" | "SELLER" | "ARBITER";
}

export interface RegisterRequest {
  uName: string;
  email: string;
  password: string;
  userRole: "BUYER" | "SELLER" | "ARBITER";
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    uName: string;
    email: string;
    userRole: "BUYER" | "SELLER" | "ARBITER";
  };
}

// Purchase flow types
export interface PurchaseData {
  product: Product;
  selectedArbiters: Arbiter[];
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

export interface PurchaseOfferRequest {
  phoneIdFk: number;
  arbiter1UserIdFk: number | null;
  arbiter2UserIdFk: number | null;
  arbiter3UserIdFk: number | null;
  arbiter4UserIdFk: number | null;
  arbiter5UserIdFk: number | null;
  arbiter6UserIdFk: number | null;
}

export interface PurchaseOfferResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}
