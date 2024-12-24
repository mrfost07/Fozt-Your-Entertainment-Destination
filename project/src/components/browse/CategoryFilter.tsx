import { ChevronDown } from 'lucide-react';
import type { Category } from '@/types/category';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onSelect('all')}
          className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          All Genres
        </button>
        
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onSelect(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-gray-800 hover:bg-gray-700 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Select Genre</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}