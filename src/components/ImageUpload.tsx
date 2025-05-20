import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './Button';

interface ImageUploadProps {
  onChange: (file: File | null, base64: string | null) => void;
  value?: string;
  label?: string;
  error?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
  label,
  error,
  className
}) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onChange(file, base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onChange(null, null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {label}
        </label>
      )}
      
      <div className="w-full">
        {!preview ? (
          <div 
            className={cn(
              'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200',
              error 
                ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500 text-center">
              Click to upload an image, or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG up to 5MB
            </p>
          </div>
        ) : (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <Button
              variant="danger"
              size="sm"
              className="absolute top-2 right-2 rounded-full p-1 w-8 h-8"
              onClick={handleClear}
            >
              <X size={16} />
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;