/**
 * API Client for Namsor Accounting System
 * Handles all HTTP requests to backend with JWT authentication
 */

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : '/api';

let authToken = localStorage.getItem('authToken');

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

const getHeaders = (contentType = 'application/json') => {
  const headers = { 'Content-Type': contentType };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const apiCall = async (method, endpoint, data = null) => {
  const options = {
    method,
    headers: getHeaders()
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
      // Token expired or invalid
      setAuthToken(null);
      window.location.href = '/login.html';
      return null;
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `API Error: ${response.status}`);
    }

    return result;
  } catch (err) {
    console.error(`API Error [${method} ${endpoint}]:`, err);
    throw err;
  }
};

// Auth API
export const Auth = {
  login: (email, password) => apiCall('POST', '/auth/login', { email, password }),
  register: (email, password, fullName) => apiCall('POST', '/auth/register', { email, password, fullName }),
  getCurrentUser: () => apiCall('GET', '/auth/me'),
  getAllUsers: () => apiCall('GET', '/auth/users'),
  updateUser: (id, data) => apiCall('PUT', `/auth/users/${id}`, data)
};

// Transactions API
export const Transactions = {
  create: (data) => apiCall('POST', '/transactions', data),
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    return apiCall('GET', `/transactions?${params.toString()}`);
  },
  get: (id) => apiCall('GET', `/transactions/${id}`),
  update: (id, data) => apiCall('PUT', `/transactions/${id}`, data),
  delete: (id) => apiCall('DELETE', `/transactions/${id}`),
  getSummary: (month, year) => apiCall('GET', `/transactions/summary?month=${month}&year=${year}`),
  getMonthlyChart: (year) => apiCall('GET', `/transactions/chart/monthly?year=${year}`)
};

// Purchase API
export const Purchase = {
  create: (data) => apiCall('POST', '/purchase', data),
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    return apiCall('GET', `/purchase?${params.toString()}`);
  },
  get: (id) => apiCall('GET', `/purchase/${id}`),
  update: (id, data) => apiCall('PUT', `/purchase/${id}`, data),
  delete: (id) => apiCall('DELETE', `/purchase/${id}`)
};

// Budget API
export const Budget = {
  create: (data) => apiCall('POST', '/budget', data),
  getAll: (year, month) => apiCall('GET', `/budget?year=${year}&month=${month}`),
  get: (id) => apiCall('GET', `/budget/${id}`),
  update: (id, data) => apiCall('PUT', `/budget/${id}`, data),
  delete: (id) => apiCall('DELETE', `/budget/${id}`)
};

// Employees API
export const Employees = {
  create: (data) => apiCall('POST', '/employees', data),
  getAll: () => apiCall('GET', '/employees'),
  get: (id) => apiCall('GET', `/employees/${id}`),
  update: (id, data) => apiCall('PUT', `/employees/${id}`, data),
  delete: (id) => apiCall('DELETE', `/employees/${id}`)
};

// File Upload API
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return await response.json();
  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
};

export const uploadBase64 = (base64Data, fileName, fileType) => {
  return apiCall('POST', '/upload-base64', {
    base64Data,
    fileName,
    fileType
  });
};

export default {
  setAuthToken,
  getAuthToken,
  apiCall,
  Auth,
  Transactions,
  Purchase,
  Budget,
  Employees,
  uploadFile,
  uploadBase64
};
