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
    console.log("authToken",authToken)
    return request<{
      success: boolean;
      user: {
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

  async autoLogin(authToken: string, redirectUrl?: string) {
    return request<{
      success: boolean;
      message?: string;
      redirect_url?: string;
      login_url?: string;
    }>(
      '/auth/auto-login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          redirect_url: redirectUrl || 'https://verified.real-leaders.com/about-us'
        }),
      }
    );
  },

  async getPublicProfile(username: string) {
    return request<{
      success: boolean;
      profile: {
        user_id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        full_name: string;
        description: string;
        company_name: string;
        company_website: string;
        industry: string;
        newsletter_service: string;
        occupation: string;
        location: string;
        profile_image: string;
        profile_picture_url: string;
        signature_url: string;
        links: Array<{
          key: number;
          label: string;
          value: string;
          url: string;
          icon: string;
        }>;
        primary_call_to_action: string;
        profile_template: {
          id: number;
          title: string;
          image_url: string;
          image_alt: string;
        };
        profile_privacy: string;
      };
      meta: {
        total_links: number;
        profile_url: string;
        last_updated: string;
      };
    }>(
      `/profile/${username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },

  async followUser(userId: number, optIn: boolean = false) {
    const authToken = localStorage.getItem('auth_token');
    const url = 'https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/follow-user';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: JSON.stringify({ user_id: userId, opt_in: optIn }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to follow user');
    }
    
    return data as {
      success: boolean;
      message: string;
      follow_id: number;
      follower: {
        id: number;
        name: string;
      };
      followed_user: {
        id: number;
        name: string;
      };
    };
  },

  async unfollowUser(userId: number) {
    const authToken = localStorage.getItem('auth_token');
    const url = 'https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/unfollow-user';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: JSON.stringify({ user_id: userId }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to unfollow user');
    }
    
    return data as {
      success: boolean;
      message: string;
      unfollowed_user: {
        id: number;
        name: string;
      };
    };
  },

  async checkFollowStatus(userId: number) {
    const authToken = localStorage.getItem('auth_token');
    const url = `https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/check-follow-status?user_id=${userId}`;
  const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
  }
});
console.log("response>>>>",response)
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check follow status');
    }
    
    return data as {
      success: boolean;
      is_following: boolean;
      follow_id?: number;
    };
  },
};


