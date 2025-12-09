import axios from 'axios';

// API Base URL - production backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://victorypizza-production.up.railway.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Order API Methods
export const orderAPI = {
  // Create a new order (public)
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get order by ID for tracking (public)
  getOrderById: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get all orders - requires authentication
  getAllOrders: async (filters?: { status?: string; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    const response = await api.get(url);
    return response.data;
  },

  // Update order status - requires authentication
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Confirm order receipt (public)
  confirmReceipt: async (orderId: string) => {
    const response = await api.post(`/orders/${orderId}/confirm`);
    return response.data;
  },

  // Add review to order (public)
  addReview: async (orderId: string, rating: number, comment?: string) => {
    const response = await api.post(`/orders/${orderId}/review`, { rating, comment });
    return response.data;
  },

  // Cancel order - requires authentication
  cancelOrder: async (orderId: string) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },

  // Delete order - permanent deletion
  deleteOrder: async (orderId: string) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },

  // Delete all completed orders
  deleteCompletedOrders: async () => {
    const response = await api.delete('/orders/bulk/completed');
    return response.data;
  },
};

// Auth API Methods
export const authAPI = {
  // Staff login - accepts email or username
  login: async (emailOrUsername: string, password: string) => {
    // Determine if input is email or username
    const isEmail = emailOrUsername.includes('@');
    const payload = isEmail 
      ? { email: emailOrUsername, password }
      : { username: emailOrUsername, password };
    
    const response = await api.post('/auth/login', payload);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register new user (admin only)
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.patch('/auth/password', { currentPassword, newPassword });
    return response.data;
  },

  // Update email
  updateEmail: async (newEmail: string) => {
    const response = await api.patch('/auth/email', { email: newEmail });
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await axios.get(`${API_URL.replace('/api', '')}/health`);
  return response.data;
};

export default api;
