import { Upload as UploadIcon, Image } from 'lucide-react';

interface FileUploadFieldProps {
  type: 'video' | 'image';
  file: File | null;
  onChange: (file: File | null) => void;
}

export function FileUploadField({ type, file, onChange }: FileUploadFieldProps) {
  const id = `${type}-upload`;
  const Icon = type === 'video' ? UploadIcon : Image;
  const accept = type === 'video' ? 'video/*' : 'image/*';

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {type === 'video' ? 'Video File' : 'Thumbnail'}
      </label>
      <div className="border-2 border-dashed border-gray-700 rounded-lg p-4">
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="hidden"
          id={id}
          required
        />
        <label
          htmlFor={id}
          className="flex flex-col items-center cursor-pointer"
        >
          <Icon className="w-8 h-8 mb-2 text-gray-400" />
          <span className="text-sm text-gray-400">
            {file ? file.name : `Click to upload ${type}`}
          </span>
        </label>
      </div>
    </div>
  );
}