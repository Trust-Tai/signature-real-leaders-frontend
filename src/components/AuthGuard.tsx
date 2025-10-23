"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LoadingScreen } from '@/components';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      
      // If no token and trying to access dashboard routes, redirect immediately
      if (!token && pathname.startsWith('/dashboard')) {
        router.replace('/login');
        setIsAuthenticated(false);
        return;
      }
      
      // If token exists or not accessing protected routes, allow access
      setIsAuthenticated(!!token || !pathname.startsWith('/dashboard'));
    };

    // Check immediately without delay
    checkAuth();
  }, [pathname, router]);

  // If not authenticated and trying to access dashboard, don't render anything
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return null;
  }

  // Show loading while checking authentication for non-dashboard routes
  if (isAuthenticated === null && !pathname.startsWith('/dashboard')) {
    return <LoadingScreen text1="Checking authentication..." text2="Please wait" />;
  }

  return <>{children}</>;
};

export default AuthGuard;