"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import { Heart, Search, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useMutation } from "@tanstack/react-query"
import { watchlistApi } from "@/lib/api-client"

export default function WatchlistContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"recently-added" | "price-high" | "price-low">("recently-added")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Fetch watchlist from API
  const {
    data: watchlist = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => watchlistApi.getWatchlist(),
  })

  // Remove from watchlist mutation
  const removeFromWatchlistMutation = useMutation({
    mutationFn: (productId: number) => watchlistApi.removeFromWatchlist(productId),
    onSuccess: () => {
      refetch() // Refetch watchlist after successful removal
      toast({
        title: "Removed from watchlist",
        description: "The item has been removed from your watchlist.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Get unique categories from watchlist
  const categories = ["all", ...new Set(watchlist.map((item) => item.category))]

  // Filter watchlist based on search query and category
  const filteredWatchlist = watchlist.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort watchlist based on sort order
  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    if (sortOrder === "price-high") {
      return b.price - a.price
    } else if (sortOrder === "price-low") {
      return a.price - b.price
    }
    // Default: recently added (no sort needed as the array is already in order of addition)
    return 0
  })

  const handleRemoveFromWatchlist = (productId: number) => {
    removeFromWatchlistMutation.mutate(productId)
  }

  if (isLoading) {
    return <div>Loading watchlist...</div>
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
        <p className="text-gray-500 mb-6">You don't have any items in your watchlist yet.</p>
        <Link href="/">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">My eBay - Watchlist ({watchlist.length})</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input
              type="search"
              placeholder="Search your Watchlist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
          <Button>Search</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm h-9">
            Add to custom list
          </Button>
          <Button variant="outline" className="text-sm h-9">
            Delete
          </Button>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Status:</span>
            <Select value="all" onValueChange={() => {}}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({watchlist.length})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Sort:</span>
            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Recently added" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recently-added">Recently added</SelectItem>
                <SelectItem value="price-high">Price: high to low</SelectItem>
                <SelectItem value="price-low">Price: low to high</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="whitespace-nowrap"
            onClick={() => setSelectedCategory(category)}
          >
            {category === "all" ? "All Categories" : category} (
            {category === "all" ? watchlist.length : watchlist.filter((item) => item.category === category).length})
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedWatchlist.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg border">
            <div className="flex gap-4">
              <Link href={`/product/${product.id}`} className="flex-shrink-0">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="object-contain h-32 w-32"
                />
              </Link>
              <div className="flex-1">
                <Link href={`/product/${product.id}`} className="hover:underline">
                  <h2 className="font-medium line-clamp-2">{product.name}</h2>
                </Link>
                <p className="text-sm text-gray-500 mb-2">
                  {product.condition} · {product.seller.name}
                </p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/product/${product.id}`} className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Buy It Now</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveFromWatchlist(product.id)}
                    disabled={removeFromWatchlistMutation.isPending}
                  >
                    <Heart className="h-5 w-5 fill-red-600" />
                    <span className="sr-only">Remove from watchlist</span>
                  </Button>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {product.watchers || 0} watching · {product.seller.feedback}% positive feedback
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedWatchlist.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg border">
          <p className="text-gray-500">No items match your search criteria.</p>
        </div>
      )}
    </div>
  )
}
