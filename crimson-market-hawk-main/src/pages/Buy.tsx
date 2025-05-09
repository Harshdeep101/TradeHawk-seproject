
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";
import CategorySelector from "@/components/CategorySelector";
import FilterSection from "@/components/FilterSection";
import { Database } from "@/integrations/supabase/types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];

interface Category {
  name: string;
  value: string;
  count?: number;
}

const categories: Category[] = [
  { name: "All", value: "all" },
  { name: "Electronics", value: "electronics" },
  { name: "Books", value: "books" },
  { name: "Sports", value: "sports" },
  { name: "Other", value: "other" },
];

const Buy = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showBiddingOnly, setShowBiddingOnly] = useState(false);

  // Get the category from URL params or default to "all"
  useEffect(() => {
    const categoryParam = searchParams.get("category") || "all";
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setListings(data || []);
        
        // Determine price range from actual data
        if (data && data.length > 0) {
          const prices = data.map(listing => listing.price);
          setMinPrice(Math.floor(Math.min(...prices)));
          setMaxPrice(Math.ceil(Math.max(...prices)));
        }
      } catch (error: any) {
        console.error('Error fetching listings:', error);
        toast({
          title: "Failed to load listings",
          description: "There was an error loading the listings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, [toast]);

  // Filter and sort listings based on all criteria
  useEffect(() => {
    let filtered = [...listings];
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((listing) => listing.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          (listing.description ? listing.description.toLowerCase().includes(query) : false)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(
      (listing) => listing.price >= minPrice && listing.price <= maxPrice
    );
    
    // Filter by condition
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(
        (listing) => selectedConditions.includes(listing.condition)
      );
    }
    
    // Filter by bidding availability
    if (showBiddingOnly) {
      filtered = filtered.filter((listing) => listing.allows_bidding);
    }
    
    // Sort listings
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => 
          new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()
        );
        break;
      case "oldest":
        filtered.sort((a, b) => 
          new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime()
        );
        break;
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredListings(filtered);
  }, [listings, selectedCategory, searchQuery, minPrice, maxPrice, sortBy, selectedConditions, showBiddingOnly]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Update URL params
    searchParams.set("category", category);
    setSearchParams(searchParams);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle price range change
  const handlePriceRangeChange = (range: [number, number]) => {
    setMinPrice(range[0]);
    setMaxPrice(range[1]);
  };
  
  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };
  
  // Handle condition filter change
  const handleConditionChange = (conditions: string[]) => {
    setSelectedConditions(conditions);
  };
  
  // Handle availability filter change
  const handleAvailabilityChange = (hasBids: boolean) => {
    setShowBiddingOnly(hasBids);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Campus Marketplace</h1>
          <p className="text-muted-foreground">
            Find textbooks, electronics, and more from fellow students
          </p>
        </div>
        
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row">
          <aside className="w-full md:w-72 md:mr-8 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-4">Categories</h2>
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />
            </div>
            
            <div className="bg-white p-4 border rounded-lg">
              <h2 className="font-semibold mb-3">Search</h2>
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search listings..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <FilterSection 
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceRangeChange={handlePriceRangeChange}
              onSortChange={handleSortChange}
              onConditionChange={handleConditionChange}
              onAvailabilityChange={handleAvailabilityChange}
            />
          </aside>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-xl">
                {selectedCategory === "all" ? "All Listings" : categories.find(c => c.value === selectedCategory)?.name}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredListings.length} {filteredListings.length === 1 ? "listing" : "listings"}
              </span>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-hawk-500 border-t-transparent"></div>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white border rounded-lg p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-muted-foreground mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold mb-2">No listings found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No results matching "${searchQuery}"`
                    : `No listings available with your current filters.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ProductCard
                    key={listing.id}
                    id={listing.id.toString()}
                    title={listing.title}
                    price={listing.price}
                    condition={listing.condition}
                    imageUrl={listing.image_url || "/placeholder.svg"}
                    category={listing.category}
                    createdAt={listing.created_at || ""}
                    highestBid={listing.highest_bid}
                    allowsBidding={listing.allows_bidding}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <p>&copy; 2025 TradeHawk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Buy;
