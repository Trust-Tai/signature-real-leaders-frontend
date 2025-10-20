// import React, { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';
// import { cn } from '@/lib/utils';
// import { Upload } from 'lucide-react';

// interface SignSectionProps {
//   onSubmit: (data: SignFormData) => void;
//   className?: string;
//   error?: string;
// }

// interface SignFormData {
//   signature: string;
//   confirmInfo: boolean;
//   giveConsent: boolean;
//   agreeTerms: boolean;
//   uploadedImage: string | null;
// }

// const SignSection: React.FC<SignSectionProps> = ({
//   onSubmit,
//   className,
//   error
// }) => {
//   const [formData, setFormData] = useState({
//     signature: '',
//     confirmInfo: false,
//     giveConsent: false,
//     agreeTerms: false,
//     uploadedImage: null
//   });

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const isDrawingRef = useRef<boolean>(false);
//   const [hasDrawn, setHasDrawn] = useState(false);

//   const handleInputChange = (field: string, value: string | boolean | string | null) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && file.type.startsWith('image/')) {
//       // Process the uploaded image
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const imageDataUrl = e.target?.result as string;
//         handleInputChange('uploadedImage', imageDataUrl);
//         console.log('Image uploaded successfully:', file.name);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert('Please select a valid image file');
//     }
//   };

//   const handleSubmit = () => {
//     onSubmit(formData);
//   };

//   const isFormValid = formData.confirmInfo && formData.giveConsent && formData.agreeTerms;

//   const setupCanvasForDpr = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const rect = canvas.getBoundingClientRect();
//     const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
//     const needResize = canvas.width !== Math.max(1, Math.floor(rect.width * dpr)) || canvas.height !== Math.max(1, Math.floor(rect.height * dpr));
//     if (needResize) {
//       canvas.width = Math.max(1, Math.floor(rect.width * dpr));
//       canvas.height = Math.max(1, Math.floor(rect.height * dpr));
//     }
//     const ctx = canvas.getContext('2d');
//     if (ctx) {
//       ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//       ctx.lineJoin = 'round';
//       ctx.lineCap = 'round';
//       ctx.lineWidth = 2;
//       ctx.strokeStyle = '#000000';
//     }
//   };

//   useEffect(() => {
//     setupCanvasForDpr();
//     const onResize = () => setupCanvasForDpr();
//     if (typeof window !== 'undefined') {
//       window.addEventListener('resize', onResize);
//     }
//     return () => {
//       if (typeof window !== 'undefined') {
//         window.removeEventListener('resize', onResize);
//       }
//     };
//   }, []);

//   const getCanvasPos = (clientX: number, clientY: number) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };
//     const rect = canvas.getBoundingClientRect();
//     return { x: clientX - rect.left, y: clientY - rect.top };
//   };

//   const startDrawing = (clientX: number, clientY: number) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
//     const { x, y } = getCanvasPos(clientX, clientY);
//     isDrawingRef.current = true;
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     setHasDrawn(true);
//   };

//   const draw = (clientX: number, clientY: number) => {
//     if (!isDrawingRef.current) return;
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
//     const { x, y } = getCanvasPos(clientX, clientY);
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const endDrawing = () => {
//     if (!isDrawingRef.current) return;
//     isDrawingRef.current = false;
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     // Save drawn signature as data URL
//     try {
//       const dataUrl = canvas.toDataURL('image/png');
//       handleInputChange('signature', dataUrl);
//     } catch {
//       console.warn('Unable to export signature image');
//     }
//   };

//   const clearSignature = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     handleInputChange('signature', '');
//     setHasDrawn(false);
//   };

//   return (
//     <div className={cn("text-center space-y-8 px-4", className)}>
//       {/* Section Heading */}
//       <h2 className="section-title">
//         Add Your Signature to Lead with Intention
//       </h2>

//       {/* Form Fields */}
//       <div className="space-y-6">
//         {/* Signature Input Container */}
//         <div className="relative mx-auto w-full max-w-2xl" style={{ height: '186px' }}>
//           {/* Conditional Rendering: Draw box (canvas) or Image Display */}
//           {formData.uploadedImage ? (
//             /* Show uploaded image */
//             <div 
//               className="w-full h-full flex items-center justify-center bg-white relative"
//               style={{ 
//                 border: '10px solid #CF323240',
//                 borderRadius: '6px'
//               }}
//             >
//               <Image 
//                 src={formData.uploadedImage}
//                 alt="Uploaded signature"
//                 className="max-w-full max-h-full object-contain"
//                 style={{ maxWidth: '100%', maxHeight: '100%' }}
//                 width={400}
//                 height={186}
//               />
//               {/* Clear/Remove image button */}
//               <button
//                 onClick={() => handleInputChange('uploadedImage', null)}
//                 className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
//               >
//                 ×
//               </button>
//             </div>
//           ) : (
//             /* Draw on box */
//             <div className='firstVerifyScreen' style={{height:185, position: 'relative'}}>
//               <canvas
//                 ref={canvasRef}
//                 className="w-full h-full bg-white rounded-[6px]"
//                 onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
//                 onMouseMove={(e) => draw(e.clientX, e.clientY)}
//                 onMouseUp={endDrawing}
//                 onMouseLeave={endDrawing}
//                 onTouchStart={(e) => {
//                   const t = e.touches[0];
//                   startDrawing(t.clientX, t.clientY);
//                 }}
//                 onTouchMove={(e) => {
//                   const t = e.touches[0];
//                   draw(t.clientX, t.clientY);
//                 }}
//                 onTouchEnd={endDrawing}
//               />
//               {/* Clear canvas button */}
//               {hasDrawn && (
//                 <button
//                   type="button"
//                   onClick={clearSignature}
//                   className="absolute top-2 right-2 rounded px-2 py-1 text-xs transition-colors"
//                   style={{ backgroundColor: '#CF3232', color: '#FFFFFF' }}
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Hidden File Input */}
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleFileUpload}
//             className="hidden"
//           />

