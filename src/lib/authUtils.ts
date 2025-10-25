// Auth utility functions for handling authentication and logout

/**
 * Clears authentication token and redirects to login page
 * This function should be called whenever a 401 unauthorized error occurs
 */
export const handleUnauthorized = () => {
  // Clear auth token from localStorage
  localStorage.removeItem('auth_token');
  
  // Clear any other auth-related data if needed
  localStorage.removeItem('user_data');
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Check if error is 401 unauthorized
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  const err = error as { status?: number; message?: string };
  return (err?.status === 401) || 
         (err?.message?.includes('401') ?? false) || 
         (err?.message?.toLowerCase().includes('unauthorized') ?? false);
};

/**
 * Enhanced fetch wrapper that handles 401 errors automatically
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    
    // Check for 401 unauthorized
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized - redirecting to login');
    }
    
    return response;
  } catch (error) {
    // Check if it's a 401 error in the catch block as well
    if (isUnauthorizedError(error)) {
      handleUnauthorized();
    }
    throw error;
  }
};