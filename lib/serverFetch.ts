import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ServerFetchOptions = RequestInit & {
  authRedirectPath?: string;
  skipAuthRedirect?: boolean;
};

export async function serverFetch(
  path: string,
  options: ServerFetchOptions = {}
) {
  const cookieStore = await cookies();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  // 🔥 Convert cookies to proper header string
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const accessToken = cookieStore.get("accessToken")?.value
    || cookieStore.get("epicshowClientAccessToken")?.value;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json().catch(() => null);
      if (data?.message) {
        message = data.message;
      }
    } else {
      const text = await res.text().catch(() => "");
      if (text) {
        message = text;
      }
    }
    const isAuthError = res.status === 401 || res.status === 403;
    if (isAuthError && !options.skipAuthRedirect) {
      const nextPath = options.authRedirectPath || "/";
      redirect(`/login?redirect=${encodeURIComponent(nextPath)}`);
    }

    throw new Error(message);
  }

  return res.json();
}