//           {/* Upload Button - Bottom Right */}
//           <button 
//             onClick={handleUploadClick}
//             className="absolute bottom-5 right-5 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
//           >
//             <Upload size={16} color="#8B8B8B" />
//             <span className="text-sm text-gray-600 font-outfit">Upload</span>
//           </button>
//         </div>

//         {/* Description Text */}
//         <p className="font-outfit font-medium max-w-2xl mx-auto leading-relaxed text-start px-4" 
//           style={{ fontSize: '16px', color: "#00000099" }}>
//           By signing below, you confirm your details and agree to be featured as a verified contributor.
//         </p>

//         {/* Options */}
//         <div className="space-y-4 max-w-2xl mx-auto text-left px-4 mb-[45]">
//           <label className="flex items-start space-x-3 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={formData.confirmInfo}
//               onChange={(e) => handleInputChange('confirmInfo', e.target.checked)}
//               className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2"
//               style={{ accentColor: '#CF3232' }}
//             />
//             <span className="font-outfit font-medium text-sm sm:text-base" style={{color:"#00000099"}}>
//               I confirm all information provided is accurate.
//             </span>
//           </label>

//           <label className="flex items-start space-x-3 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={formData.giveConsent}
//               onChange={(e) => handleInputChange('giveConsent', e.target.checked)}
//               className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2"
//               style={{ accentColor: '#CF3232' }}
//             />
//             <span className="font-outfit font-medium text-sm sm:text-base" style={{color:"#00000099"}}>
//               I give consent to feature my name and contributions.
//             </span>
//           </label>

//           <label className="flex items-start space-x-3 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={formData.agreeTerms}
//               onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
//               className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2"
//               style={{ accentColor: '#CF3232' }}
//             />
//             <span className="font-outfit font-medium text-sm sm:text-base" style={{color:"#00000099"}}>
//               I agree to the Terms of Use and Privacy Policy.
//             </span>
//           </label>
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={handleSubmit}
//           disabled={!isFormValid}
//           className="custom-btn my-3 w-full"
//           style={{width:"100%"}}
//         >
//           Confirm & Submit Signature
//         </button>

//         {/* Error Message */}
//         {error && (
//           <p className="text-custom-red text-sm font-outfit">{error}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignSection;


"use client"

import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface SignSectionProps {
  onSubmit: (data: SignFormData) => void;
  className?: string;
  error?: string;
  isSubmitting?: boolean;
}

interface SignFormData {
  signature: string | null;
  confirmInfo: boolean;
  giveConsent: boolean;
  agreeTerms: boolean;
  uploadedImage: string | null;
  signatureFile: File | null;
  uploadedImageFile: File | null;
}

