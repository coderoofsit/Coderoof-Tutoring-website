import fetch from "node-fetch";

import { config } from "./config";
import type { AppointmentSubmission, AttachmentPayload } from "../types";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

const buildAttachmentPayload = (attachment?: AttachmentPayload | null) =>
  attachment ? [attachment] : undefined;

const formatInstantHelp = (value: AppointmentSubmission["instantHelp"]): string =>
  value === "yes" ? "Yes" : "No";

const buildTemplateParams = (submission: AppointmentSubmission) => ({
  name: submission.name,
  email: submission.email,
  service: submission.service,
  instantHelp: formatInstantHelp(submission.instantHelp),
  subject: submission.subject,
  topic: submission.topic,
  date: submission.date ?? "Not provided",
  time: submission.time ?? "Not provided",
  timezone: submission.timezone ?? "Not provided",
  notes: submission.notes?.trim() ?? "",
  submittedAt: new Date().toISOString(),
});

export const sendAppointmentEmail = async (submission: AppointmentSubmission): Promise<void> => {
  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": config.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        email: config.BREVO_SENDER_EMAIL ?? config.BREVO_RECIPIENT_EMAIL,
        name: config.BREVO_SENDER_NAME ?? "Nexus EduHub",
      },
      to: [{ email: config.BREVO_RECIPIENT_EMAIL }],
      templateId: config.BREVO_TEMPLATE_ID,
      params: buildTemplateParams(submission),
      attachment: buildAttachmentPayload(submission.attachment),
    }),
  });

  if (!response.ok) {
    let errorMessage = `Brevo request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // no-op, fall back to default error message
    }

    throw new Error(errorMessage);
  }
};

