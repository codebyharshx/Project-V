/**
 * Next.js instrumentation – runs once when the Node.js process starts.
 * Used to validate required env vars in production.
 */
export async function register() {
  if (process.env.NODE_ENV === "production") {
    const required = [
      "DATABASE_URL",
      "NEXTAUTH_SECRET",
      "NEXTAUTH_URL",
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}. Set them before starting the app.`
      );
    }
  }
}
