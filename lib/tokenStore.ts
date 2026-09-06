let accessToken: string | null = null;

const CLIENT_ACCESS_TOKEN_COOKIE = "epicshowClientAccessToken";
const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;

function syncTokenCookie(token: string | null) {
  if (typeof document === "undefined") return;

  const encodedName = encodeURIComponent(CLIENT_ACCESS_TOKEN_COOKIE);

  if (!token) {
    document.cookie = `${encodedName}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  document.cookie = `${encodedName}=${encodeURIComponent(
    token
  )}; Path=/; Max-Age=${ACCESS_TOKEN_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function setToken(token: string | null) {
  accessToken = token;
  syncTokenCookie(token);
}

export function getToken() {
  if (accessToken) return accessToken;
  if (typeof document !== "undefined") {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${encodeURIComponent(CLIENT_ACCESS_TOKEN_COOKIE)}=([^;]*)`)
    );
    if (match && match[1]) {
      accessToken = decodeURIComponent(match[1]);
      return accessToken;
    }
  }
  return null;
}
