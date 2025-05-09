
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface BidFormProps {
  listingId: string | number;
  currentPrice: number;
  highestBid: number | null;
  onBidPlaced?: (newBidAmount: number) => void;
}

const BidForm = ({ 
  listingId, 
  currentPrice, 
  highestBid, 
  onBidPlaced 
}: BidFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate minimum bid (higher than current price or highest bid)
  const minBidAmount = highestBid ? highestBid + 1 : currentPrice + 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place a bid.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    
    const numericBidAmount = parseFloat(bidAmount);
    
    // Validate bid amount
    if (isNaN(numericBidAmount) || numericBidAmount < minBidAmount) {
      toast({
        title: "Invalid bid amount",
        description: `Your bid must be at least $${minBidAmount.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if bidding is still allowed (not ended)
      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .select("bidding_end_time, allows_bidding")
        .eq("id", parseInt(String(listingId)))
        .single();
      
      if (listingError) throw listingError;
      
      // Check if bidding has ended
      if (listingData.bidding_end_time) {
        const endTime = new Date(listingData.bidding_end_time).getTime();
        const now = new Date().getTime();
        
        if (now > endTime || !listingData.allows_bidding) {
          toast({
            title: "Bidding has ended",
            description: "The bidding period for this item has ended.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Insert the bid - Convert listingId to a number to ensure type safety
      const { data: bidData, error: bidError } = await supabase
        .from("bids")
        .insert({
          listing_id: parseInt(String(listingId)),
          bidder_id: user.id,
          amount: numericBidAmount,
        })
        .select();
      
      if (bidError) throw bidError;
      
      // Update the highest_bid and highest_bidder_id on the listing
      const { error: updateError } = await supabase
        .from("listings")
        .update({ 
          highest_bid: numericBidAmount,
          highest_bidder_id: user.id
        })
        .eq("id", parseInt(String(listingId)));
      
      if (updateError) throw updateError;
      
      // Show success message
      toast({
        title: "Bid placed successfully",
        description: `Your bid of $${numericBidAmount.toFixed(2)} has been placed!`,
      });
      
      // Reset form
      setBidAmount("");
      
      // Notify parent component
      if (onBidPlaced) {
        onBidPlaced(numericBidAmount);
      }
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast({
        title: "Failed to place bid",
        description: error.message || "There was a problem placing your bid.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-4 border border-hawk-100 bg-hawk-50">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">Place a Bid</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Current {highestBid ? "highest bid" : "price"}: ${(highestBid || currentPrice).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Minimum bid: ${minBidAmount.toFixed(2)}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                type="number"
                className="pl-7"
                placeholder={minBidAmount.toFixed(2)}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                step="0.01"
                min={minBidAmount}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="bg-hawk-500 hover:bg-hawk-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing Bid..." : "Place Bid"}
            </Button>
          </div>
          
          {!user && (
            <p className="text-xs text-muted-foreground">
              You need to be signed in to place bids.
            </p>
          )}
        </div>
      </form>
    </Card>
  );
};

export default BidForm;
