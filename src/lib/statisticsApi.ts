// Statistics API service for tracking profile visits and link clicks

const BASE_URL = 'https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/statistics';

export interface RecordInteractionRequest {
  user_id: number;
  action: 'visit' | 'link_click';
  link_url?: string;
}

export interface RecordVisitResponse {
  success: boolean;
  message: string;
  action: 'visit';
  visit_id: number;
}

export interface RecordLinkClickResponse {
  success: boolean;
  message: string;
  action: 'link_click';
  click_id: number;
  link_name: string;
}

export type RecordInteractionResponse = RecordVisitResponse | RecordLinkClickResponse;

/**
 * Record a profile visit
 */
export const recordProfileVisit = async (userId: number): Promise<RecordVisitResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/record-interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        action: 'visit'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error recording profile visit:', error);
    throw error;
  }
};

/**
 * Record a link click
 */
export const recordLinkClick = async (userId: number, linkUrl: string): Promise<RecordLinkClickResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/record-interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        action: 'link_click',
        link_url: linkUrl
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error recording link click:', error);
    throw error;
  }
};

/**
 * Generic function to record any interaction
 */
export const recordInteraction = async (params: RecordInteractionRequest): Promise<RecordInteractionResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/record-interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error recording interaction:', error);
    throw error;
  }
};

// Dashboard Statistics Interfaces
export interface VisitData {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  referrer: string;
  page_url: string;
  device_type: string;
  browser: string;
  os: string;
  country: string;
  city: string | null;
  visitor_user_id: string;
  visitor_age_group: string | null;
  visitor_role: string;
  visit_date: string;
  visit_time: string;
  created_at: string;
}

export interface VisitTrend {
  visit_date: string;
  visit_count: string;
}

export interface AudienceDemographic {
  countries: string;
  age_groups: string;
  devices: string;
  top_roles: string;
  percentage: number;
}

export interface DashboardStatistics {
  total_visits: string;
  unique_visitors: string;
  today_visits: string;
  this_week_visits: VisitData[];
  this_month_visits: VisitData[];
  total_link_clicks: string | null;
  top_clicked_links: unknown[];
  today_link_clicks: string | null;
  top_referrers: unknown[];
  recent_visits: VisitData[];
  visit_trends: VisitTrend[];
  total_bookings: number;
  total_contacts: number;
  audience_demographics: AudienceDemographic[];
}

export interface DashboardStatsResponse {
  success: boolean;
  statistics: DashboardStatistics;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (token: string): Promise<DashboardStatsResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/profile-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    throw error;
  }
};