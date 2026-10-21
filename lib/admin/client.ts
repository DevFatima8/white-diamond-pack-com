/**
 * Browser-side helper for calling /api/admin/* routes.
 * Always resolves (never throws) to one simple shape, so components only need
 * `if (!res.ok) …`. If the session has expired (401), it sends the admin back to
 * the login page and returns them to this page afterwards.
 */
export type FieldErrors = Record<string, string[] | undefined>;

export interface AdminResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  fieldErrors?: FieldErrors;
}

export async function adminFetch<T = unknown>(
  url: string,
  options: { method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown },
): Promise<AdminResult<T>> {
  try {
    const res = await fetch(url, {
      method: options.method,
      headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    if (res.status === 401) {
      const back = window.location.pathname + window.location.search;
      window.location.href = `/admin/login?callbackUrl=${encodeURIComponent(back)}`;
      return { ok: false, error: 'Your session has expired. Please sign in again.' };
    }

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      return {
        ok: false,
        error: json.error || `Request failed (${res.status})`,
        fieldErrors: json.details?.fieldErrors,
      };
    }
    return { ok: true, data: json.data as T };
  } catch {
    return { ok: false, error: 'Could not reach the server. Check your connection.' };
  }
}
