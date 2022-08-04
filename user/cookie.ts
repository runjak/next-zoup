/**
 * This file is about parsing the HTTP cookie header to extract the session from it.
 */

export const sessionCookieName = "zoup-session";

export const parseSessionIdentifier = (cookie: string): string | null => {
  const prefix = `${sessionCookieName}=`;
  for (const entry of cookie.split("; ")) {
    if (entry.startsWith(prefix)) {
      return entry.substring(prefix.length);
    }
  }
  return null;
};
