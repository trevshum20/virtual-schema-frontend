import axios from 'axios';
import { getToken } from '../auth/token';

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

if (!baseUrl) {
  console.warn('REACT_APP_BACKEND_BASE_URL is not set');
}

export const api = axios.create({
  baseURL: baseUrl,   // e.g. http://localhost:8080
});

// Automatically attach JWT if present
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRedirectingToLogin = false;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = String(err?.config?.url || '');
    const onLoginPage = window.location.pathname === '/login';

    // Skip redirect for auth endpoints (let the LoginPage show its own error)
    const isAuthEndpoint = /\/auth\/(login|refresh|validate)/i.test(url);

    // Optional: allow callers to opt-out via header or config flag
    const skipHeader = err?.config?.headers?.['X-Skip-Auth-Redirect'] === 'true';
    const skipFlag   = err?.config?.__skipAuthRedirect === true;

    if ((status === 401 || status === 403) && !isAuthEndpoint && !skipHeader && !skipFlag) {
      // Clear any stale token
      try { localStorage.removeItem('jwt'); } catch {}

      if (!onLoginPage && !isRedirectingToLogin) {
        isRedirectingToLogin = true;
        window.location.replace('/login'); // avoids back button loop
      }
    }

    return Promise.reject(err);
  }
);