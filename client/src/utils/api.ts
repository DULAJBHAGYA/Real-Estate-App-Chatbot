const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// API utility functions
export const api = {
  // Generic fetch wrapper with authentication
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle token refresh if needed
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the original request with new token
        const newToken = localStorage.getItem('accessToken');
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return fetch(`${API_BASE_URL}${endpoint}`, config);
      }
    }
    
    return response;
  },

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    // Clear tokens if refresh failed
    this.logout();
    return false;
  },

  // Logout
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Auth endpoints
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return response.json();
    },

    register: async (userData: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      password: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return response.json();
    },

    logout: async () => {
      try {
        const response = await api.fetch('/auth/logout', { method: 'POST' });
        const result = await response.json();
        // Only logout locally if the API call was successful
        if (result.success) {
          api.logout();
        }
        return result;
      } catch (error) {
        console.error('Logout API error:', error);
        // Force logout even if API fails
        api.logout();
        return { success: false, message: 'Logout failed' };
      }
    },

    getMe: async () => {
      const response = await api.fetch('/auth/me');
      return response.json();
    },
  },

  // User endpoints
  user: {
    updateProfile: async (profileData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    }) => {
      const response = await api.fetch('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      return response.json();
    },

    deleteAccount: async () => {
      const response = await api.fetch('/user/account', {
        method: 'DELETE',
      });
      api.logout();
      return response.json();
    },
  },

  // Chat endpoints
  chat: {
    askQuestion: async (question: string) => {
      const response = await api.fetch('/chat/ask', {
        method: 'POST',
        body: JSON.stringify({ question }),
      });
      return response.json();
    },

    uploadDocument: async (content: string, filename: string) => {
      const response = await api.fetch('/chat/upload', {
        method: 'POST',
        body: JSON.stringify({ content, filename }),
      });
      return response.json();
    },

    getDocumentStats: async () => {
      const response = await api.fetch('/chat/documents');
      return response.json();
    },

    deleteAllDocuments: async () => {
      const response = await api.fetch('/chat/documents', {
        method: 'DELETE',
      });
      return response.json();
    },

    initializeDatabase: async () => {
      const response = await api.fetch('/chat/init', {
        method: 'POST',
      });
      return response.json();
    },
  },


};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
};

// Get current user
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
