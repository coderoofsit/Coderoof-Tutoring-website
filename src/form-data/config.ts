import type { BrevoConfig } from "./types";

const REQUIRED_ENV_KEYS = [
  "VITE_BREVO_API_KEY",
  "VITE_BREVO_TEMPLATE_ID",
  "VITE_BREVO_RECIPIENT_EMAIL",
] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

const ensureEnv = (key: string): string => {
  const value = import.meta.env[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
};

const readTemplateId = (rawTemplateId: string): number => {
  const templateId = Number.parseInt(rawTemplateId, 10);

  if (!Number.isFinite(templateId)) {
    throw new Error("VITE_BREVO_TEMPLATE_ID must be a valid integer");
  }

  return templateId;
};

const inferSenderEmail = (recipientEmail: string): string => {
  const senderEmail = import.meta.env.VITE_BREVO_SENDER_EMAIL;

  if (typeof senderEmail === "string" && senderEmail.trim().length > 0) {
    return senderEmail.trim();
  }

  return recipientEmail;
};

const inferSenderName = (): string => {
  const senderName = import.meta.env.VITE_BREVO_SENDER_NAME;

  if (typeof senderName === "string" && senderName.trim().length > 0) {
    return senderName.trim();
  }

  return "Nexus EduHub";
};

export const getBrevoConfig = (): BrevoConfig => {
  REQUIRED_ENV_KEYS.forEach((key: RequiredEnvKey) => {
    ensureEnv(key);
  });

  const apiKey = ensureEnv("VITE_BREVO_API_KEY");
  const templateId = readTemplateId(ensureEnv("VITE_BREVO_TEMPLATE_ID"));
  const recipientEmail = ensureEnv("VITE_BREVO_RECIPIENT_EMAIL");
  const senderEmail = inferSenderEmail(recipientEmail);
  const senderName = inferSenderName();

  return {
    apiKey,
    templateId,
    recipientEmail,
    senderEmail,
    senderName,
  };
};
