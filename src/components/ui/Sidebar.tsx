import React from "react";
import { cn } from "@/lib/utils";
import { Step } from "../types";
import { CheckIcon } from "@/assets";
import Image, { StaticImageData } from "next/image";
import {images} from "../../assets/index"

interface SidebarProps {
  steps: Step[];
  className?: string;
  imageUrl?: string | StaticImageData;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  steps, 
  className, 
  imageUrl, 
  isMobileOpen = false,
  onMobileToggle 
}) => {
  const getStepIcon = (step: Step) => {
    switch (step.status) {
      case "completed":
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
            <CheckIcon size={16} color="white" className="sm:w-5 sm:h-5" />
          </div>
        );
      case "current":
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
            <CheckIcon size={16} color="white" className="sm:w-5 sm:h-5" />
          </div>
        );
      case "pending":
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 text-white rounded-full flex items-center justify-center mr-3 sm:mr-4 font-bold text-xs sm:text-sm border-2 border-gray-500">
            {step.id}
          </div>
        );
    }
  };

  const getStepTextColor = (step: Step) => {
    switch (step.status) {
      case "completed":
      case "current":
        return "text-white";
      case "pending":
        return "text-gray-300";
    }
  };

  const sidebarContent = (
    <div
      className={cn(
        "relative h-full w-full xl:w-[320px] xl:flex-shrink-0 text-white p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden",
        className
      )}
    >
      {/* Background Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Sidebar background"
          fill
          priority
          className="object-cover"
        />
      )}

      {/* Background overlay */}
      <div className="absolute inset-0" style={{
        background: '#0F1222F2',
        backgroundBlendMode: 'multiply'
      }} />

      <div className="relative z-10">
        {/* Mobile close button */}
        <div className="xl:hidden flex justify-end mb-4">
          <button
            onClick={onMobileToggle}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center mb-8 sm:mb-10 lg:mb-12 mt-[30]">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold font-abolition flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            {/* Desktop: Show sideToolBar image */}
            <div className="hidden xl:block">
              <Image
                src={images.sideToolBar}
                alt="Sidebar toolbar"
                className="w-6 h-6 sm:w-8 sm:h-[22px]"
              />
            </div>
            <Image
              src={images.realLeaders}
              alt="Real Leaders"
              className="realLeadersLogo"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 sm:space-y-6 relative mt-[60]">
          {/* Gray line */}
          <div className="absolute left-3 sm:left-4 top-3 sm:top-4 bottom-0 w-0.5 bg-gray-600"></div>

          {/* Green line for completed steps */}
          {(() => {
            const completedSteps = steps.filter(
              (step) => step.status === "completed"
            );
            if (completedSteps.length > 0) {
              const lastCompletedIndex = steps.findIndex(
                (step) => step.status === "completed"
              );
              const height = (lastCompletedIndex + 1) * 96;
              return (
                <div
                  className="absolute left-3 sm:left-4 top-3 sm:top-4 w-0.5 bg-green-500 z-10"
                  style={{ height: `${height}px` }}
                />
              );
            }
            return null;
          })()}

          {steps.map((step) => (
            <div key={step.id} className="flex items-center relative z-20 mb-[50]">
              {getStepIcon(step)}
              <span className={cn("font-outfit font-medium text-sm sm:text-base", getStepTextColor(step))}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // If this is a mobile sidebar (has mobile props), render with overlay
  if (onMobileToggle !== undefined) {
    return (
      <>
        {/* Mobile overlay */}
        {isMobileOpen && (
          <div 
            className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={onMobileToggle}
          />
        )}
        
        {/* Mobile sidebar */}
        <div className={cn(
          "xl:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop sidebar - just return the content
  return sidebarContent;
};

export default Sidebar;
