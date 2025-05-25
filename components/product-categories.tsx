import Image from "next/image"
import Link from "next/link"

export default function ProductCategories() {
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
    <>
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
    </>
  )
}
