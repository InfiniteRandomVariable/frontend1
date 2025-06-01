import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import WatchlistContent from "./components/watchlist-content";

export default function WatchlistPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Suspense fallback={<WatchlistSkeleton />}>
          <WatchlistContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function WatchlistSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border flex gap-4">
            <Skeleton className="h-32 w-32 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
