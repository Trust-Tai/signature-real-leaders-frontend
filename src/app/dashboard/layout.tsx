"use client";

import React from 'react';
import { UserProvider, AuthGuard, LoadingScreen, useUser, TourProvider, InteractiveTour, useTour, ErrorBoundary } from '@/components';

const DashboardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isInitialLoading } = useUser();
  const { isTourOpen, completeTour } = useTour();
  
  if (isInitialLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <ErrorBoundary>
      {children}
      <InteractiveTour 
        isActive={isTourOpen}
        onComplete={completeTour}
      />
    </ErrorBoundary>
  );
};

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <UserProvider>
          <TourProvider>
            <DashboardContent>
              {children}
            </DashboardContent>
          </TourProvider>
        </UserProvider>
      </AuthGuard>
    </ErrorBoundary>
  );
}



