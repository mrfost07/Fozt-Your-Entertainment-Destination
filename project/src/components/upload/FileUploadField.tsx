import { useState } from 'react';
import { Upload as UploadIcon, Image, AlertCircle } from 'lucide-react';

interface FileUploadFieldProps {
  type: 'video' | 'image';
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileUploadField({ type, file, onChange, error }: FileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const id = `${type}-upload`;
  const Icon = type === 'video' ? UploadIcon : Image;
  const accept = type === 'video' ? 'video/*' : 'image/*';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onChange(droppedFile);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {type === 'video' ? 'Video File' : 'Thumbnail'}
      </label>
      <div
        className={`border-2 ${isDragging ? 'border-purple-500' : 'border-dashed border-gray-700'} 
          rounded-lg p-4 transition-colors ${error ? 'border-red-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
          <Icon className={`w-8 h-8 mb-2 ${error ? 'text-red-500' : 'text-gray-400'}`} />
          <span className={`text-sm ${error ? 'text-red-500' : 'text-gray-400'}`}>
            {file ? file.name : `Click or drag to upload ${type}`}
          </span>
        </label>
      </div>
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}