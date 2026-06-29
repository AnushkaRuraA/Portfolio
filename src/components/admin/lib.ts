import toast from "react-hot-toast";

/** Fetch wrapper for admin API calls — always sends cookies, parses JSON,
 *  and surfaces a useful error message. */
export async function adminFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    credentials: "same-origin",
    headers:
      options.body && typeof options.body === "string"
        ? { "Content-Type": "application/json", ...(options.headers || {}) }
        : options.headers,
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status}).`);
  }
  return data as T;
}

/** Run an async action with success/error toasts. */
export async function withToast<T>(
  action: () => Promise<T>,
  messages: { loading?: string; success: string }
): Promise<T | undefined> {
  const id = messages.loading ? toast.loading(messages.loading) : undefined;
  try {
    const result = await action();
    if (id) toast.success(messages.success, { id });
    else toast.success(messages.success);
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Something went wrong.";
    if (id) toast.error(msg, { id });
    else toast.error(msg);
    return undefined;
  }
}
