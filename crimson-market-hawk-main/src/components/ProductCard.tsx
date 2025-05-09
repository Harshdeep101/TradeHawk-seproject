
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  highestBid?: number | null;
  allowsBidding?: boolean;
}

const formatCondition = (condition: string): string => {
  // If condition is undefined or null, return a default value
  if (!condition) {
    return "Unknown";
  }
  
  switch (condition) {
    case "like_new":
      return "Like New";
    default:
      return condition.charAt(0).toUpperCase() + condition.slice(1);
  }
};

const ProductCard = ({
  id,
  title,
  price,
  condition,
  imageUrl,
  category,
  createdAt,
  highestBid,
  allowsBidding = true,
}: ProductCardProps) => {
  // Format the date for display
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  
  // Format the price, handling potential undefined values
  const formattedPrice = typeof price === 'number' ? price.toFixed(2) : '0.00';
  const formattedBid = highestBid ? highestBid.toFixed(2) : null;
  
  return (
    <Link to={`/product/${id}`} className="group">
      <div className="overflow-hidden rounded-lg border bg-white transition hover:shadow-md">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
            <Badge variant="outline" className="ml-2 capitalize">
              {formatCondition(condition)}
            </Badge>
          </div>
          <div className="mt-2">
            {allowsBidding && formattedBid ? (
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Starting price:</p>
                  <p className="font-medium">${formattedPrice}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm font-medium text-green-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1"><path d="M19 12H5"></path><path d="M12 5l-7 7 7 7"></path></svg>
                    Current bid:
                  </p>
                  <p className="font-bold text-green-700">${formattedBid}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="font-bold text-hawk-500">${formattedPrice}</p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            )}
          </div>
          {allowsBidding && !formattedBid && (
            <div className="mt-1">
              <p className="text-xs text-green-700">
                No bids yet - be the first!
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
