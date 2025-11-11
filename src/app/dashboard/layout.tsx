"use client";

import React from 'react';
import { UserProvider, AuthGuard, LoadingScreen, useUser, ErrorBoundary } from '@/components';
import { DashboardProfileCompletionWrapper } from '@/components/ui/DashboardProfileCompletionWrapper';

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const DashboardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isInitialLoading } = useUser();
    
    if (isInitialLoading) {
      return <LoadingScreen  text1="Loading......."/>;
    }
    
    return (
      <ErrorBoundary>
        <DashboardProfileCompletionWrapper>
          {children}
        </DashboardProfileCompletionWrapper>
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



