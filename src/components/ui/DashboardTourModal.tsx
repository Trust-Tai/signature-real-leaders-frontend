"use client";

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, LayoutDashboardIcon, Calendar, Mail, Users, Eye, Send, SquarePlus } from 'lucide-react';

interface TourStep {
  id: number;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  features: string[];
  color: string;
}

interface DashboardTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const DashboardTourModal: React.FC<DashboardTourModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      id: 1,
      title: "Welcome to Your Dashboard",
      icon: LayoutDashboardIcon,
      description: "Let's take a quick tour of your RealLeaders dashboard and show you what you can do.",
      features: [
        "Track your performance metrics in real-time",
        "Manage your content across all platforms", 
        "Generate AI-powered content automatically"
      ],
      color: "#CF3232"
    },
    {
      id: 2,
      title: "Bookings This Month",
      icon: Calendar,
      description: "Monitor your speaking engagements and consultations",
      features: [
        "Total number of scheduled appearances",
        "Track month-over-month growth",
        "Never miss an important booking"
      ],
      color: "#CF3232"
    },
    {
      id: 3,
      title: "Newsletter Subscribers",
      icon: Mail,
      description: "Manage your email marketing and subscriber growth",
      features: [
        "View subscriber count and growth trends",
        "Track email engagement metrics",
        "Export subscriber lists for campaigns"
      ],
      color: "#CF3232"
    },
    {
      id: 4,
      title: "Followers",
      icon: Users,
      description: "Track your social media and platform following",
      features: [
        "Monitor follower growth across platforms",
        "View engagement rates and interactions",
        "Identify your most active audience segments"
      ],
      color: "#CF3232"
    },
    {
      id: 5,
      title: "Page Views",
      icon: Eye,
      description: "Analyze your signature page performance",
      features: [
        "Track total page views and unique visitors",
        "Monitor page performance over time",
        "Identify peak traffic periods"
      ],
      color: "#CF3232"
    },
    {
      id: 6,
      title: "Total Link Clicks",
      icon: Send,
      description: "Measure engagement with your shared links",
      features: [
        "Track clicks across all your shared links",
        "Identify most popular content and resources",
        "Optimize link placement for better engagement"
      ],
      color: "#CF3232"
    },
    {
      id: 7,
      title: "Audience Demographics",
      icon: SquarePlus,
      description: "Understand your audience composition and behavior",
      features: [
        "View geographic distribution of your audience",
        "Analyze age groups and professional roles",
        "Track device usage and engagement patterns"
      ],
      color: "#CF3232"
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${currentStepData.color}20` }}
            >
              <currentStepData.icon 
                className="w-6 h-6" 
                style={{ color: currentStepData.color }}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {tourSteps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                backgroundColor: currentStepData.color
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {currentStepData.description}
          </p>
          
          <div className="space-y-4">
            {currentStepData.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: currentStepData.color }}
                />
                <p className="text-gray-600 leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          {/* Carousel Dots */}
          <div className="flex justify-center space-x-2 mb-4">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-[#CF3232] scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Skip Tour
            </button>
            
            <div className="flex items-center space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-6 py-2 text-white rounded-lg font-medium transition-colors flex items-center"
                style={{ backgroundColor: currentStepData.color }}
              >
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < tourSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTourModal;
