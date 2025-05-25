"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star, StarHalf, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

export default function ProductDetails({ product }: { product: Product }) {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null)
  const [mainImage, setMainImage] = useState(product.imageUrl)

  const handleAddToCart = () => {
    // In a real app, this would add the product to the cart
    // For now, we'll just show an alert
    alert(`Added ${product.name} to cart!`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="bg-white p-6 rounded-lg">
        <div className="relative aspect-square mb-4 flex items-center justify-center">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="object-contain max-h-full"
          />
          {product.badge && <Badge className="absolute top-2 left-2 bg-orange-500">{product.badge}</Badge>}
        </div>

        {product.images && (
          <div className="grid grid-cols-4 gap-2">
            {[product.imageUrl, ...product.images].map((img, index) => (
              <button
                key={index}
                className={`border rounded-md p-1 ${mainImage === img ? "border-orange-500" : "border-gray-200"}`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-contain h-16 w-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        {product.brand && <div className="text-sm text-gray-500 mb-1">Featured from {product.brand}</div>}

        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

        <div className="flex items-center mb-2">
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

        {product.purchases && <div className="text-sm mb-4">{product.purchases} bought in past month</div>}

        <div className="mb-4">
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">List: {formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {product.freeDelivery && (
          <div className="mb-4">
            <div className="font-semibold">FREE delivery</div>
            <div>{product.deliveryDate} to United States</div>
          </div>
        )}

        {product.features && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">About this item:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {product.features.map((feature, index) => (
                <li key={index} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.sustainability && (
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <Leaf className="h-5 w-5" />
            <span>{product.sustainability} sustainability feature</span>
          </div>
        )}

        {product.colors && (
          <div className="mb-6">
            <div className="font-semibold mb-2">Color: {selectedColor}</div>
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full border ${
                    selectedColor === color ? "border-orange-500 ring-2 ring-orange-300" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-full mb-3"
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>

        <Button
          variant="outline"
          className="w-full border-gray-300 py-3 rounded-full"
          onClick={() => router.push("/checkout")}
        >
          Buy now
        </Button>
      </div>
    </div>
  )
}
