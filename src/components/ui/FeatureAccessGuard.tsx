"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useUser } from '@/components/UserContext';

interface FeatureAccessGuardProps {
  children: React.ReactNode;
  featureName: string;
  redirectTo?: string;
}

const FeatureAccessGuard: React.FC<FeatureAccessGuardProps> = ({ 
  children, 
  featureName,
  redirectTo = '/dashboard'
}) => {
  const router = useRouter();
  const { user } = useUser();

  const ALLOWED_EMAIL = 'tayeshobajo@gmail.com';
  const hasAccess = user?.email === ALLOWED_EMAIL;

  // Show Coming Soon overlay for non-allowed users
  if (user && !hasAccess) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4 p-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 mb-4">
            <Lock className="w-12 h-12 text-yellow-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800">Coming Soon</h2>
          <p className="text-gray-600 max-w-md text-lg">
            {featureName} is currently in development and will be available soon.
          </p>
          <button
            onClick={() => router.push(redirectTo)}
            className="mt-6 px-6 py-3 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show content for allowed users
  return <>{children}</>;
};

export default FeatureAccessGuard;
