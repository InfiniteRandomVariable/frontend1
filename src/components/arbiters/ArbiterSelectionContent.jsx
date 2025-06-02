"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Search,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useQuery } from "react-query";

// Add this after the imports
const fetchArbiters = async (page = 1, pageSize = 10) => {
  const response = await fetch(
    `http://localhost:3002/api/arbiters/paginated?page=${page}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch arbiters");
  }
  console.log("calling api from arbiter page fetch");
  return response.json();
};

function ArbiterSelectionContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedArbiters, setSelectedArbiters] = useState([]);
  // Replace the useState for searchQuery with these states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectionMode, setSelectionMode] = useState("system");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedArbiter, setSelectedArbiter] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Add this React Query hook
  const {
    data: arbiters,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["arbiters", currentPage, pageSize],
    () => fetchArbiters(currentPage, pageSize),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  // Replace the filteredArbiters with this
  const filteredArbiters = arbiters
    ? arbiters.filter((arbiter) =>
        arbiter.arbiterName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle system selection
  useEffect(() => {
    if (selectionMode === "system") {
      // Select top 6 arbiters by rating
      // Select top 6 arbiters by rating or resolved disputes
      if (arbiters && arbiters.length > 0) {
        const topArbiters = [...arbiters]
          .sort(
            (a, b) =>
              (b.totalResolvedDisputes || 0) - (a.totalResolvedDisputes || 0)
          )
          .slice(0, 6);
        setSelectedArbiters(topArbiters);
      }
    }
  }, [selectionMode, arbiters]);

  // Handle manual selection
  // Update the toggleArbiterSelection function
  const toggleArbiterSelection = (arbiter) => {
    if (selectionMode === "system") {
      // Switch to manual mode if user manually selects an arbiter
      setSelectionMode("manual");
      setSelectedArbiters([arbiter]);

      toast({
        title: "Manual selection mode",
        description:
          "You've switched to manual selection. Please select 6 arbiters.",
      });
    } else {
      // Check if arbiter is already selected
      const isSelected = selectedArbiters.some(
        (a) => a.arbiterUserIdFk === arbiter.arbiterUserIdFk
      );

      if (isSelected) {
        // Remove arbiter from selection
        setSelectedArbiters(
          selectedArbiters.filter(
            (a) => a.arbiterUserIdFk !== arbiter.arbiterUserIdFk
          )
        );
      } else {
        // Add arbiter to selection if less than 6 are selected
        if (selectedArbiters.length < 6) {
          setSelectedArbiters([...selectedArbiters, arbiter]);

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
  // Update the handleSystemSelection function
  const handleSystemSelection = () => {
    setSelectionMode("system");

    // Select top 6 arbiters by rating or resolved disputes
    if (arbiters && arbiters.length > 0) {
      const topArbiters = [...arbiters]
        .sort(
          (a, b) =>
            (b.totalResolvedDisputes || 0) - (a.totalResolvedDisputes || 0)
        )
        .slice(0, 6);
      setSelectedArbiters(topArbiters);
    }

    toast({
      title: "System selection mode",
      description: "The system has selected the top arbiters for you.",
    });
  };

  // Handle manual selection button click
  const handleManualSelection = () => {
    setSelectionMode("manual");
    setSelectedArbiters([]);

    toast({
      title: "Manual selection mode",
      description: "Please select 6 arbiters from the list.",
    });
  };

  // Handle confirmation
  const handleConfirmSelection = () => {
    if (selectedArbiters.length === 6 || selectionMode === "system") {
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
  const handleFinalConfirmation = () => {
    navigate("/arbiters/confirmation");
  };

  // Open arbiter profile
  // Update the openArbiterProfile function
  const openArbiterProfile = (arbiter) => {
    // Convert API arbiter to UI format
    const formattedArbiter = {
      id: arbiter.arbiterUserIdFk,
      name: arbiter.arbiterName,
      title: "Dispute Resolver",
      avatar: "/placeholder.svg?height=120&width=120",
      rating: arbiter.overallRating || 4.5,
      reviewCount: 0,
      jobSuccess: 100,
      hourlyRate: 20,
      isVerified: true,
      isAvailable: true,
      location: "Remote",
      localTime: new Date().toLocaleTimeString(),
      totalJobs: arbiter.totalResolvedDisputes || 0,
      totalHours: 0,
      totalEarned: "0",
      skills: ["Dispute Resolution", "Mediation", "Arbitration"],
      description:
        "Professional dispute resolver with experience in e-commerce transactions.",
      buyerReviews: arbiter.pinBuyerReview
        ? [JSON.parse(arbiter.pinBuyerReview)]
        : [],
      sellerReviews: arbiter.pinSellerReview
        ? [JSON.parse(arbiter.pinSellerReview)]
        : [],
    };

    setSelectedArbiter(formattedArbiter);
    setDialogOpen(true);
  };

  // Add this before the return statement
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold mb-6">
          Select Arbiters for Your Purchase
        </h1>
        <div className="bg-white p-6 rounded-lg border mb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
            <div className="flex gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold mb-6">
          Select Arbiters for Your Purchase
        </h1>
        <div className="bg-white p-6 rounded-lg border mb-6 text-red-500">
          <p>Error loading arbiters: {error.message}</p>
          <Button onClick={() => {}} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Select Arbiters for Your Purchase
      </h1>

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
              ? "System has selected 6 arbiters for you"
              : `${selectedArbiters.length} of 6 arbiters selected`}
          </div>

          <Button
            onClick={handleConfirmSelection}
            disabled={selectionMode === "manual" && selectedArbiters.length < 6}
          >
            Confirm Selection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArbiters.map((arbiter) => {
          const isSelected = selectedArbiters.some(
            (a) => a.arbiterUserIdFk === arbiter.arbiterUserIdFk
          );

          return (
            <div
              key={arbiter.arbiterUserIdFk}
              className={`bg-white p-4 rounded-lg border ${
                isSelected ? "border-blue-500 ring-1 ring-blue-500" : ""
              }`}
            >
              <div className="flex gap-4">
                <button
                  className="flex-shrink-0"
                  onClick={() => openArbiterProfile(arbiter)}
                >
                  <img
                    src={`/placeholder.svg?height=64&width=64`}
                    alt={arbiter.arbiterName}
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
                        {arbiter.arbiterName}
                      </h2>
                      <p className="text-sm text-gray-500">Dispute Resolver</p>
                    </button>

                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArbiterSelection(arbiter)}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-blue-50">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {arbiter.overallRating
                          ? arbiter.overallRating.toFixed(1)
                          : "New"}
                      </Badge>
                    </div>

                    <div className="text-sm">
                      {arbiter.totalResolvedDisputes || 0} Disputes Resolved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add this after the arbiter list */}
      <div className="mt-6 flex justify-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((old) => old + 1)}
            disabled={!arbiters || arbiters.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>

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

          <div className="grid grid-cols-2 gap-4 my-4">
            {selectedArbiters.map((arbiter) => (
              <div
                key={arbiter.arbiterUserIdFk}
                className="flex items-center gap-2"
              >
                <img
                  src={`/placeholder.svg?height=32&width=32`}
                  alt={arbiter.arbiterName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="text-sm font-medium">{arbiter.arbiterName}</div>
              </div>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalConfirmation}>
              I Accept & Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ArbiterProfile({ arbiter, isSelected, onSelect }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          <img
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
                {arbiter.rating.toFixed(1)}
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
              <div className="text-xl font-bold">{arbiter.totalJobs}</div>
              <div className="text-xs text-gray-500">Total jobs</div>
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
            {arbiter.buyerReviews.map((review, index) => (
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
                <div className="text-sm text-gray-500 mb-2">{review.date}</div>
                <p className="text-sm">{review.content}</p>
                <div className="text-sm font-medium mt-2">
                  {review.reviewer}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="seller" className="space-y-4 mt-4">
            {arbiter.sellerReviews.map((review, index) => (
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
                <div className="text-sm text-gray-500 mb-2">{review.date}</div>
                <p className="text-sm">{review.content}</p>
                <div className="text-sm font-medium mt-2">
                  {review.reviewer}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ArbiterSelectionContent;

// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "../ui/button"
// import { Badge } from "../ui/badge"
// import { Input } from "../ui/input"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../ui/alert-dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
// import { Search, Star, CheckCircle, Clock, MapPin, Briefcase } from "lucide-react"
// import { useToast } from "../ui/use-toast"
// import { mockArbiters } from "../../lib/mock-arbiters"

// function ArbiterSelectionContent() {
//   const navigate = useNavigate()
//   const { toast } = useToast()
//   const [selectedArbiters, setSelectedArbiters] = useState([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectionMode, setSelectionMode] = useState("system")
//   const [showConfirmation, setShowConfirmation] = useState(false)
//   const [selectedArbiter, setSelectedArbiter] = useState(null)
//   const [dialogOpen, setDialogOpen] = useState(false)

//   // Filter arbiters based on search query
//   const filteredArbiters = mockArbiters.filter(
//     (arbiter) =>
//       arbiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       arbiter.title.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   // Handle system selection
//   useEffect(() => {
//     if (selectionMode === "system") {
//       // Select top 6 arbiters by rating
//       const topArbiters = [...mockArbiters].sort((a, b) => b.rating - a.rating).slice(0, 6)
//       setSelectedArbiters(topArbiters)
//     }
//   }, [selectionMode])

//   // Handle manual selection
//   const toggleArbiterSelection = (arbiter) => {
//     if (selectionMode === "system") {
//       // Switch to manual mode if user manually selects an arbiter
//       setSelectionMode("manual")
//       setSelectedArbiters([arbiter])

//       toast({
//         title: "Manual selection mode",
//         description: "You've switched to manual selection. Please select 6 arbiters.",
//       })
//     } else {
//       // Check if arbiter is already selected
//       const isSelected = selectedArbiters.some((a) => a.id === arbiter.id)

//       if (isSelected) {
//         // Remove arbiter from selection
//         setSelectedArbiters(selectedArbiters.filter((a) => a.id !== arbiter.id))
//       } else {
//         // Add arbiter to selection if less than 6 are selected
//         if (selectedArbiters.length < 6) {
//           setSelectedArbiters([...selectedArbiters, arbiter])

//           // Show toast with remaining count
//           const remaining = 5 - selectedArbiters.length
//           if (remaining > 0) {
//             toast({
//               title: `Arbiter added`,
//               description: `Please select ${remaining} more arbiter${remaining === 1 ? "" : "s"}.`,
//             })
//           }
//         } else {
//           toast({
//             title: "Maximum selection reached",
//             description: "You can only select 6 arbiters. Please remove one to add another.",
//             variant: "destructive",
//           })
//         }
//       }
//     }
//   }

//   // Handle system selection button click
//   const handleSystemSelection = () => {
//     setSelectionMode("system")

//     toast({
//       title: "System selection mode",
//       description: "The system has selected the top 6 arbiters for you.",
//     })
//   }

//   // Handle manual selection button click
//   const handleManualSelection = () => {
//     setSelectionMode("manual")
//     setSelectedArbiters([])

//     toast({
//       title: "Manual selection mode",
//       description: "Please select 6 arbiters from the list.",
//     })
//   }

//   // Handle confirmation
//   const handleConfirmSelection = () => {
//     if (selectedArbiters.length === 6 || selectionMode === "system") {
//       setShowConfirmation(true)
//     } else {
//       toast({
//         title: "Incomplete selection",
//         description: `Please select ${6 - selectedArbiters.length} more arbiter${selectedArbiters.length === 5 ? "" : "s"}.`,
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle final confirmation
//   const handleFinalConfirmation = () => {
//     navigate("/arbiters/confirmation")
//   }

//   // Open arbiter profile
//   const openArbiterProfile = (arbiter) => {
//     setSelectedArbiter(arbiter)
//     setDialogOpen(true)
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Select Arbiters for Your Purchase</h1>

//       <div className="bg-white p-6 rounded-lg border mb-6">
//         <p className="mb-4">
//           Arbiters will mediate any disputes that may arise between you and the seller. You can either let our system
//           select the top 6 arbiters for you, or manually select 6 arbiters of your choice.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <Button
//             variant={selectionMode === "system" ? "default" : "outline"}
//             className="flex-1"
//             onClick={handleSystemSelection}
//           >
//             <CheckCircle className="mr-2 h-4 w-4" />
//             Let system select for me
//           </Button>

//           <Button
//             variant={selectionMode === "manual" ? "default" : "outline"}
//             className="flex-1"
//             onClick={handleManualSelection}
//           >
//             <Briefcase className="mr-2 h-4 w-4" />
//             I'll select manually
//           </Button>
//         </div>

//         <div className="relative mb-6">
//           <Input
//             type="search"
//             placeholder="Search arbiters by name or expertise..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
//         </div>

//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-500">
//             {selectionMode === "system"
//               ? "System has selected 6 arbiters for you"
//               : `${selectedArbiters.length} of 6 arbiters selected`}
//           </div>

//           <Button onClick={handleConfirmSelection} disabled={selectionMode === "manual" && selectedArbiters.length < 6}>
//             Confirm Selection
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {filteredArbiters.map((arbiter) => {
//           const isSelected = selectedArbiters.some((a) => a.id === arbiter.id)

//           return (
//             <div
//               key={arbiter.id}
//               className={`bg-white p-4 rounded-lg border ${isSelected ? "border-blue-500 ring-1 ring-blue-500" : ""}`}
//             >
//               <div className="flex gap-4">
//                 <button className="flex-shrink-0" onClick={() => openArbiterProfile(arbiter)}>
//                   <img
//                     src={arbiter.avatar || "/placeholder.svg?height=64&width=64"}
//                     alt={arbiter.name}
//                     width={64}
//                     height={64}
//                     className="rounded-full object-cover h-16 w-16"
//                   />
//                 </button>

//                 <div className="flex-1">
//                   <div className="flex justify-between">
//                     <button className="text-left" onClick={() => openArbiterProfile(arbiter)}>
//                       <h2 className="font-medium hover:underline">{arbiter.name}</h2>
//                       <p className="text-sm text-gray-500">{arbiter.title}</p>
//                     </button>

//                     <Button
//                       variant={isSelected ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => toggleArbiterSelection(arbiter)}
//                     >
//                       {isSelected ? "Selected" : "Select"}
//                     </Button>
//                   </div>

//                   <div className="mt-2 flex items-center gap-2">
//                     <div className="flex items-center">
//                       <Badge variant="outline" className="bg-blue-50">
//                         <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
//                         {arbiter.rating.toFixed(1)}
//                       </Badge>
//                     </div>

//                     <div className="text-sm">{arbiter.jobSuccess}% Job Success</div>

//                     <div className="text-sm text-gray-500">${arbiter.hourlyRate}/hr</div>
//                   </div>

//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {arbiter.skills.slice(0, 3).map((skill, index) => (
//                       <Badge key={index} variant="secondary" className="text-xs">
//                         {skill}
//                       </Badge>
//                     ))}
//                     {arbiter.skills.length > 3 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{arbiter.skills.length - 3} more
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Arbiter Profile Dialog */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Arbiter Profile</DialogTitle>
//           </DialogHeader>

//           {selectedArbiter && (
//             <ArbiterProfile
//               arbiter={selectedArbiter}
//               isSelected={selectedArbiters.some((a) => a.id === selectedArbiter.id)}
//               onSelect={toggleArbiterSelection}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Confirmation Dialog */}
//       <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Arbiter Selection</AlertDialogTitle>
//             <AlertDialogDescription>
//               These arbiters will mediate your case when the seller and the arbiters accept your case. By proceeding,
//               you accept the Terms and Conditions of this web service.
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <div className="grid grid-cols-2 gap-4 my-4">
//             {selectedArbiters.map((arbiter) => (
//               <div key={arbiter.id} className="flex items-center gap-2">
//                 <img
//                   src={arbiter.avatar || "/placeholder.svg?height=32&width=32"}
//                   alt={arbiter.name}
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                 />
//                 <div className="text-sm font-medium">{arbiter.name}</div>
//               </div>
//             ))}
//           </div>

//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleFinalConfirmation}>I Accept & Confirm</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }

// function ArbiterProfile({ arbiter, isSelected, onSelect }) {
//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row gap-6 items-start">
//         <div className="flex-shrink-0">
//           <img
//             src={arbiter.avatar || "/placeholder.svg?height=120&width=120"}
//             alt={arbiter.name}
//             width={120}
//             height={120}
//             className="rounded-full object-cover"
//           />

//           {arbiter.isAvailable && (
//             <Badge className="mt-2 w-full justify-center bg-green-100 text-green-800 hover:bg-green-100">
//               <Clock className="mr-1 h-3 w-3" /> Available now
//             </Badge>
//           )}
//         </div>

//         <div className="flex-1">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-2xl font-bold flex items-center gap-2">
//                 {arbiter.name}
//                 {arbiter.isVerified && (
//                   <Badge className="bg-blue-500">
//                     <CheckCircle className="h-3 w-3 mr-1" /> Verified
//                   </Badge>
//                 )}
//               </h2>
//               <p className="text-gray-600">{arbiter.title}</p>

//               <div className="flex items-center gap-2 mt-1">
//                 <MapPin className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm">
//                   {arbiter.location} – {arbiter.localTime} local time
//                 </span>
//               </div>
//             </div>

//             <Button variant={isSelected ? "default" : "outline"} onClick={() => onSelect(arbiter)}>
//               {isSelected ? "Selected" : "Select Arbiter"}
//             </Button>
//           </div>

//           <div className="flex flex-wrap gap-4 mt-4">
//             <div className="flex items-center gap-1">
//               <Badge variant="outline" className="bg-blue-50">
//                 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
//                 {arbiter.rating.toFixed(1)}
//               </Badge>
//               <span className="text-sm text-gray-500">({arbiter.reviewCount} reviews)</span>
//             </div>

//             <div className="flex items-center gap-1">
//               <Badge variant="outline" className="bg-blue-50">
//                 {arbiter.jobSuccess}% Job Success
//               </Badge>
//             </div>

//             <div className="text-sm">
//               <span className="font-semibold">${arbiter.hourlyRate}/hr</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
//             <div className="bg-gray-50 p-3 rounded-md text-center">
//               <div className="text-xl font-bold">{arbiter.totalJobs}</div>
//               <div className="text-xs text-gray-500">Total jobs</div>
//             </div>

//             <div className="bg-gray-50 p-3 rounded-md text-center">
//               <div className="text-xl font-bold">{arbiter.totalHours}</div>
//               <div className="text-xs text-gray-500">Total hours</div>
//             </div>

//             <div className="bg-gray-50 p-3 rounded-md text-center">
//               <div className="text-xl font-bold">${arbiter.totalEarned}+</div>
//               <div className="text-xs text-gray-500">Total earned</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="border-t pt-4">
//         <h3 className="font-semibold mb-2">About {arbiter.name}</h3>
//         <p className="text-sm">{arbiter.description}</p>
//       </div>

//       <div>
//         <h3 className="font-semibold mb-2">Skills</h3>
//         <div className="flex flex-wrap gap-2">
//           {arbiter.skills.map((skill, index) => (
//             <Badge key={index} variant="secondary">
//               {skill}
//             </Badge>
//           ))}
//         </div>
//       </div>

//       <div>
//         <Tabs defaultValue="buyer">
//           <TabsList className="w-full grid grid-cols-2">
//             <TabsTrigger value="buyer">Buyer Reviews ({arbiter.buyerReviews.length})</TabsTrigger>
//             <TabsTrigger value="seller">Seller Reviews ({arbiter.sellerReviews.length})</TabsTrigger>
//           </TabsList>

//           <TabsContent value="buyer" className="space-y-4 mt-4">
//             {arbiter.buyerReviews.map((review, index) => (
//               <div key={index} className="border-b pb-4 last:border-0">
//                 <div className="flex justify-between">
//                   <h4 className="font-medium">{review.title}</h4>
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-500 mb-2">{review.date}</div>
//                 <p className="text-sm">{review.content}</p>
//                 <div className="text-sm font-medium mt-2">{review.reviewer}</div>
//               </div>
//             ))}
//           </TabsContent>

//           <TabsContent value="seller" className="space-y-4 mt-4">
//             {arbiter.sellerReviews.map((review, index) => (
//               <div key={index} className="border-b pb-4 last:border-0">
//                 <div className="flex justify-between">
//                   <h4 className="font-medium">{review.title}</h4>
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-500 mb-2">{review.date}</div>
//                 <p className="text-sm">{review.content}</p>
//                 <div className="text-sm font-medium mt-2">{review.reviewer}</div>
//               </div>
//             ))}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

// export default ArbiterSelectionContent
