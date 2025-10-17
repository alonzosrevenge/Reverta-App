// client/src/lib/api.ts
export async function apiRequest(
  url: string,
  initOrMethod?: RequestInit | string
) {
  // Accept either a RequestInit object or a plain method string ("GET", "POST", etc.)
  const init: RequestInit =
    typeof initOrMethod === 'string' ? { method: initOrMethod } : (initOrMethod ?? {});

  // Provide a default method but allow overrides
  const res = await fetch(url, { method: 'GET', ...init });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  // Try JSON first; fall back to text if needed
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}