interface ContentFieldsProps {
  values: {
    description: string;
    synopsis: string;
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ContentFields({ values, onChange }: ContentFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={onChange}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Synopsis</label>
        <textarea
          name="synopsis"
          value={values.synopsis}
          onChange={onChange}
          rows={5}
          className="w-full px-3 py-2 bg-gray-700 rounded-md"
          required
        />
      </div>
    </>
  );
}