"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductDetails } from "@/hooks/use-products";
import ProductDetails from "@/app/product/[id]/components/product-details";
import ProductAbout from "@/app/product/[id]/components/product-about";
import SellerInfo from "@/app/product/[id]/components/seller-info";

export default function ProductPage() {
  const { id } = useParams();

  const { data: product, isLoading, isError } = useProductDetails(id as string);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <ProductDetailsSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <ProductDetails product={product} />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProductAbout product={product} />
          </div>
          <div>
            <SellerInfo seller={product.seller} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg">
        <Skeleton className="h-80 w-full rounded-md" />
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-16 rounded-md" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        <div className="pt-4">
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
