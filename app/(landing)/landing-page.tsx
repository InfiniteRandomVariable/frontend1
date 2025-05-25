import Footer from "@/components/footer";
import { CategorySection } from "@/app/(landing)/components/category-section";
import { CategoryButtons } from "@/app/(landing)/components/category-buttons";
import { FreeShippingZone } from "@/app/(landing)/components/free-shipping-zone";
import {
  pcCategories,
  electronicsCategories,
  fitnessCategories,
  homeCategories,
  fashionCategories,
} from "@/lib/data";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 container mx-auto px-4 pb-8">
        <div className="mt-4">
          <CategoryButtons />
        </div>

        <CategorySection
          title="Score the top PCs & Accessories"
          categories={pcCategories}
          actionLabel="See more"
          actionUrl="/category/computers"
        />

        <CategorySection
          title="Plug in with our electronics"
          categories={electronicsCategories}
          actionLabel="Shop more"
          actionUrl="/category/electronics"
        />

        <CategorySection
          title="Gear up to get fit"
          categories={fitnessCategories}
          actionLabel="View all"
          actionUrl="/category/fitness"
        />

        <CategorySection
          title="Home & Living Essentials"
          categories={homeCategories}
          actionLabel="Explore more"
          actionUrl="/category/home"
        />

        <CategorySection
          title="Fashion & Accessories"
          categories={fashionCategories}
          actionLabel="View collection"
          actionUrl="/category/fashion"
        />

        <FreeShippingZone />
      </main>
      <Footer />
    </div>
  );
}
