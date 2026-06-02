/**
 * Integration Helper - Add this to your existing HTML files
 * This bridges localStorage calls to API calls
 */

// Add this at the TOP of your <script> tag in index.html and hr.html

const API_MODE = 'api'; // Change to 'localStorage' to revert
const API_BASE = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token && API_MODE === 'api') {
    window.location.href = '/login.html';
    return null;
  }
  return token;
};

// Wrapper for API calls
const apiCall = async (method, endpoint, data = null) => {
  const token = getAuthToken();
  if (!token) return null;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login.html';
      return null;
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`API Error [${method} ${endpoint}]:`, err);
    throw err;
  }
};

// API wrapper objects
const apiTransactions = {
  create: (data) => apiCall('POST', '/transactions', data),
  getAll: (filters) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.type) params.append('type', filters.type);
    return apiCall('GET', `/transactions?${params}`);
  },
  getSummary: (month, year) => apiCall('GET', `/transactions/summary?month=${month}&year=${year}`),
  getChart: (year) => apiCall('GET', `/transactions/chart/monthly?year=${year}`),
  update: (id, data) => apiCall('PUT', `/transactions/${id}`, data),
  delete: (id) => apiCall('DELETE', `/transactions/${id}`)
};

const apiBudget = {
  getAll: (year, month) => apiCall('GET', `/budget?year=${year}&month=${month}`),
  create: (data) => apiCall('POST', '/budget', data),
  update: (id, data) => apiCall('PUT', `/budget/${id}`, data),
  delete: (id) => apiCall('DELETE', `/budget/${id}`)
};

const apiPurchase = {
  getAll: (filters) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    return apiCall('GET', `/purchase?${params}`);
  },
  create: (data) => apiCall('POST', '/purchase', data),
  update: (id, data) => apiCall('PUT', `/purchase/${id}`, data),
  delete: (id) => apiCall('DELETE', `/purchase/${id}`)
};

const apiEmployees = {
  getAll: () => apiCall('GET', '/employees'),
  create: (data) => apiCall('POST', '/employees', data),
  update: (id, data) => apiCall('PUT', `/employees/${id}`, data),
  delete: (id) => apiCall('DELETE', `/employees/${id}`)
};

const apiAuth = {
  getCurrentUser: () => apiCall('GET', '/auth/me'),
  logout: () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login.html';
  }
};

// File upload
const apiUpload = async (file) => {
  const token = getAuthToken();
  if (!token) return null;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
};

// Base64 upload (for signatures)
const apiUploadBase64 = (base64Data, fileName, fileType) => {
  return apiCall('POST', '/upload-base64', {
    base64Data,
    fileName,
    fileType
  });
};

console.log('✅ API integration loaded');
