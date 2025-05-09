
import { Button } from "@/components/ui/button";
import { Laptop, BookOpen, Trophy, ShoppingBag } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

interface CategoryOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

const categories: CategoryOption[] = [
  { id: "all", label: "All", icon: ShoppingBag },
  { id: "electronics", label: "Electronics", icon: Laptop },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "other", label: "Other", icon: ShoppingBag },
];

const CategorySelector = ({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`flex gap-2 ${
              selectedCategory === category.id ? "bg-hawk-500 hover:bg-hawk-600" : ""
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            <Icon className="w-4 h-4" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
