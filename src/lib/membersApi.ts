// Members API functions for managing Real Leaders members
import { authFetch } from './authUtils';
import { API_BASE_URL } from './config';

export interface Member {
  post_id: number;
  user_id: number;
  profile_name: string;
  email: string;
  website: string;
  linkedin: string;
  first_name: string;
  last_name: string;
  company_name: string;
  industry: string;
}

export interface MembersResponse {
  data: Member[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface MembersFilters {
  search?: string;
  industry?: string;
  page?: number;
  per_page?: number;
}

// Get all members with optional filters
export const getMembers = async (filters?: MembersFilters): Promise<MembersResponse> => {
  try {
    const authToken = localStorage.getItem('auth_token');
    const url = new URL(`${API_BASE_URL}/claim-profile/list`);
    
    // Add query parameters if filters are provided
    if (filters) {
      if (filters.search) url.searchParams.append('search', filters.search);
      if (filters.industry) url.searchParams.append('industry', filters.industry);
      if (filters.page) url.searchParams.append('page', filters.page.toString());
      if (filters.per_page) url.searchParams.append('per_page', filters.per_page.toString());
    }

    const response = await authFetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

// Helper function to get unique industries from members
export const getUniqueIndustries = (members: Member[]): string[] => {
  const industries = members.map(member => member.industry).filter(Boolean);
  return Array.from(new Set(industries)).sort();
};

// Helper function to format member count
export const formatMemberCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
