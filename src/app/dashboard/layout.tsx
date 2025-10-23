"use client";

import React from 'react';
import { UserProvider, AuthGuard, LoadingScreen, useUser, ErrorBoundary } from '@/components';

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const DashboardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isInitialLoading } = useUser();
    
    if (isInitialLoading) {
      return <LoadingScreen  text1="Loading your dashboard..." text2="Please wait while we fetch your profile data"/>;
    }
    
    return (
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    );
  };

  return (
    <ErrorBoundary>
      <AuthGuard>
        <UserProvider>
          <DashboardContent>
            {children}
          </DashboardContent>
        </UserProvider>
      </AuthGuard>
    </ErrorBoundary>
  );
}



