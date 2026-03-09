const fallbackApiBaseUrl = 'http://localhost:3050';

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiBaseUrl,
} as const;
