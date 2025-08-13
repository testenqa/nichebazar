'use client';

import { BusinessCategory } from '@/types/business';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: BusinessCategory[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  className 
}: CategoryFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          selectedCategory === null
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        All Categories
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.name)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
            selectedCategory === category.name
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          <span className="text-xs opacity-75">({category.count})</span>
        </button>
      ))}
    </div>
  );
}
