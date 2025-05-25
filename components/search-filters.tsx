"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export function SearchFilters({
  selectedCategory,
  selectedRating,
}: {
  selectedCategory?: string
  selectedRating?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`/search?${params.toString()}`)
  }

  const categories = [
    { id: "over-ear", name: "Over-ear" },
    { id: "kids", name: "Kids" },
    { id: "iphone", name: "iPhone" },
    { id: "bone-conduction", name: "Bone Conduction" },
    { id: "studio", name: "Studio" },
  ]

  const ratings = [
    { id: "4", name: "4 & Up" },
    { id: "3", name: "3 & Up" },
    { id: "2", name: "2 & Up" },
    { id: "1", name: "1 & Up" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant="outline"
          className={`whitespace-nowrap ${selectedRating === "4" ? "bg-gray-100" : ""}`}
          onClick={() => updateFilters("rating", "4")}
        >
          <div className="flex items-center">
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <Star className="h-4 w-4 text-gray-300" />
            <span className="ml-1">& Up</span>
          </div>
        </Button>

        <Button variant="outline" className="whitespace-nowrap" onClick={() => updateFilters("discount", "true")}>
          All Discounts
        </Button>

        <Button variant="outline" className="whitespace-nowrap" onClick={() => updateFilters("sort", "price-asc")}>
          Price: Low to High
        </Button>

        <Button variant="outline" className="whitespace-nowrap flex items-center gap-1">
          Filters
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            className={`whitespace-nowrap ${selectedCategory === category.id ? "bg-gray-100" : ""}`}
            onClick={() => updateFilters("category", category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
