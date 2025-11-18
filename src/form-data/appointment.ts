import { sendBrevoTransactionalEmail } from "./brevoClient";
import { getBrevoConfig } from "./config";
import type { AppointmentSubmission, BrevoAttachment } from "./types";
import { fileToBase64 } from "./utils";

const formatInstantHelp = (value: AppointmentSubmission["instantHelp"]): string =>
  value === "yes" ? "Yes" : "No";

const buildAttachment = async (
  attachment?: AppointmentSubmission["attachment"],
): Promise<BrevoAttachment[] | undefined> => {
  if (!attachment) {
    return undefined;
  }

  const base64Content = await fileToBase64(attachment);

  return [
    {
      name: attachment.name,
      content: base64Content,
      type: attachment.type || undefined,
    },
  ];
};

const buildTemplateParams = (
  submission: AppointmentSubmission,
): Record<string, unknown> => ({
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

export const submitAppointmentRequest = async (
  submission: AppointmentSubmission,
): Promise<void> => {
  const config = getBrevoConfig();
  const attachment = await buildAttachment(submission.attachment);

  await sendBrevoTransactionalEmail({
    to: [config.recipientEmail],
    templateId: config.templateId,
    params: buildTemplateParams(submission),
    attachment,
  });
};
