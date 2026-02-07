export const env = {
  // Public URLs
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY || "",
  ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID || "",
  INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  TWITTER_URL: process.env.NEXT_PUBLIC_TWITTER_URL || "",
  FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",

  // Server-side only
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};

// Validate required environment variables at build time
export function validateEnv() {
  const required = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  if (process.env.NODE_ENV === "production") {
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }
}
