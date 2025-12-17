/**
 * API Client
 * Configured axios instance with interceptors for authentication
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {API_CONFIG} from '../../config/api.config';
import {storage} from '../../utils/storage';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add token to headers
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = await storage.getAccessToken();
    
    // Trim token to remove any whitespace issues
    if (token) {
      token = token.trim();
    }
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Production: Removed debug logging
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor - Handle token refresh and rate limiting
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful responses
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Handle rate limiting (429 Too Many Requests)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const retryCount = originalRequest._retryCount || 0;
      const maxRetries = 2; // Maximum 2 retries for rate limiting
      
      if (retryCount < maxRetries && !originalRequest._retry) {
        originalRequest._retry = true;
        originalRequest._retryCount = retryCount + 1;
        
        // Calculate wait time: use retry-after header if available, otherwise exponential backoff
        const waitTime = retryAfter 
          ? parseInt(retryAfter, 10) * 1000 
          : Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds
        
        // Rate limited - retry after wait time
        await new Promise<void>(resolve => setTimeout(() => resolve(), waitTime));
        
        return apiClient(originalRequest);
      } else {
        const errorData = error.response?.data as any;
        const errorMessage = errorData?.message || 'Too many requests. Please wait a moment and try again.';
        return Promise.reject(new Error(errorMessage));
      }
    }

    // Enhanced error logging for permission issues
    if (error.response?.status === 403 || error.response?.status === 401) {
      const errorData = error.response?.data as any;
      const errorMessage = errorData?.message || error.message || '';
      const isPermissionError = 
        error.response?.status === 403 ||
        errorMessage.toLowerCase().includes('permission') ||
        errorMessage.toLowerCase().includes('not authorized') ||
        errorMessage.toLowerCase().includes('forbidden');
      
      // Permission errors (403) are expected and handled gracefully
      // Authentication errors (401) will be handled by token refresh or logout
    }

    // If 401 error and not already retried, try to refresh token
    // Prevent infinite retry loops by checking retry count
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        if (refreshToken) {
          console.log('🔄 Attempting to refresh access token...');
          
          // Add a small delay to prevent rapid retries
          await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
          
          // Call refresh token endpoint
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh-token`,
            {refreshToken},
          );

          const {accessToken, refreshToken: newRefreshToken} =
            response.data.data;

          // Trim and save new tokens
          await storage.setAccessToken(accessToken.trim());
          if (newRefreshToken) {
            await storage.setRefreshToken(newRefreshToken.trim());
          }

          console.log('✅ Token refreshed successfully, retrying request...');

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken.trim()}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // If refresh token endpoint itself returns 429, don't retry
        // Rate limited during token refresh - handled by error message
        
        // Refresh token failed - clear tokens
        // User will be redirected to login on next app state change
        await storage.clearAll();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// API Error Type
export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Helper function to extract error message
export const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    // Handle network errors (no internet connection)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'Request timed out. Please check your internet connection and try again.';
      }
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        return 'No internet connection. Please check your network settings and try again.';
      }
      return 'Network error. Please check your internet connection and try again.';
    }
    
    const apiError = error.response?.data as ApiError;
    return apiError?.message || error.message || 'An error occurred. Please try again.';
  }
  return error.message || 'An unexpected error occurred. Please try again.';
};

export default apiClient;

