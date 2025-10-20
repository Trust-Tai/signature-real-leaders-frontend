"use client";

import React from 'react';
import { UserProvider, AuthGuard, LoadingScreen, useUser, TourProvider, InteractiveTour, useTour } from '@/components';

const DashboardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isInitialLoading } = useUser();
  const { isTourOpen, completeTour } = useTour();
  
  if (isInitialLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <>
      {children}
      <InteractiveTour 
        isActive={isTourOpen}
        onComplete={completeTour}
      />
    </>
  );
};

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <UserProvider>
        <TourProvider>
          <DashboardContent>
            {children}
          </DashboardContent>
        </TourProvider>
      </UserProvider>
    </AuthGuard>
  );
}



