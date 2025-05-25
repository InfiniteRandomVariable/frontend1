import { Suspense } from "react";
import LandingPage from "@/app/(landing)/landing-page";
import { Skeleton } from "@/components/ui/skeleton";
import CategorySection from "@/components/category-section";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductCategories from "@/components/product-categories";
import { CategoryButton } from "@/components/category-button";
import {
  pcCategories,
  electronicsCategories,
  fitnessCategories,
} from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 pb-8">
        <Suspense
          fallback={
            <div className="p-12">
              <Skeleton className="h-[800px] w-full" />
            </div>
          }
        >
          <LandingPage />
        </Suspense>

        <div className="mt-4">
          <div className="flex overflow-x-auto gap-4 py-2 -mx-4 px-4 mb-6 scrollbar-hide">
            <CategoryButton icon="smartphone" label="Android" />
            <CategoryButton icon="smartphone-charging" label="iPhone" />
            <CategoryButton icon="laptop" label="Laptops" />
            <CategoryButton icon="headphones" label="Audio" />
            <CategoryButton icon="gamepad-2" label="Gaming" />
            <CategoryButton icon="tv" label="TVs" />
          </div>
        </div>

        <Suspense fallback={<CategorySectionSkeleton />}>
          <CategorySection
            title="Score the top PCs & Accessories"
            categories={pcCategories}
            actionLabel="See more"
            actionUrl="/category/computers"
          />
        </Suspense>

        <Suspense fallback={<CategorySectionSkeleton />}>
          <CategorySection
            title="Plug in with our electronics"
            categories={electronicsCategories}
            actionLabel="Shop more"
            actionUrl="/category/electronics"
          />
        </Suspense>

        <Suspense fallback={<CategorySectionSkeleton />}>
          <CategorySection
            title="Gear up to get fit"
            categories={fitnessCategories}
            actionLabel="View all"
            actionUrl="/category/fitness"
          />
        </Suspense>

        <div className="mt-8 bg-red-600 rounded-lg p-6 text-white">
          <h2 className="text-3xl font-bold mb-4">Free Shipping Zone</h2>
          <div className="grid grid-cols-2 gap-4">
            <ProductCategories />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CategorySectionSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
