import type { Category } from '@/types/category';

interface MetadataFieldsProps {
  categories: Category[];
  values: {
    title: string;
    categoryId: string;
    duration: string;
    releaseDate: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function MetadataFields({ categories, values, onChange }: MetadataFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={onChange}
          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Genre</label>
        <select
          name="categoryId"
          value={values.categoryId}
          onChange={onChange}
          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          required
        >
          <option value="">Select a genre</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
        <input
          type="number"
          name="duration"
          value={values.duration}
          onChange={onChange}
          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Release Date</label>
        <input
          type="date"
          name="releaseDate"
          value={values.releaseDate}
          onChange={onChange}
          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          required
        />
      </div>
    </div>
  );
}