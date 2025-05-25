import { Suspense } from "react"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import CheckoutContent from "./components/checkout-content"

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { productId?: string; quantity?: string }
}) {
  const productId = searchParams.productId
  const quantity = searchParams.quantity ? Number.parseInt(searchParams.quantity) : 1

  if (!productId) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutContent productId={productId} quantity={quantity} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  )
}
