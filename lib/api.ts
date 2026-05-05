// export const API_URL = "http://localhost:5000";
// export const API_URL = "http://192.168.29.21:5000";

import { getToken, setToken } from "@/lib/tokenStore";
import { toast } from "@/lib/toast";

let isRefreshing = false;

type ApiRequestOptions = RequestInit & {
  notifyOnError?: boolean;
};

function extractErrorMessage(payload: unknown, fallback = "Request failed") {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string"
  ) {
    const message = (payload as { message: string }).message.trim();
    if (message) return message;
  }

  return fallback;
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function shouldShowErrorToast(path: string, notifyOnError?: boolean) {
  if (typeof notifyOnError === "boolean") {
    return notifyOnError;
  }

  // Avoid noisy toast on silent refresh checks during bootstrap.
  return !path.includes("/auth/refresh");
}

export async function apiFetch(path: string, options: ApiRequestOptions = {}) {
  const { notifyOnError, ...requestOptions } = options;
  const isAuthPublicPath =
    path.includes("/auth/login") ||
    path.includes("/auth/register") ||
    path.includes("/auth/refresh");

  const shouldNotifyError = shouldShowErrorToast(path, notifyOnError);
  let hasToastedError = false;

  const toastError = (message: string) => {
    if (!shouldNotifyError || hasToastedError) return;
    hasToastedError = true;
    toast.error(message);
  };

  console.log("Access token expired. Attempting refresh...", path);
  const makeRequest = async (accessToken: string | null) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...requestOptions,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(requestOptions.headers || {}),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
  };

  try {
    let token = getToken();
    let res = await makeRequest(token);

    // Skip refresh flow for auth entry endpoints; surface backend error directly.
    if (isAuthPublicPath) {
      const data = await parseJsonSafe(res);
      if (!res.ok) {
        const message = extractErrorMessage(data);
        toastError(message);
        throw new Error(message);
      }
      return data;
    }

    // Handle access token expiry.
    if (res.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (!refreshRes.ok) throw new Error("Refresh failed");

          const refreshData = await refreshRes.json();
          setToken(refreshData.accessToken);
          token = refreshData.accessToken;
        } catch {
          setToken(null);

          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/login")
          ) {
            window.location.href = "/login";
          }

          const message = "Session expired. Please login again.";
          toastError(message);
          throw new Error(message);
        } finally {
          isRefreshing = false;
        }
      } else {
        // If already refreshing, wait briefly and reuse refreshed token.
        await new Promise((resolve) => setTimeout(resolve, 300));
        token = getToken();
      }

      // Retry original request once.
      res = await makeRequest(token);
    }

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      const message = extractErrorMessage(data);
      toastError(message);
      throw new Error(message);
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    toastError(message);
    throw error instanceof Error ? error : new Error(message);
  }
}

export async function apiDownload(path: string, options: ApiRequestOptions = {}) {
  const { notifyOnError, ...requestOptions } = options;
  const shouldNotifyError = shouldShowErrorToast(path, notifyOnError);
  let hasToastedError = false;

  const toastError = (message: string) => {
    if (!shouldNotifyError || hasToastedError) return;
    hasToastedError = true;
    toast.error(message);
  };

  const makeRequest = async (accessToken: string | null) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...requestOptions,
      credentials: "include",
      headers: {
        ...(requestOptions.headers || {}),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
  };

  try {
    let token = getToken();
    let res = await makeRequest(token);

    if (res.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (!refreshRes.ok) throw new Error("Refresh failed");

          const refreshData = await refreshRes.json();
          setToken(refreshData.accessToken);
          token = refreshData.accessToken;
        } catch {
          setToken(null);

          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/login")
          ) {
            window.location.href = "/login";
          }

          const message = "Session expired. Please login again.";
          toastError(message);
          throw new Error(message);
        } finally {
          isRefreshing = false;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));
        token = getToken();
      }

      res = await makeRequest(token);
    }

    if (!res.ok) {
      let message = "Request failed";
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await parseJsonSafe(res);
        message = extractErrorMessage(data);
      } else {
        try {
          const text = await res.text();
          message = text || message;
        } catch {
          // Keep default fallback.
        }
      }

      toastError(message);
      throw new Error(message);
    }

    const blob = await res.blob();
    const disposition = res.headers.get("content-disposition") || "";
    const fileNameMatch = disposition.match(/filename="?([^"]+)"?/i);
    const fileName = fileNameMatch?.[1] || "statement.xlsx";

    return { blob, fileName };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    toastError(message);
    throw error instanceof Error ? error : new Error(message);
  }
}
