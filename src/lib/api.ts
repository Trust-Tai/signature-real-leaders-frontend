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
};


