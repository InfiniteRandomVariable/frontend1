"use client"

import { useSearchParams } from "next/navigation"
import { SearchResults } from "@/components/search-results"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { SearchFilters } from "@/components/search-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const rating = searchParams.get("rating") || ""

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header initialSearchQuery={query} />
      <main className="flex-1 container mx-auto px-4 pb-8">
        <div className="py-4">
          <h1 className="text-xl font-semibold mb-4">Search results for "{query}"</h1>

          <div className="mb-4 overflow-x-auto scrollbar-hide">
            <SearchFilters selectedCategory={category} selectedRating={rating} />
          </div>

          <p className="text-sm text-gray-500 mb-6">Check each product page for other buying options.</p>

          <SearchResults query={query} category={category} rating={rating} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg">
          <Skeleton className="h-48 w-48 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-32 mt-4" />
          </div>
        </div>
      ))}
    </div>
  )
}
