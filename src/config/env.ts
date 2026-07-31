function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function requiredUrl(name: string, value: string | undefined): string {
  const raw = required(name, value);

  try {
    new URL(raw);
  } catch {
    throw new Error(`Invalid URL for environment variable: ${name}`);
  }

  return raw;
}

/**
 * Public app config is validated at import (needed for layout/metadata at build).
 * DB URLs are lazy — only checked when accessed — so a route that only needs
 * DATABASE_URL (e.g. /api/health) does not require DIRECT_URL or vice versa.
 */
export const env = {
  appName: required("NEXT_PUBLIC_APP_NAME", process.env.NEXT_PUBLIC_APP_NAME),
  appUrl: requiredUrl("NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL),
  clerkPublishableKey: required(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  ),
  clerkSecretKey: required("CLERK_SECRET_KEY", process.env.CLERK_SECRET_KEY),
  get databaseUrl() {
    return requiredUrl("DATABASE_URL", process.env.DATABASE_URL);
  },
  get directUrl() {
    return requiredUrl("DIRECT_URL", process.env.DIRECT_URL);
  },
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: process.env.NODE_ENV !== "production",
  isProd: process.env.NODE_ENV === "production",
};
