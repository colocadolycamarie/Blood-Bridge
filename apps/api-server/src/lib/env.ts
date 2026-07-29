const isProduction = process.env.NODE_ENV === "production";

function required(name: string, fallbackDev?: string): string {
  const value = process.env[name];
  if (value) return value;
  if (!isProduction && fallbackDev) return fallbackDev;
  throw new Error(`${name} must be set. Did you forget to add it to your .env?`);
}

export const env = {
  isProduction,
  port: Number(process.env["PORT"]) || 5000,
  jwtSecret: required(
    "JWT_SECRET",
    "dev-only-secret-do-not-use-in-production-32chars",
  ),
  corsOrigin: process.env["CORS_ORIGIN"] || "http://localhost:5173",
};
