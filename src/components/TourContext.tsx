"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TourContextType {
  hasSeenTour: boolean;
  isTourOpen: boolean;
  startTour: () => void;
  closeTour: () => void;
  completeTour: () => void;
  resetTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  // Check localStorage on mount with proper error handling
  useEffect(() => {
    try {
      const tourSeen = localStorage.getItem('realLeaders-tour-completed');
      setHasSeenTour(tourSeen === 'true');
      
      // If user hasn't seen the tour, show it after a short delay
      if (tourSeen !== 'true') {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 3000); // Increased delay to ensure page is fully loaded
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      // If localStorage fails, don't show tour automatically
    }
  }, []);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const completeTour = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    try {
      localStorage.setItem('realLeaders-tour-completed', 'true');
    } catch (error) {
      console.warn('Error saving tour completion to localStorage:', error);
    }
  };

  const resetTour = () => {
    setHasSeenTour(false);
    setIsTourOpen(false);
    try {
      localStorage.removeItem('realLeaders-tour-completed');
    } catch (error) {
      console.warn('Error removing tour completion from localStorage:', error);
    }
  };

  const value: TourContextType = {
    hasSeenTour,
    isTourOpen,
    startTour,
    closeTour,
    completeTour,
    resetTour,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = (): TourContextType => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
