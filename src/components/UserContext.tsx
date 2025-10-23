"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  registered_date: string;
  signature_url: string;
  profile_picture_url: string;
  first_name: string;
  last_name: string;
  company_name: string;
  company_website: string;
  industry: string;
  num_employees: string;
  email_list_size: string;
  newsletter_service: string;
  audience_description: string;
  success_metrics: {
    numberOfBookings: string;
    emailListSize: string;
    amountInSales: string;
    amountInDonations: string;
  };
  links: Array<{ name: string; url: string }>;
  account_status: string;
  profile_template: {
    id: number;
    title: string;
    image_url: string;
    image_alt: string;
  };
  hubspot_data: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUserDetails: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  clearUser: () => void;
  isInitialLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        setIsInitialLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await api.getUserDetails(token);
      
      clearTimeout(timeoutId);
      
      if (response.success) {
        setUser(response.user);
      } else {
        setError('Failed to fetch user details');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timeout - please try again');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      }
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
    setIsInitialLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUserDetails();
    } else {
      setIsInitialLoading(false);
    }
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    fetchUserDetails,
    updateUser,
    clearUser,
    isInitialLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
