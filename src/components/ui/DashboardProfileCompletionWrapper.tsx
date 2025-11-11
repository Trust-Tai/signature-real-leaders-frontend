"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { api } from '@/lib/api';

export const DashboardProfileCompletionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [profileCompletion, setProfileCompletion] = useState<{
    percentage: number;
    incomplete_fields: string[];
  } | null>(null);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const userResponse = await api.getUserDetails(token);
        if (userResponse.success && userResponse.profile_completion) {
          const completion = userResponse.profile_completion;
          setProfileCompletion({
            percentage: completion.percentage,
            incomplete_fields: completion.missing_fields,
          });
        }
      } catch (err) {
        console.error('[ProfileCompletion] Error fetching profile completion:', err);
      }
    };

    fetchProfileCompletion();
  }, [pathname]);

  // Don't show on profile page
  const isProfilePage = pathname === '/dashboard/profile';
  
  // Only show if profile is incomplete
  const shouldShowCard = !isProfilePage && 
                         profileCompletion && 
                         profileCompletion.percentage < 100;

  return (
    <>
      {children}
      {shouldShowCard && (
        <ProfileCompletionCard
          incompleteFields={profileCompletion.incomplete_fields}
          completionPercentage={profileCompletion.percentage}
        />
      )}
    </>
  );
};
