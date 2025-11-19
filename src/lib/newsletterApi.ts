// Newsletter API functions for managing subscribers
import { authFetch } from './authUtils';

const BASE_URL = 'https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter';

export interface NewsletterStats {
  success: boolean;
  data: {
    marketing_platform: string;
    account_name: string;
    total_subscribers: number;
    active_subscribers: number;
    unsubscribed_users: number;
    monthly_growth_rate: number;
    last_updated: string;
  };
}

export interface Subscriber {
  name: string;
  email: string;
  status: string;
  date_joined: string;
  list_name: string;
}

export interface NewsletterSubscribers {
  success: boolean;
  data: {
    marketing_platform?: string;
    subscribers: Subscriber[];
    secondary_newsletter?: Subscriber[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
    last_updated: string;
  };
}

export interface SubscriberFilters {
  status?: 'active' | 'unsubscribed';
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

// Get newsletter statistics
export const getNewsletterStats = async (): Promise<NewsletterStats> => {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    const response = await authFetch(`${BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.code === 'no_platform') {
        throw new Error('NO_NEWSLETTER_SERVICE');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    throw error;
  }
};

// Get all subscribers with optional filters
export const getNewsletterSubscribers = async (filters?: SubscriberFilters): Promise<NewsletterSubscribers> => {
  try {
    const authToken = localStorage.getItem('auth_token');
    const url = new URL(`${BASE_URL}/subscribers`);
    
    // Add query parameters if filters are provided
    if (filters) {
      if (filters.status) url.searchParams.append('status', filters.status);
      if (filters.search) url.searchParams.append('search', filters.search);
      if (filters.date_from) url.searchParams.append('date_from', filters.date_from);
      if (filters.date_to) url.searchParams.append('date_to', filters.date_to);
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
      const errorData = await response.json().catch(() => ({}));
      if (errorData.code === 'no_platform') {
        throw new Error('NO_NEWSLETTER_SERVICE');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    throw error;
  }
};

// Helper function to format date for API
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to get date range based on filter selection
export const getDateRange = (range: string): { date_from?: string; date_to?: string } => {
  const now = new Date();
  const today = formatDateForAPI(now);
  
  switch (range) {
    case 'today':
      return { date_from: today, date_to: today };
    
    case 'week':
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return { date_from: formatDateForAPI(weekAgo), date_to: today };
    
    case 'month':
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return { date_from: formatDateForAPI(monthAgo), date_to: today };
    
    case 'quarter':
      const quarterAgo = new Date(now);
      quarterAgo.setMonth(now.getMonth() - 3);
      return { date_from: formatDateForAPI(quarterAgo), date_to: today };
    
    case 'year':
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      return { date_from: formatDateForAPI(yearAgo), date_to: today };
    
    default:
      return {};
  }
};

// Helper function to validate date range
export const validateDateRange = (dateFrom: string, dateTo: string): boolean => {
  if (!dateFrom || !dateTo) return true; // Allow empty dates
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  return from <= to;
};

// Helper function to get status display text
export const getStatusDisplayText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'unsubscribed':
      return 'Unsubscribed';
    case 'pending':
      return 'Pending';
    default:
      return status;
  }
};

// Helper function to format subscriber count
export const formatSubscriberCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Helper function to calculate growth percentage
export const calculateGrowthPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Add new subscriber to newsletter
export interface AddSubscriberPayload {
  email: string;
  first_name: string;
  last_name: string;
}

export interface AddSubscriberResponse {
  success: boolean;
  message: string;
  data: {
    platform: string;
    subscriber_id: string;
    email: string;
    status: string;
    list_id: string;
    list_name: string;
    created_at: string;
  };
}

export const addNewsletterSubscriber = async (payload: AddSubscriberPayload): Promise<AddSubscriberResponse> => {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    const response = await authFetch(`${BASE_URL}/add-subscriber`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding newsletter subscriber:', error);
    throw error;
  }
};