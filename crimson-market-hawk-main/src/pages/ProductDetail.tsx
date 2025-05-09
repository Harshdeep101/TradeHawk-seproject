
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import BidForm from "@/components/BidForm";
import BidHistory from "@/components/BidHistory";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type Listing = Database["public"]["Tables"]["listings"]["Row"];

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [sellerInfo, setSellerInfo] = useState<{ fullName: string; email: string } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isBiddingEnded, setIsBiddingEnded] = useState(false);
  const [isHighestBidder, setIsHighestBidder] = useState(false);
  // Create a ref to store the timer interval
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: listing,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!id) throw new Error("No listing ID provided");

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) throw error;
      return data as Listing;
    },
  });

  // Since we don't have a profiles table, we'll just use the seller_id information directly
  useEffect(() => {
    if (listing?.seller_id) {
      // Instead of fetching from profiles, we'll just set a placeholder
      // In a real app, you would either:
      // 1. Create a profiles table in Supabase, or
      // 2. Use auth.users directly with admin privileges
      setSellerInfo({
        fullName: "Seller #" + listing.seller_id.substring(0, 8),
        email: "contact@example.com",
      });
    }
  }, [listing?.seller_id]);

  // Check if current user is the highest bidder
  useEffect(() => {
    if (user && listing?.highest_bidder_id) {
      setIsHighestBidder(user.id === listing.highest_bidder_id);
    } else {
      setIsHighestBidder(false);
    }
  }, [user, listing?.highest_bidder_id]);

  // Update bidding timer
  useEffect(() => {
    if (!listing?.bidding_end_time) {
      setTimeRemaining(null);
      setIsBiddingEnded(true);
      return;
    }

    const endTime = new Date(listing.bidding_end_time).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        setTimeRemaining("Bidding ended");
        setIsBiddingEnded(true);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        return;
      }

      // Calculate time remaining
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let timeString = "";
      if (days > 0) timeString += `${days}d `;
      if (hours > 0 || days > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;

      setTimeRemaining(timeString);
      setIsBiddingEnded(false);
    };

    // Update immediately
    updateTimer();

    // Update every second using the ref
    timerIntervalRef.current = setInterval(updateTimer, 1000);

    // Clear interval on cleanup
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [listing?.bidding_end_time]);

  const handleBidSuccess = () => {
    toast({
      title: "Bid placed successfully!",
      description: "Your bid has been recorded.",
    });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-hawk-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatCondition = (condition: string): string => {
    if (!condition) return "Unknown";
    switch (condition) {
      case "like_new":
        return "Like New";
      default:
        return condition.charAt(0).toUpperCase() + condition.slice(1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="aspect-square">
              <img
                src={listing?.image_url || "/placeholder.svg"}
                alt={listing?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold mb-2">{listing?.title}</h1>
                <Badge variant="outline" className="text-sm font-medium capitalize">
                  {formatCondition(listing?.condition || "")}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Posted{" "}
                {listing?.created_at
                  ? new Date(listing.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently"}
              </p>
              <div className="text-2xl font-bold text-hawk-500 mb-4">
                ${listing?.price.toFixed(2)}
              </div>

              {listing?.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{listing.description}</p>
                </div>
              )}

              {listing?.allows_bidding && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md border">
                  <h3 className="text-lg font-semibold mb-2">Bidding Information</h3>
                  {listing.highest_bid ? (
                    <div className="text-green-700">
                      <p className="font-medium">
                        Current highest bid: ${listing.highest_bid.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">No bids yet - be the first!</p>
                  )}
                  
                  {/* Bidding Timer */}
                  {listing.bidding_end_time && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        {isBiddingEnded ? (
                          <span className="text-red-600">Bidding has ended</span>
                        ) : (
                          <>
                            Time remaining: <span className="text-orange-600 font-bold">{timeRemaining}</span>
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {sellerInfo && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
                  <p className="text-gray-700">{sellerInfo.fullName}</p>
                  <p className="text-gray-700">{sellerInfo.email}</p>
                  {/* Only show contact info to highest bidder if bidding ended */}
                  {listing?.contact_info && isHighestBidder && isBiddingEnded ? (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-medium text-green-800">
                        As the highest bidder, you can contact the seller at:
                      </p>
                      <p className="text-gray-700">{listing.contact_info}</p>
                    </div>
                  ) : listing?.contact_info && !listing?.allows_bidding ? (
                    <p className="text-gray-700">Contact: {listing.contact_info}</p>
                  ) : null}
                  
                  {listing?.contact_info && listing?.allows_bidding && isBiddingEnded && !isHighestBidder && (
                    <p className="text-sm text-orange-600">
                      Contact information is only visible to the highest bidder after bidding ends.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bid Form - only show if bidding hasn't ended */}
            {listing?.allows_bidding && !isBiddingEnded && (
              <div className="mt-8 border-t pt-6">
                <BidForm
                  listingId={listing.id}
                  currentPrice={listing.price}
                  highestBid={listing.highest_bid || 0}
                  onBidPlaced={handleBidSuccess}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bid History */}
        {listing?.allows_bidding && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Bid History</h2>
            <BidHistory listingId={listing.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
