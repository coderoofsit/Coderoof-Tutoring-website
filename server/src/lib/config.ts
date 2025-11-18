import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().min(0).max(65535).default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().min(1, "MONGODB_DB_NAME is required"),
  BREVO_API_KEY: z.string().min(1, "BREVO_API_KEY is required"),
  BREVO_TEMPLATE_ID: z.coerce.number().int().positive("BREVO_TEMPLATE_ID must be a number"),
  BREVO_RECIPIENT_EMAIL: z.string().email("BREVO_RECIPIENT_EMAIL must be a valid email"),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid server environment configuration", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Failed to load server configuration");
}

const { ALLOWED_ORIGINS, ...rest } = parsedEnv.data;

export const config = {
  ...rest,
  allowedOrigins: ALLOWED_ORIGINS
    ? ALLOWED_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : undefined,
};

export type AppConfig = typeof config;

