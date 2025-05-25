import type { Category } from "../types"

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Desktops",
    slug: "desktops",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Laptops",
    slug: "laptops",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Hard Drives",
    slug: "hard-drives",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "PC Accessories",
    slug: "pc-accessories",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Headphones",
    slug: "headphones",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Tablets",
    slug: "tablets",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 7,
    name: "Gaming",
    slug: "gaming",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 8,
    name: "Speakers",
    slug: "speakers",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 9,
    name: "Clothing",
    slug: "clothing",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 10,
    name: "Trackers",
    slug: "trackers",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 11,
    name: "Equipment",
    slug: "equipment",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 12,
    name: "Supplements",
    slug: "supplements",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 13,
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 14,
    name: "Home Appliances",
    slug: "home-appliances",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 15,
    name: "Furniture",
    slug: "furniture",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 16,
    name: "Plants & Garden",
    slug: "plants-garden",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 17,
    name: "Clothing",
    slug: "clothing",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 18,
    name: "Jewelry",
    slug: "jewelry",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 19,
    name: "Watches",
    slug: "watches",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 20,
    name: "Shoes",
    slug: "shoes",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
]

export const pcCategories: Category[] = mockCategories.slice(0, 4)
export const electronicsCategories: Category[] = mockCategories.slice(4, 8)
export const fitnessCategories: Category[] = mockCategories.slice(8, 12)
export const homeCategories: Category[] = mockCategories.slice(12, 16)
export const fashionCategories: Category[] = mockCategories.slice(16, 20)
