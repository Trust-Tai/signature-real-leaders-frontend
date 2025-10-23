"use client";

import React from 'react';
import { UserProvider, ErrorBoundary } from '@/components';

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <UserProvider>
        {children}
      </UserProvider>
    </ErrorBoundary>
  );
}