"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import {
  Search,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useArbitersPaginated } from "@/hooks/use-arbiters";
import {
  usePurchaseData,
  useIsAuthenticated,
  useSetSelectedArbiters,
} from "@/lib/store";
import { useCompletePurchase } from "@/hooks/use-purchase";
import type { Arbiter } from "@/lib/types";

export default function ArbiterSelectionContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedArbiters, setLocalSelectedArbiters] = useState<Arbiter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectionMode, setSelectionMode] = useState<"system" | "manual">(
    "system"
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedArbiter, setSelectedArbiter] = useState<Arbiter | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const pageSize = 10;

  // Get purchase data and auth status
  const purchaseData = usePurchaseData();
  const isAuthenticated = useIsAuthenticated();
  const setSelectedArbitersStore = useSetSelectedArbiters();
  const completePurchase = useCompletePurchase();

  // Fetch arbiters with pagination
  const {
    data: paginatedArbiters,
    isLoading,
    error,
    isError,
  } = useArbitersPaginated({ page: currentPage, pageSize });

  // Get arbiters data and pagination info
  const arbiters = paginatedArbiters?.data || [];
  const pagination = paginatedArbiters?.pagination;

  // Filter arbiters based on search query
  const filteredArbiters = arbiters.filter(
    (arbiter) =>
      arbiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arbiter.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Redirect if no purchase data (but not if purchase was just completed)
  useEffect(() => {
    if (!purchaseData && !purchaseCompleted) {
      console.log("No purchase data found, redirecting to home");
      router.push("/");
    }
  }, [purchaseData, router, purchaseCompleted]);

  // Handle system selection
  useEffect(() => {
    if (selectionMode === "system" && arbiters.length > 0) {
      // Select top 6 arbiters by rating
      const topArbiters = [...arbiters]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, Math.min(6, arbiters.length));
      setLocalSelectedArbiters(topArbiters);
    }
  }, [selectionMode, arbiters]);

  // Handle manual selection
  const toggleArbiterSelection = (arbiter: Arbiter) => {
    if (selectionMode === "system") {
      // Switch to manual mode if user manually selects an arbiter
      setSelectionMode("manual");
      setLocalSelectedArbiters([arbiter]);

      toast({
        title: "Manual selection mode",
        description:
          "You've switched to manual selection. Please select 6 arbiters.",
      });
    } else {
      // Check if arbiter is already selected
      const isSelected = selectedArbiters.some((a) => a.id === arbiter.id);

      if (isSelected) {
        // Remove arbiter from selection
        setLocalSelectedArbiters(
          selectedArbiters.filter((a) => a.id !== arbiter.id)
        );
      } else {
        // Add arbiter to selection if less than 6 are selected
        if (selectedArbiters.length < 6) {
          setLocalSelectedArbiters([...selectedArbiters, arbiter]);

          // Show toast with remaining count
          const remaining = 5 - selectedArbiters.length;
          if (remaining > 0) {
            toast({
              title: `Arbiter added`,
              description: `Please select ${remaining} more arbiter${
                remaining === 1 ? "" : "s"
              }.`,
            });
          }
        } else {
          toast({
            title: "Maximum selection reached",
            description:
              "You can only select 6 arbiters. Please remove one to add another.",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Handle system selection button click
  const handleSystemSelection = () => {
    setSelectionMode("system");

    toast({
      title: "System selection mode",
      description: "The system has selected the top 6 arbiters for you.",
    });
  };

  // Handle manual selection button click
  const handleManualSelection = () => {
    setSelectionMode("manual");
    setLocalSelectedArbiters([]);

    toast({
      title: "Manual selection mode",
      description: "Please select 6 arbiters from the list.",
    });
  };

  // Handle confirmation
  const handleConfirmSelection = () => {
    if (
      selectedArbiters.length === 6 ||
      (selectionMode === "system" && selectedArbiters.length > 0)
    ) {
      setShowConfirmation(true);
    } else {
      toast({
        title: "Incomplete selection",
        description: `Please select ${
          6 - selectedArbiters.length
        } more arbiter${selectedArbiters.length === 5 ? "" : "s"}.`,
        variant: "destructive",
      });
    }
  };

  // Handle final confirmation
  const handleFinalConfirmation = async () => {
    console.log("=== Final confirmation clicked ===");
    console.log("Selected arbiters:", selectedArbiters);
    console.log("Is authenticated:", isAuthenticated);
    console.log("Purchase data:", purchaseData);

    setIsProcessing(true);

    try {
      // Update selected arbiters in Zustand store
      setSelectedArbitersStore(selectedArbiters);
      console.log("Updated arbiters in store");

      // Close confirmation dialog
      setShowConfirmation(false);

      // Mark purchase as being completed to prevent redirect
      setPurchaseCompleted(true);

      // Small delay to ensure state updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Complete the purchase and pass the current arbiters directly
      console.log("Calling completePurchase with arbiters:", selectedArbiters);
      completePurchase(selectedArbiters);
    } catch (error) {
      console.error("Error in final confirmation:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setPurchaseCompleted(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open arbiter profile
  const openArbiterProfile = (arbiter: Arbiter) => {
    setSelectedArbiter(arbiter);
    setDialogOpen(true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset search when changing pages
    setSearchQuery("");
  };

  if (!purchaseData && !purchaseCompleted) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No purchase data found. Redirecting...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading arbiters: {error?.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {purchaseData && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Select Arbiters for Your Purchase
          </h1>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">
              Product: {purchaseData.product.name}
            </h3>
            <p className="text-blue-700">
              Price: ${purchaseData.product.price}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Authentication Status:{" "}
              {isAuthenticated ? "✅ Logged in" : "❌ Not logged in"}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border mb-6">
        <p className="mb-4">
          Arbiters will mediate any disputes that may arise between you and the
          seller. You can either let our system select the top 6 arbiters for
          you, or manually select 6 arbiters of your choice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            variant={selectionMode === "system" ? "default" : "outline"}
            className="flex-1"
            onClick={handleSystemSelection}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Let system select for me
          </Button>

          <Button
            variant={selectionMode === "manual" ? "default" : "outline"}
            className="flex-1"
            onClick={handleManualSelection}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            I'll select manually
          </Button>
        </div>

        <div className="relative mb-6">
          <Input
            type="search"
            placeholder="Search arbiters by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {selectionMode === "system"
              ? `System has selected ${selectedArbiters.length} arbiters for you`
              : `${selectedArbiters.length} of 6 arbiters selected`}
          </div>

          <Button
            onClick={handleConfirmSelection}
            disabled={
              (selectionMode === "manual" && selectedArbiters.length < 6) ||
              (selectionMode === "system" && selectedArbiters.length === 0) ||
              isProcessing
            }
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Selection"
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(pageSize)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border animate-pulse"
            >
              <div className="flex gap-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredArbiters.map((arbiter) => {
              const isSelected = selectedArbiters.some(
                (a) => a.id === arbiter.id
              );

              return (
                <div
                  key={arbiter.id}
                  className={`bg-white p-4 rounded-lg border transition-all ${
                    isSelected
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex gap-4">
                    <button
                      className="flex-shrink-0"
                      onClick={() => openArbiterProfile(arbiter)}
                    >
                      <Image
                        src={
                          arbiter.avatar ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={arbiter.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover h-16 w-16"
                      />
                    </button>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <button
                          className="text-left"
                          onClick={() => openArbiterProfile(arbiter)}
                        >
                          <h2 className="font-medium hover:underline">
                            {arbiter.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {arbiter.title}
                          </p>
                        </button>

                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleArbiterSelection(arbiter)}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </div>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-blue-50">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {arbiter.rating > 0 ? arbiter.rating : "New"}
                          </Badge>
                        </div>

                        <div className="text-sm">
                          {arbiter.jobSuccess}% Success
                        </div>

                        <div className="text-sm text-gray-500">
                          {arbiter.totalResolvedDisputes} disputes resolved
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {arbiter.skills.slice(0, 2).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {arbiter.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{arbiter.skills.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              className="mt-8"
            />
          )}
        </>
      )}

      {/* Arbiter Profile Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Arbiter Profile</DialogTitle>
          </DialogHeader>

          {selectedArbiter && (
            <ArbiterProfile
              arbiter={selectedArbiter}
              isSelected={selectedArbiters.some(
                (a) => a.id === selectedArbiter.id
              )}
              onSelect={toggleArbiterSelection}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Arbiter Selection</AlertDialogTitle>
            <AlertDialogDescription>
              These arbiters will mediate your case when the seller and the
              arbiters accept your case. By proceeding, you accept the Terms and
              Conditions of this web service.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {purchaseData && (
            <div className="space-y-4 my-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Purchase Details:</h4>
                <p className="text-sm">Product: {purchaseData.product.name}</p>
                <p className="text-sm">Price: ${purchaseData.product.price}</p>
                <p className="text-sm">Quantity: {purchaseData.quantity}</p>
                <p className="text-sm">
                  Authentication:{" "}
                  {isAuthenticated ? "✅ Logged in" : "❌ Not logged in"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Selected Arbiters:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedArbiters.map((arbiter) => (
                    <div key={arbiter.id} className="flex items-center gap-2">
                      <Image
                        src={
                          arbiter.avatar ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={arbiter.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="text-sm font-medium">{arbiter.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalConfirmation}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "I Accept & Confirm Purchase"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ArbiterProfileProps {
  arbiter: Arbiter;
  isSelected: boolean;
  onSelect: (arbiter: Arbiter) => void;
}

function ArbiterProfile({
  arbiter,
  isSelected,
  onSelect,
}: ArbiterProfileProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          <Image
            src={arbiter.avatar || "/placeholder.svg?height=120&width=120"}
            alt={arbiter.name}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />

          {arbiter.isAvailable && (
            <Badge className="mt-2 w-full justify-center bg-green-100 text-green-800 hover:bg-green-100">
              <Clock className="mr-1 h-3 w-3" /> Available now
            </Badge>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {arbiter.name}
                {arbiter.isVerified && (
                  <Badge className="bg-blue-500">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </h2>
              <p className="text-gray-600">{arbiter.title}</p>

              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {arbiter.location} – {arbiter.localTime} local time
                </span>
              </div>
            </div>

            <Button
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelect(arbiter)}
            >
              {isSelected ? "Selected" : "Select Arbiter"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-blue-50">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                {arbiter.rating > 0 ? arbiter.rating.toFixed(1) : "New"}
              </Badge>
              <span className="text-sm text-gray-500">
                ({arbiter.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-blue-50">
                {arbiter.jobSuccess}% Job Success
              </Badge>
            </div>

            <div className="text-sm">
              <span className="font-semibold">${arbiter.hourlyRate}/hr</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-xl font-bold">
                {arbiter.totalResolvedDisputes}
              </div>
              <div className="text-xs text-gray-500">Disputes resolved</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-xl font-bold">{arbiter.totalHours}</div>
              <div className="text-xs text-gray-500">Total hours</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-xl font-bold">${arbiter.totalEarned}+</div>
              <div className="text-xs text-gray-500">Total earned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">About {arbiter.name}</h3>
        <p className="text-sm">{arbiter.description}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {arbiter.skills.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <Tabs defaultValue="buyer">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="buyer">
              Buyer Reviews ({arbiter.buyerReviews.length})
            </TabsTrigger>
            <TabsTrigger value="seller">
              Seller Reviews ({arbiter.sellerReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buyer" className="space-y-4 mt-4">
            {arbiter.buyerReviews.length > 0 ? (
              arbiter.buyerReviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{review.title}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {review.date}
                  </div>
                  <p className="text-sm">{review.content}</p>
                  <div className="text-sm font-medium mt-2">
                    {review.reviewer}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No buyer reviews yet.</p>
            )}
          </TabsContent>

          <TabsContent value="seller" className="space-y-4 mt-4">
            {arbiter.sellerReviews.length > 0 ? (
              arbiter.sellerReviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{review.title}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {review.date}
                  </div>
                  <p className="text-sm">{review.content}</p>
                  <div className="text-sm font-medium mt-2">
                    {review.reviewer}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No seller reviews yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
