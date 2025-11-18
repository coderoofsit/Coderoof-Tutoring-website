import { getBrevoConfig } from "./config";
import type { BrevoAttachment, BrevoTransactionalEmail } from "./types";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

const buildAttachmentPayload = (attachments?: BrevoAttachment[]) =>
  attachments?.map((attachment) => ({
    name: attachment.name,
    content: attachment.content,
    type: attachment.type,
  }));

export const sendBrevoTransactionalEmail = async (
  payload: BrevoTransactionalEmail,
): Promise<void> => {
  const config = getBrevoConfig();

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": config.apiKey,
    },
    body: JSON.stringify({
      sender: {
        email: config.senderEmail,
        name: config.senderName,
      },
      to: payload.to.map((email) => ({ email })),
      templateId: payload.templateId,
      params: payload.params,
      attachment: buildAttachmentPayload(payload.attachment),
    }),
  });

  if (!response.ok) {
    let errorMessage = `Brevo request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch (error) {
      console.error("Failed to parse Brevo error response", error);
    }

    throw new Error(errorMessage);
  }
};
