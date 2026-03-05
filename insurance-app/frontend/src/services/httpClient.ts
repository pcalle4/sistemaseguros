const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3050';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} calling ${path}`);
  }
  return (await response.json()) as T;
}

export { API_BASE_URL };
