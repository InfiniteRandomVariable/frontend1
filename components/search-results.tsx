"use client"
import Image from "next/image"
import Link from "next/link"
import { useSearchProducts } from "@/hooks/use-products"
import { Star, StarHalf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

export function SearchResults({
  query,
  category,
  rating,
}: {
  query: string
  category?: string
  rating?: string
}) {
  const { data: products, isLoading, isError } = useSearchProducts(query)

  // Filter products based on category and rating
  const filteredProducts = products?.filter((product) => {
    let match = true

    if (category && product.category !== category) {
      match = false
    }

    if (rating && product.rating < Number.parseInt(rating)) {
      match = false
    }

    return match
  })

  if (isLoading) {
    return <p>Loading products...</p>
  }

  if (isError) {
    return <p>Error loading products. Please try again.</p>
  }

  if (!filteredProducts?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No products found</h2>
        <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filteredProducts.map((product) => (
        <div key={product.id} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="w-full md:w-48 h-48 relative">
            <Link href={`/product/${product.id}`}>
              <div className="h-full w-full flex items-center justify-center">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  width={180}
                  height={180}
                  className="object-contain max-h-full"
                />
              </div>
            </Link>
            {product.badge && <Badge className="absolute top-2 left-2 bg-orange-500">{product.badge}</Badge>}
          </div>

          <div className="flex-1">
            <div className="mb-1 text-xs text-gray-500">{product.brand && `Featured from ${product.brand}`}</div>

            <Link href={`/product/${product.id}`} className="hover:underline">
              <h2 className="text-lg font-medium line-clamp-2">{product.name}</h2>
            </Link>

            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400 mr-1">
                {[...Array(5)].map((_, i) => {
                  if (i < Math.floor(product.rating)) {
                    return <Star key={i} className="w-4 h-4 fill-current" />
                  } else if (i === Math.floor(product.rating) && product.rating % 1 >= 0.5) {
                    return <StarHalf key={i} className="w-4 h-4 fill-current" />
                  } else {
                    return <Star key={i} className="w-4 h-4 text-gray-300" />
                  }
                })}
              </div>
              <span className="text-sm">
                {product.rating.toFixed(1)} ({product.reviews.toLocaleString()})
              </span>
            </div>

            <div className="text-sm mt-1">{product.purchases && `${product.purchases} bought in past month`}</div>

            {product.colors && (
              <div className="flex items-center gap-1 mt-2">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-sm text-gray-600">+{product.colors.length - 4}</span>
                )}
              </div>
            )}

            <div className="mt-2">
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {product.freeDelivery && (
              <div className="text-sm mt-1">
                <span className="font-semibold">FREE delivery</span> {product.deliveryDate}
              </div>
            )}

            <div className="mt-4">
              <Link href={`/product/${product.id}`}>
                <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">See options</Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
