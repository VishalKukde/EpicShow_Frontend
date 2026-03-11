let accessToken: string | null = null;
const CLIENT_TOKEN_COOKIE = "clientAccessToken";

function readTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const row = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${CLIENT_TOKEN_COOKIE}=`));
  if (!row) return null;
  const value = row.slice(CLIENT_TOKEN_COOKIE.length + 1);
  return value ? decodeURIComponent(value) : null;
}

export function setToken(token: string | null) {
  accessToken = token;
  if (typeof document === "undefined") return;

  if (!token) {
    document.cookie = `${CLIENT_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
    return;
  }

  document.cookie = `${CLIENT_TOKEN_COOKIE}=${encodeURIComponent(
    token
  )}; path=/; max-age=86400; samesite=lax`;
}

export function getToken() {
  if (!accessToken) {
    accessToken = readTokenFromCookie();
  }
  return accessToken;
}
