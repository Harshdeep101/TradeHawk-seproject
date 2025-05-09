
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface Bid {
  id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
}

interface BidHistoryProps {
  listingId: string | number;
}

const BidHistory = ({ listingId }: BidHistoryProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBids = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("bids")
          .select("*")
          .eq("listing_id", parseInt(String(listingId)))
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setBids(data || []);
      } catch (error: any) {
        console.error("Error fetching bids:", error);
        toast({
          title: "Failed to load bids",
          description: "There was a problem loading the bid history.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBids();
  }, [listingId, toast, user]);
  
  if (!user) {
    return (
      <Card className="p-4">
        <p className="text-sm text-center text-muted-foreground">
          Sign in to view bid history
        </p>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card className="p-4">
        <p className="text-sm text-center text-muted-foreground">
          Loading bid history...
        </p>
      </Card>
    );
  }
  
  if (bids.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-center text-muted-foreground">
          No bids have been placed yet. Be the first to bid!
        </p>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <h3 className="font-bold mb-3">Bid History</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {bids.map((bid) => (
          <div key={bid.id} className="flex justify-between items-center py-2 border-b last:border-0">
            <div>
              <p className="text-sm font-medium">
                {bid.bidder_id === user.id ? "Your bid" : "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(bid.created_at).toLocaleString()}
              </p>
            </div>
            <div className="font-bold">${bid.amount.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BidHistory;
