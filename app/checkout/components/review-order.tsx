import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ReviewOrderProps {
  product: Product
  quantity: number
  compact?: boolean
}

export function ReviewOrder({ product, quantity, compact = false }: ReviewOrderProps) {
  // Mock delivery dates
  const deliveryStart = new Date()
  deliveryStart.setDate(deliveryStart.getDate() + 14)
  const deliveryEnd = new Date()
  deliveryEnd.setDate(deliveryEnd.getDate() + 28)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (compact) {
    return (
      <div className="bg-white rounded-md p-4 border mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            width={80}
            height={80}
            className="object-contain"
          />
          <div>
            <h3 className="font-medium line-clamp-2">{product.name}</h3>
            <div className="text-sm text-gray-500">Quantity: {quantity}</div>
            <div className="font-semibold">{formatPrice(product.price)}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-md p-6 border">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Ship to</h2>
        <div className="text-sm">
          <p>DISCOVERY BAY, LANTAU ISLAND, HK 00000, Hong Kong</p>
          <p>61124032</p>
          <button className="text-blue-600 mt-2">Change</button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Review order</h2>

        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Image
                src={product.seller.imageUrl || "/placeholder.svg?height=40&width=40"}
                alt={product.seller.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="font-semibold">{product.seller.name}</div>
            <div className="text-sm text-gray-500">{product.seller.feedback}% positive feedback</div>
            <button className="text-blue-600 text-sm">Add note for seller</button>
          </div>
        </div>

        <div className="flex gap-4 border-b pb-6">
          <div className="flex-shrink-0 w-24">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{product.name}</h3>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="mt-4">
              <div className="text-sm mb-2">Quantity</div>
              <Select defaultValue={quantity.toString()}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 text-sm">Returns accepted</div>

            <div className="mt-4">
              <div className="font-semibold">Delivery</div>
              <div className="text-sm">
                Est. delivery: {formatDate(deliveryStart)} - {formatDate(deliveryEnd)}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{formatPrice(product.shipping || 4.25)}</span>
                <span className="text-sm">USPS First Class Package International</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-green-600">Save up to 12%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
