const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  issues?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(BASE + path, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || 'Request failed');
  }

  return json;
}

export async function apiFetchBlob(
  path: string,
  init?: RequestInit
): Promise<Blob> {
  const res = await fetch(BASE + path, {
    ...init,
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Request failed');
  }

  return res.blob();
}
