import Image from "next/image"
import Link from "next/link"

export function FreeShippingZone() {
  const products = [
    {
      id: 1,
      name: "Color Swatches",
      imageUrl: "/placeholder.svg?height=200&width=200",
      url: "/category/home-decor",
    },
    {
      id: 2,
      name: "Screen Protectors",
      imageUrl: "/placeholder.svg?height=200&width=200",
      url: "/category/phone-accessories",
    },
    {
      id: 3,
      name: "Smart Watches",
      imageUrl: "/placeholder.svg?height=200&width=200",
      url: "/category/wearables",
    },
    {
      id: 4,
      name: "Headphones",
      imageUrl: "/placeholder.svg?height=200&width=200",
      url: "/category/audio",
    },
  ]

  return (
    <div className="mt-8 bg-red-600 rounded-lg p-6 text-white">
      <h2 className="text-3xl font-bold mb-4">Free Shipping Zone</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
          <Link key={product.id} href={product.url}>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-2 flex items-center justify-center">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-contain h-32"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
