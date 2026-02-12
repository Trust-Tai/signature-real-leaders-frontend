import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/toast';

interface UseAutoLoginReturn {
  isLoading: boolean;
  error: string | null;
  autoLogin: (redirectUrl?: string) => Promise<void>;
  clearError: () => void;
}

export const useAutoLogin = (): UseAutoLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoLogin = useCallback(async (redirectUrl?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get auth token from localStorage
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('No authentication token found. Please log in first.');
      }

      console.log('[AutoLogin] Starting auto-login process...', { redirectUrl });
      
     

      // Call auto-login API
      const response = await api.autoLogin(authToken, redirectUrl);

      if (response.success) {
        console.log('[AutoLogin] Auto-login successful:', response);
        


        // If we get a login URL or redirect URL, open it in a new tab
        const targetUrl = response.login_url || response.redirect_url || redirectUrl;
        if (targetUrl) {
          console.log('[AutoLogin] Opening WordPress in new tab:', targetUrl);
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      } else {
        const errorMessage = response.message || 'Auto-login failed';
        console.error('[AutoLogin] Auto-login failed:', errorMessage);
        setError(errorMessage);
        toast.error(`Auto-login failed: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
     
      setError(errorMessage);
      toast.error(`Connection failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    autoLogin,
    clearError,
  };
};