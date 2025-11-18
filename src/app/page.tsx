'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components';

const Home = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // User is authenticated, redirect to dashboard
          router.replace('/dashboard');
        } else {
          // User is not authenticated, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        // If there's an error accessing localStorage, redirect to login
        console.error('Error checking authentication:', error);
        router.replace('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Small delay to ensure localStorage is available
    const timeoutId = setTimeout(checkAuthAndRedirect, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return <LoadingScreen text1="Checking authentication..." />;
  }

  // This should not render as user will be redirected
  return null;
};

export default Home;
