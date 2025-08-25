import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SignSectionProps {
  onSubmit: (data: SignFormData) => void;
  className?: string;
  error?: string;
}

interface SignFormData {
  signature: string;
  confirmInfo: boolean;
  giveConsent: boolean;
  agreeTerms: boolean;
  uploadedImage: string | null;
}

const SignSection: React.FC<SignSectionProps> = ({
  onSubmit,
  className,
  error
}) => {
  const [formData, setFormData] = useState({
    signature: '',
    confirmInfo: false,
    giveConsent: false,
    agreeTerms: false,
    uploadedImage: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | boolean | string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Process the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        handleInputChange('uploadedImage', imageDataUrl);
        console.log('Image uploaded successfully:', file.name);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = formData.confirmInfo && formData.giveConsent && formData.agreeTerms;

  return (
    <div className={cn("text-center space-y-8 px-4", className)}>
      {/* Section Heading */}
      <h2 className="section-title">
        Add Your Signature to Lead with Intention
      </h2>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Signature Input Container */}
        <div className="relative mx-auto w-full max-w-2xl" style={{ height: '186px' }}>
          {/* Conditional Rendering: Text Input or Image Display */}
          {formData.uploadedImage ? (
            /* Show uploaded image */
            <div 
              className="w-full h-full flex items-center justify-center bg-white relative"
              style={{ 
                border: '10px solid #CF323240',
                borderRadius: '6px'
              }}
            >
              <Image 
                src={formData.uploadedImage}
                alt="Uploaded signature"
                className="max-w-full max-h-full object-contain"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                width={400}
                height={186}
              />
              
              {/* Clear/Remove image button */}
              <button
                onClick={() => handleInputChange('uploadedImage', null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            /* Show text input */
            <input
              type="text"
              value={formData.signature}
              onChange={(e) => handleInputChange('signature', e.target.value)}
              placeholder="Write your signature here..."
              className="w-full h-full px-4 py-4 text-xl sm:text-2xl font-bold text-gray-800 bg-white outline-none"
              style={{ 
                fontFamily: 'cursive', 
                fontStyle: 'italic',
                border: '10px solid #CF323240',
                borderRadius: '6px'
              }}
            />
          )}
          
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {/* Upload Button - Bottom Right */}
          <button 
            onClick={handleUploadClick}
            className="absolute bottom-5 right-5 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-600 font-outfit">Upload</span>
          </button>
        </div>

        {/* Description Text */}
        <p className="font-outfit font-medium max-w-2xl mx-auto leading-relaxed text-start px-4" 
          style={{ fontSize: '16px', color: "#00000099" }}>
          By signing below, you confirm your details and agree to be featured as a verified contributor.
        </p>

        {/* Options */}
        <div className="space-y-4 max-w-2xl mx-auto text-left px-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.confirmInfo}
              onChange={(e) => handleInputChange('confirmInfo', e.target.checked)}
              className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2"
            />
            <span className="font-outfit font-medium text-sm sm:text-base" style={{color:"#00000099"}}>
              I confirm all information provided is accurate.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.giveConsent}
              onChange={(e) => handleInputChange('giveConsent', e.target.checked)}
              className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2"
            />
            <span className="font-outfit font-medium text-sm sm:text-base" style={{color:"#00000099"}}>
              I give consent to feature my name and contributions.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
              className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2"
            />
            <span className="font-outfit font-medium text-sm sm:text-base" style={{color:"#00000099"}}>
              I agree to the Terms of Use and Privacy Policy.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="custom-btn my-3 w-full max-w-md"
        >
          CONTINUE
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SignSection;
