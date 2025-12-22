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

// Export subscribers as CSV
export interface ExportCSVPayload {
  date_from?: string; // YYYY-MM-DD format
  date_to?: string; // YYYY-MM-DD format
  search?: string; // specific export by search
  selected_emails?: string[]; // Array of selected email addresses to export
}

export interface ExportCSVResponse {
  success: boolean;
  message: string;
  data: {
    download_url: string;
    total_subscribers: number;
    export_type: string;
    selected_count: number | null;
    filters_applied: {
      status: string;
      date_from: string;
      date_to: string;
      search: string;
      selected_emails: string[] | null;
    };
    generated_at: string;
  };
}

export const exportSubscribersCSV = async (payload: ExportCSVPayload = {}): Promise<ExportCSVResponse> => {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    const response = await authFetch(`${BASE_URL}/export-csv`, {
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
    console.error('Error exporting subscribers CSV:', error);
    throw error;
  }
};

// Add subscriber to specific user's newsletter (for public profiles)
export interface AddSubscriberToUserPayload {
  email: string;
  first_name: string;
  last_name: string;
}

export interface AddSubscriberToUserResponse {
  success: boolean;
  message: string;
  data: {
    platform: string;
    subscriber_id: number;
    email: string;
    status: string;
    list_name: string;
    created_at: string;
  };
}

export const addSubscriberToUser = async (userId: number, payload: AddSubscriberToUserPayload): Promise<AddSubscriberToUserResponse> => {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    const response = await fetch(`https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/add-subscriber/${userId}`, {
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
    console.error('Error adding subscriber to user:', error);
    throw error;
  }
};

// Activate a subscriber
export interface ActivateSubscriberPayload {
  email: string;
}

export interface ActivateSubscriberResponse {
  success: boolean;
  message: string;
  data: {
    platform: string;
    subscriber_id: number;
    email: string;
    status: string;
    name: string;
  };
}

export const activateSubscriber = async (payload: ActivateSubscriberPayload): Promise<ActivateSubscriberResponse> => {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    const response = await authFetch('https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/activate-subscriber', {
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
    console.error('Error activating subscriber:', error);
    throw error;
  }
};

// Deactivate a subscriber
export interface DeactivateSubscriberPayload {
  email: string;
}

export interface DeactivateSubscriberResponse {
  success: boolean;
  message: string;
  data: {
    platform: string;
    subscriber_id: number;
    email: string;
    status: string;
    name: string;
  };
}

export const deactivateSubscriber = async (payload: DeactivateSubscriberPayload): Promise<DeactivateSubscriberResponse> => {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    const response = await authFetch('https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/deactivate-subscriber', {
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
    console.error('Error deactivating subscriber:', error);
    throw error;
  }
};

