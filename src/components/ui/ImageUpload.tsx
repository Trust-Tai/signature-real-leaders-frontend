import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  className?: string;
  error?: string;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  className,
  error,
  currentImage
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        onImageSelect(file);
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="section-title">
        UPLOAD YOUR PHOTO
      </h2>
      
      <p className="text-gray-600 text-lg font-outfit text-center max-w-2xl mx-auto leading-relaxed">
        Add a professional photo to your Real Leaders signature. This will help people recognize and connect with you.
      </p>

      <div className="max-w-md mx-auto">
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative w-48 h-48 mx-auto rounded-full border-2 border-dashed cursor-pointer transition-all duration-200 flex items-center justify-center",
            isDragOver
              ? "bg-custom-red/20"
              : isUploading
              ? "bg-custom-red/10"
              : "bg-gray-50 hover:bg-gray-100",
            error && "border-custom-red"
          )}
          style={{ border: '10px solid #CF323240' }}
        >
          {currentImage ? (
            <>
              <Image
                src={currentImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                width={192}
                height={192}
              />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-custom-red rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </>
          ) : isUploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-red mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 font-outfit">Uploading...</p>
            </div>
          ) : (
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600 font-outfit">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 font-outfit mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {error && (
          <p className="text-custom-red text-sm font-outfit text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
