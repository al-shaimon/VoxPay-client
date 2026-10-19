// Centralized API Base URL configuration for Local Dev & Vercel Production
const RAW_URL = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = RAW_URL.replace(/\/+$/, '');

/**
 * Returns full URL for an API endpoint path.
 * If VITE_API_URL is set (e.g. on Vercel), prepends it: "https://backend.onrender.com/api/..."
 * If VITE_API_URL is empty, returns relative path: "/api/..." (handled by Vite proxy in dev)
 */
export const apiUrl = (path) => {
  if (!path) return API_BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
