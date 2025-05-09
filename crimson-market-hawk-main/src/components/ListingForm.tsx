import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Database } from "@/integrations/supabase/types";
import { Switch } from "@/components/ui/switch";
import { addHours, addMinutes, addDays, addSeconds } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type TablesInsert = Database["public"]["Tables"]["listings"]["Insert"];

const ListingForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    contact_info: "",
    image: null as File | null,
  });
  const [allowsBidding, setAllowsBidding] = useState(false);
  const [biddingDuration, setBiddingDuration] = useState("3d"); // Default 3 days
  const [customDuration, setCustomDuration] = useState({
    value: "1",
    unit: "d" // d=days, h=hours, m=minutes, s=seconds
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };
  
  const handleBiddingDurationChange = (value: string) => {
    // Check if it's custom option
    if (value === "custom") {
      // Keep current custom settings
      setBiddingDuration("custom");
    } else {
      // Set to preset option
      setBiddingDuration(value);
    }
  };
  
  const handleCustomDurationValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDuration(prev => ({
      ...prev,
      value: e.target.value
    }));
  };
  
  const handleCustomDurationUnitChange = (unit: string) => {
    setCustomDuration(prev => ({
      ...prev,
      unit
    }));
  };

  const calculateBiddingEndTime = () => {
    const now = new Date();
    
    if (biddingDuration === "custom") {
      const value = parseInt(customDuration.value, 10);
      switch (customDuration.unit) {
        case "d":
          return addDays(now, value).toISOString();
        case "h":
          return addHours(now, value).toISOString();
        case "m":
          return addMinutes(now, value).toISOString();
        case "s":
          return addSeconds(now, value).toISOString();
        default:
          return addDays(now, 1).toISOString();
      }
    } else {
      // For preset options like "1d", "3d", etc.
      const value = parseInt(biddingDuration.slice(0, -1), 10);
      const unit = biddingDuration.slice(-1);
      
      switch (unit) {
        case "d":
          return addDays(now, value).toISOString();
        case "h":
          return addHours(now, value).toISOString();
        case "m":
          return addMinutes(now, value).toISOString();
        case "s":
          return addSeconds(now, value).toISOString();
        default:
          return addDays(now, value).toISOString();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to create a listing.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.condition) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;
      
      // Upload image if present
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('listings')
          .upload(filePath, formData.image);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Calculate bidding_end_time if bidding is enabled
      let biddingEndTime = null;
      if (allowsBidding) {
        biddingEndTime = calculateBiddingEndTime();
      }
      
      // Create listing in the database
      const newListing: TablesInsert = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        contact_info: formData.contact_info,
        image_url: imageUrl,
        seller_id: user.id,
        allows_bidding: allowsBidding,
        bidding_end_time: biddingEndTime
      };
      
      const { error: insertError } = await supabase
        .from('listings')
        .insert(newListing);
        
      if (insertError) {
        throw insertError;
      }
      
      toast({
        title: "Listing created",
        description: "Your item has been listed successfully!"
      });
      
      // Redirect to the buy page
      navigate("/buy");
      
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error creating listing",
        description: error.message || "There was an error creating your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="What are you selling?"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your item in detail"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_info">Contact Information</Label>
        <Input
          id="contact_info"
          name="contact_info"
          placeholder="Phone number, email, or preferred contact method"
          value={formData.contact_info}
          onChange={handleChange}
        />
        <p className="text-xs text-muted-foreground">
          How should buyers contact you about this item?
          {allowsBidding && " (Only visible to highest bidder after bidding ends)"}
        </p>
      </div>
      
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Allow Bidding</h4>
            <p className="text-sm text-muted-foreground">Enable users to place bids on this item</p>
          </div>
          <Switch
            checked={allowsBidding}
            onCheckedChange={setAllowsBidding}
          />
        </div>
        
        {allowsBidding && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="biddingDuration">Bidding Duration</Label>
              <Select
                value={biddingDuration}
                onValueChange={handleBiddingDurationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10s">10 seconds</SelectItem>
                  <SelectItem value="30s">30 seconds</SelectItem>
                  <SelectItem value="1m">1 minute</SelectItem>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="2h">2 hours</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="8h">8 hours</SelectItem>
                  <SelectItem value="12h">12 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                  <SelectItem value="3d">3 days</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="14d">14 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="custom">Custom duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {biddingDuration === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="customDurationValue">Duration Value</Label>
                  <Input
                    id="customDurationValue"
                    type="number"
                    min="1"
                    value={customDuration.value}
                    onChange={handleCustomDurationValueChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customDurationUnit">Unit</Label>
                  <Select
                    value={customDuration.unit}
                    onValueChange={handleCustomDurationUnitChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s">Seconds</SelectItem>
                      <SelectItem value="m">Minutes</SelectItem>
                      <SelectItem value="h">Hours</SelectItem>
                      <SelectItem value="d">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Bidding will end after this period, and the highest bidder will be able to see your contact information
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={(value) => handleSelectChange("category", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            onValueChange={(value) => handleSelectChange("condition", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like_new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <div className="border rounded-md p-2 bg-muted/50">
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-hawk-500 hover:bg-hawk-600"
        disabled={isLoading}
      >
        {isLoading ? "Creating Listing..." : "Create Listing"}
      </Button>
    </form>
  );
};

export default ListingForm;
