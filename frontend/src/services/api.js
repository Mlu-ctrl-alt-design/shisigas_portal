import axios from 'axios';

/**
 * Axios instance pre-configured for Frappe backend communication.
 *
 * Key decisions:
 * - withCredentials: true  → sends Frappe session cookie on every request
 * - X-Frappe-CSRF-Token   → required by Frappe for all non-GET requests
 * - 403/417 interceptor    → redirects to /login when session expires
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Frappe sets window.csrf_token on page load.
// For a standalone SPA (not served from Frappe), this is seeded by the first
// /api/method/frappe.auth.get_logged_user call in authStore initialisation.
api.interceptors.request.use((config) => {
  const csrfToken = window.csrf_token || 'fetch';
  config.headers['X-Frappe-CSRF-Token'] = csrfToken;
  return config;
});

// Session expiry / permission guard
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // 403 = Forbidden, 417 = Frappe's session-expired signal
    if (status === 403 || status === 417) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
