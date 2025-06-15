import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-dashed border-emerald-300 dark:border-emerald-600 rounded-xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900 dark:text-white">
              Upload an Image
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click to select a photo of parsley or cilantro
            </p>
          </div>
        </div>
      </button>
    </>
  );
}