export const API_BASE_URL = 'https://verified.real-leaders.com/wp-json/verified-real-leaders/v1';

type JsonRecord = Record<string, unknown>;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const response = await fetch(url, options);
  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await response.json() : (undefined as unknown as T);
  if (!response.ok) {
    const message = isJson && (data as Record<string, unknown>)?.message ? 
      (data as Record<string, unknown>).message as string : response.statusText;
    throw new Error(message || 'Request failed');
  }
  return data as T;
}

export const api = {
  async sendVerificationCode(email: string) {
    return request<{ success: boolean; message?: string; code?: string }>(
      '/user/send-verification-code',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );
  },

  async verifyCode(email: string, code: string) {
    return request<{ success: boolean; auth_token?: string; message?: string }>(
      '/user/verify-code',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      }
    );
  },

  async getNewsletterServices() {
    return request<{ success: boolean; newsletter_services: Record<string, string> }>(
      '/user/newsletter-services',
      { method: 'GET' }
    );
  },

  async verifyNewsletterCredentials(payload: JsonRecord) {
    console.log("payload",payload)
    return request<{ success: boolean; message?: string }>(
      '/user/verify-api-key',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  },

  async getProfileTemplates() {
    return request<{ success: boolean; templates: Array<{ id: number; title: string; slug: string; image_url: string }> }>(
      '/user/profile-templates',
      { method: 'GET' }
    );
  },

  async submitUserInfo(authToken: string, payload: JsonRecord) {
    return request<{ success: boolean; user_id?: number; message?: string }>(
      '/user/submit-user-info',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken,
        },
        body: JSON.stringify(payload),
      }
    );
  },

  // Removed uploadSignature – signature is now included in submit-user-info payload

  async getUserDetails(authToken: string) {
    return request<{
      success: boolean;
      user: {
        id: number;
        username: string;
        email: string;
        display_name: string;
        registered_date: string;
        signature_url: string;
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
        links: string[];
        account_status: string;
        profile_template: {
          id: number;
          title: string;
          image_url: string;
          image_alt: string;
        };
        hubspot_data: string;
      };
    }>(
      '/user/user-details',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
  },

  async updateProfile(authToken: string, payload: JsonRecord) {
    return request<{
      success: boolean;
      message: string;
      updated_fields: string[];
      user_id: number;
    }>(
      '/user/update-profile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      }
    );
  },

  async updatePassword(authToken: string, currentPassword: string, newPassword: string) {
    return request<{
      success: boolean;
      message: string;
    }>(
      '/user/update-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      }
    );
  },

  async getFollowers(authToken: string, page: number = 1, perPage: number = 20) {
    return request<{
      success: boolean;
      followers: Array<{
        id: number;
        first_name: string;
        last_name: string;
        display_name: string;
        email: string;
        date_of_birth: string;
        occupation: string;
        company_name: string;
        date_followed: string;
        follow_id: number;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_followers: number;
        total_pages: number;
      };
    }>(
      `/get-followers?page=${page}&per_page=${perPage}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
  },

  async exportFollowersCSV(authToken: string) {
    return request<{
      success: boolean;
      csv_data: string;
    }>(
      '/export-followers-csv',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
  },

  async searchFollowers(authToken: string, query: string) {
    return request<{
      success: boolean;
      followers: Array<{
        id: number;
        first_name: string;
        last_name: string;
        display_name: string;
        email: string;
        date_of_birth: string;
        age: string;
        occupation: string;
        company_name: string;
        billing_country: string;
        billing_state: string;
        date_followed: string;
        follow_id: number;
      }>;
      search: {
        query: string;
        total_matches: number;
        total_followers: number;
      };
      pagination: {
        current_page: number;
        per_page: number;
        total_matches: number;
        total_pages: number;
        has_more: boolean;
      };
    }>(
      `/search-followers?q=${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
  },

  async getFollowerStats(authToken: string) {
    return request<{
      success: boolean;
      stats: {
        total_followers: number;
        current_month_followers: number;
        top_country: {
          name: string | null;
          count: number;
          percentage: number;
        };
        top_location: {
          name: string | null;
          count: number;
          percentage: number;
        };
        all_countries: Array<{ name: string; count: number; percentage: number }>;
        all_locations: Array<{ name: string; count: number; percentage: number }>;
      };
      period: {
        current_month: string;
        month_start: string;
        generated_at: string;
      };
    }>(
      '/get-follower-stats',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
  },
};


