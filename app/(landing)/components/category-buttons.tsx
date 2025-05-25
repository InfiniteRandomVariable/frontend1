"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CategoryButton } from "@/components/category-button"

export function CategoryButtons() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = 200

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="relative mb-6">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-md border-gray-200 hidden md:flex"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div
        ref={scrollContainerRef}
        className={cn(
          "flex overflow-x-auto gap-4 py-2 px-4 scrollbar-hide",
          "md:px-10", // Add padding on medium screens to account for scroll buttons
        )}
      >
        <CategoryButton icon="smartphone" label="Android" />
        <CategoryButton icon="smartphone-charging" label="iPhone" />
        <CategoryButton icon="laptop" label="Laptops" />
        <CategoryButton icon="headphones" label="Audio" />
        <CategoryButton icon="gamepad-2" label="Gaming" />
        <CategoryButton icon="tv" label="TVs" />
        <CategoryButton icon="refrigerator" label="Kitchen Appliance" />
        <CategoryButton icon="lamp" label="Home Appliance" />
        <CategoryButton icon="toy" label="Toys" />
        <CategoryButton icon="flower" label="Plants" />
        <CategoryButton icon="sofa" label="Furniture" />
        <CategoryButton icon="gem" label="Jewelry" />
        <CategoryButton icon="shirt" label="Clothes" />
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-md border-gray-200 hidden md:flex"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
