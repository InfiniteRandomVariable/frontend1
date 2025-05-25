import Image from "next/image"
import Link from "next/link"
import type { Category } from "@/lib/types"

interface CategorySectionProps {
  title: string
  categories: Category[]
  actionLabel?: string
  actionUrl?: string
}

export function CategorySection({
  title,
  categories,
  actionLabel = "See more",
  actionUrl = "#",
}: CategorySectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`} className="block">
            <div className="bg-gradient-to-br from-sky-100 to-sky-50 rounded-lg p-4 h-full">
              <div className="aspect-square relative mb-2 flex items-center justify-center">
                <Image
                  src={category.imageUrl || "/placeholder.svg"}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-medium">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <Link href={actionUrl} className="text-blue-600 font-medium hover:underline">
          {actionLabel}
        </Link>
      </div>
    </section>
  )
}