const SignSection: React.FC<SignSectionProps> = ({
  onSubmit,
  className,
  error,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    signature: null,
    confirmInfo: false,
    giveConsent: false,
    agreeTerms: false,
    uploadedImage: null,
    signatureFile: null,
    uploadedImageFile: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | string | null | File) => {
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
        handleInputChange('uploadedImageFile', file);
        console.log('Image uploaded successfully:', file.name);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = formData.confirmInfo && formData.giveConsent && formData.agreeTerms && 
    (formData.signature || formData.uploadedImage || formData.signatureFile || formData.uploadedImageFile);

  const setupCanvasForDpr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const needResize = canvas.width !== Math.max(1, Math.floor(rect.width * dpr)) || canvas.height !== Math.max(1, Math.floor(rect.height * dpr));
    if (needResize) {
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
    }
  };

  useEffect(() => {
    setupCanvasForDpr();
    const onResize = () => setupCanvasForDpr();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onResize);
      }
    };
  }, []);

  const getCanvasPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPos(clientX, clientY);
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawn(true);
  };

  const draw = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPos(clientX, clientY);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Save drawn signature as data URL and convert to File
    try {
      const dataUrl = canvas.toDataURL('image/png');
      handleInputChange('signature', dataUrl);
      
      // Convert dataURL to File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'signature.png', { type: 'image/png' });
          handleInputChange('signatureFile', file);
          console.log('Signature converted to file:', file.name, file.size, 'bytes');
        }
      }, 'image/png');
    } catch (error) {
      console.warn('Unable to export signature image:', error);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleInputChange('signature', null);
    handleInputChange('signatureFile', null);
    setHasDrawn(false);
  };

  // Touch event handlers with preventDefault to stop scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    startDrawing(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    if (!isDrawingRef.current) return;
    const touch = e.touches[0];
    draw(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent any default behavior
    endDrawing();
  };

  return (
    <div className={cn("text-center space-y-8 px-4 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        Add Your Signature to Lead with Intention
      </h2>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Signature Input Container */}
        <div className="relative mx-auto w-full max-w-2xl group" style={{ height: '186px' }}>
          {/* Conditional Rendering: Draw box (canvas) or Image Display */}
          {formData.uploadedImage ? (
            /* Show uploaded image */
            <div 
              className="w-full h-full flex items-center justify-center bg-white relative transform hover:scale-[1.02] transition-all duration-300"
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
                onClick={() => {
                  handleInputChange('uploadedImage', null);
                  handleInputChange('uploadedImageFile', null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
              >
                ×
              </button>
            </div>
          ) : (
            /* Draw on box */
            <div className='firstVerifyScreen' style={{height:185, position: 'relative'}}>
              <canvas
                ref={canvasRef}
                className="w-full h-full bg-white rounded-[6px] transition-all duration-300 group-hover:shadow-lg"
                style={{ touchAction: 'none' }} // Disable touch scrolling on canvas
                onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
                onMouseMove={(e) => draw(e.clientX, e.clientY)}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={endDrawing} // Handle touch cancel events
              />
              {/* Clear canvas button */}
              {hasDrawn && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="absolute top-2 right-2 rounded px-2 py-1 text-xs transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: '#CF3232', color: '#FFFFFF' }}
                >
                  Clear
                </button>
              )}
            </div>
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
            className="absolute bottom-5 right-5 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm transform hover:scale-105 hover:-translate-y-1"
          >
            <Upload size={16} color="#8B8B8B" />
            <span className="text-sm text-gray-600 font-outfit">Upload</span>
          </button>
        </div>

        {/* Description Text */}
        <p className="font-outfit font-medium max-w-2xl mx-auto leading-relaxed text-start px-4 animate-fade-in" 
          style={{ fontSize: '16px', color: "#00000099" }}>
          By signing below, you confirm your details and agree to be featured as a verified contributor.
        </p>

        {/* Options */}
        <div className="space-y-4 max-w-2xl mx-auto text-left px-4 mb-[45]">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.confirmInfo}
              onChange={(e) => handleInputChange('confirmInfo', e.target.checked)}
              className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2 transition-all duration-300 transform group-hover:scale-110"
              style={{ accentColor: '#CF3232' }}
            />
            <span className="font-outfit font-medium text-sm sm:text-base transition-colors duration-300 group-hover:text-gray-700" style={{color:"#00000099"}}>
              I confirm all information provided is accurate.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.giveConsent}
              onChange={(e) => handleInputChange('giveConsent', e.target.checked)}
              className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2 transition-all duration-300 transform group-hover:scale-110"
              style={{ accentColor: '#CF3232' }}
            />
            <span className="font-outfit font-medium text-sm sm:text-base transition-colors duration-300 group-hover:text-gray-700" style={{color:"#00000099"}}>
              I give consent to feature my name and contributions.
            </span>
            </label>

          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
              className="mt-1 w-5 h-5 text-custom-red border-2 border-gray-300 rounded focus:ring-custom-red focus:ring-2 transition-all duration-300 transform group-hover:scale-110"
              style={{ accentColor: '#CF3232' }}
            />
            <span className="font-outfit font-medium text-sm sm:text-base transition-colors duration-300 group-hover:text-gray-700" style={{color:"#00000099"}}>
              I agree to the Terms of Use and Privacy Policy.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || !!isSubmitting}
          className={`custom-btn my-3 w-full transition-all duration-300 ${
            !isFormValid || isSubmitting 
              ? 'opacity-50 cursor-not-allowed transform-none' 
              : 'transform hover:scale-105 hover:-translate-y-1 active:scale-95'
          }`}
          style={{width:"100%"}}
          aria-busy={isSubmitting ? true : undefined}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm & Submit Signature'}
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SignSection;