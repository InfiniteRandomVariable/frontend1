import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import ArbiterSelectionContent from "./components/arbiter-selection-content";

export default function ArbiterSelectionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Suspense fallback={<ArbiterSelectionSkeleton />}>
          <ArbiterSelectionContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function ArbiterSelectionSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border flex gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
