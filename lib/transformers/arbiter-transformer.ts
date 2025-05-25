import type { ArbiterApiResponse, Arbiter } from "@/lib/types";

// Transform API response to UI-friendly format
export function transformArbiterFromApi(
  apiArbiter: ArbiterApiResponse
): Arbiter {
  // Generate some default values for fields not provided by API
  const defaultSkills = ["Dispute Resolution", "Mediation", "E-commerce"];
  const defaultLocation = "United States";
  const defaultHourlyRate = 50;

  return {
    id: apiArbiter.arbiterUserIdFk,
    name: apiArbiter.arbiterName,
    title: "Professional Arbiter", // Default title
    avatar: `/placeholder.svg?height=64&width=64`, // Default avatar
    rating: apiArbiter.overallRating || 0,
    reviewCount: 0, // Not provided by API, could be calculated separately
    jobSuccess: 95, // Default value, could be calculated from disputes
    hourlyRate: defaultHourlyRate,
    isVerified: apiArbiter.totalResolvedDisputes > 0, // Consider verified if has resolved disputes
    isAvailable: true, // Default to available
    location: defaultLocation,
    localTime: new Date().toLocaleTimeString(),
    totalJobs: apiArbiter.totalResolvedDisputes,
    totalHours: apiArbiter.totalResolvedDisputes * 10, // Estimate 10 hours per dispute
    totalEarned: (
      apiArbiter.totalResolvedDisputes *
      defaultHourlyRate *
      10
    ).toString(),
    skills: defaultSkills,
    description: `Experienced arbiter with ${apiArbiter.totalResolvedDisputes} resolved disputes. Specializes in e-commerce dispute resolution and mediation.`,
    buyerReviews: apiArbiter.pinBuyerReview
      ? [
          {
            title: "Excellent Service",
            rating: 5,
            date: "2024-01-15",
            content: apiArbiter.pinBuyerReview,
            reviewer: "Anonymous Buyer",
          },
        ]
      : [],
    sellerReviews: apiArbiter.pinSellerReview
      ? [
          {
            title: "Professional Handling",
            rating: 5,
            date: "2024-01-10",
            content: apiArbiter.pinSellerReview,
            reviewer: "Anonymous Seller",
          },
        ]
      : [],
    // API-specific fields
    totalResolvedDisputes: apiArbiter.totalResolvedDisputes,
    pinBuyerReview: apiArbiter.pinBuyerReview,
    pinSellerReview: apiArbiter.pinSellerReview,
  };
}

// Transform array of API responses
export function transformArbitersFromApi(
  apiArbiters: ArbiterApiResponse[]
): Arbiter[] {
  return apiArbiters.map(transformArbiterFromApi);
}
