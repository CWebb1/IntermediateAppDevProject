import { MovieCategory } from "../utiles/api";
import { Button } from "./ui/button";

const categories: { label: string; value: MovieCategory }[] = [
  { label: "Trending", value: "trending" },
  { label: "Top Rated", value: "top-rated" },
  { label: "Action", value: "action" },
  { label: "Animation", value: "animation" },
  { label: "Comedy", value: "comedy" },
];

interface NavbarProps {
  activeCategory?: MovieCategory;
  onCategoryChange?: (category: MovieCategory) => void;
}

export function Navbar({ activeCategory = "trending", onCategoryChange }: NavbarProps) {
  return (
    <div
      className="border-b sticky top-0 z-10"
      style={{ backgroundColor: "#23272a" }} // Deep grey
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Movie Listings</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            {categories.map((category) => (
              <Button
                key={category.value}
                onClick={() => onCategoryChange?.(category.value)}
                variant={activeCategory === category.value ? "default" : "outline"}
                className={activeCategory === category.value ? "text-white" : "text-gray-400"}
              >
                {category.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
