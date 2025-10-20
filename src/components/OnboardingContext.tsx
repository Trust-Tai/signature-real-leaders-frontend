'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export interface SuccessMetrics {
  numberOfBookings?: string;
  emailListSize?: string;
  amountInSales?: string;
  amountInDonations?: string;
}

export interface NewsletterCredentials {
  service?: string; // mailchimp | hubspot
  api_key?: string;
  client_id?: string;
  client_secret?: string;
}

export interface OnboardingState {
  first_name?: string;
  last_name?: string;
  email?: string;
  auth_token?: string;

  company_name?: string;
  company_website?: string;
  industry?: string;
  num_employees?: string;
  email_list_size?: string;
  audience_description?: {
    name: string;
    age_range: string;
    demographic_details: string;
  };
  success_metrics?: SuccessMetrics;

  // Address Fields
  billing_address_1?: string;
  billing_address_2?: string;
  billing_city?: string;
  billing_postcode?: string;
  billing_country?: string;
  billing_phone?: string;

  // Additional Fields
  brand_voice?: string;
  unique_differentiation?: string;
  top_pain_points?: string;
  content_preference_industry?: string[];
  primary_call_to_action?: string;
  date_of_birth?: string;
  occupation?: string;

  newsletter?: NewsletterCredentials;
  profile_template_id?: number;
  links?: string[];
}

interface OnboardingContextValue {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>({});
  const value = useMemo(() => ({ state, setState }), [state]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};


