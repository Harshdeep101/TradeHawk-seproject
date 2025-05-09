
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface FilterSectionProps {
  minPrice: number;
  maxPrice: number;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  onConditionChange: (conditions: string[]) => void;
  onAvailabilityChange: (hasBids: boolean) => void;
}

const FilterSection = ({
  minPrice,
  maxPrice,
  onPriceRangeChange,
  onSortChange,
  onConditionChange,
  onAvailabilityChange,
}: FilterSectionProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice.toString());
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice.toString());
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  
  // Update local state when props change
  useEffect(() => {
    setLocalMinPrice(minPrice.toString());
    setLocalMaxPrice(maxPrice.toString());
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleSliderChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setPriceRange(range);
    setLocalMinPrice(range[0].toString());
    setLocalMaxPrice(range[1].toString());
    onPriceRangeChange(range);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMinPrice(value);
    
    if (!isNaN(Number(value))) {
      const minVal = Math.max(Number(value), 0);
      if (minVal <= priceRange[1]) {
        setPriceRange([minVal, priceRange[1]]);
        onPriceRangeChange([minVal, priceRange[1]]);
      }
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMaxPrice(value);
    
    if (!isNaN(Number(value))) {
      const maxVal = Number(value);
      if (maxVal >= priceRange[0]) {
        setPriceRange([priceRange[0], maxVal]);
        onPriceRangeChange([priceRange[0], maxVal]);
      }
    }
  };

  const handleSortChange = (value: string) => {
    onSortChange(value);
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    let updatedConditions: string[];
    
    if (checked) {
      updatedConditions = [...selectedConditions, condition];
    } else {
      updatedConditions = selectedConditions.filter(c => c !== condition);
    }
    
    setSelectedConditions(updatedConditions);
    onConditionChange(updatedConditions);
  };

  return (
    <div className="bg-white border rounded-lg p-5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={20} className="text-hawk-500" />
        <h2 className="font-semibold text-lg">Filters</h2>
      </div>
      
      <div className="space-y-5">
        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label className="font-medium">Price Range ($)</Label>
          <Slider
            min={0}
            max={1000}
            step={5}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handleSliderChange}
            className="my-4"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number" 
              value={localMinPrice}
              onChange={handleMinInputChange}
              className="w-24 h-8"
              min={0}
            />
            <span>to</span>
            <Input
              type="number" 
              value={localMaxPrice}
              onChange={handleMaxInputChange}
              className="w-24 h-8"
              min={0}
            />
          </div>
        </div>

        <div className="border-t my-4"></div>
        
        {/* Sort Order */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-gray-500" />
            <Label className="font-medium">Sort By</Label>
          </div>
          <Select onValueChange={handleSortChange} defaultValue="newest">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
              <SelectItem value="name_desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t my-4"></div>
        
        {/* Item Condition */}
        <div className="space-y-3">
          <Label className="font-medium">Item Condition</Label>
          <div className="space-y-2">
            {["new", "like_new", "good", "fair", "poor"].map((condition) => {
              const displayCondition = condition === "like_new" ? "Like New" : 
                condition.charAt(0).toUpperCase() + condition.slice(1);
                
              return (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`condition-${condition}`} 
                    onCheckedChange={(checked) => 
                      handleConditionChange(condition, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`condition-${condition}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {displayCondition}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t my-4"></div>
        
        {/* Availability */}
        <div className="space-y-3">
          <Label className="font-medium">Availability</Label>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="has-bids" 
              onCheckedChange={(checked) => onAvailabilityChange(!!checked)}
            />
            <label
              htmlFor="has-bids"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show items with active bidding only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
