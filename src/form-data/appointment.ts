import { getAppointmentApiUrl } from "./config";
import type {
  AppointmentAttachmentPayload,
  AppointmentRequestPayload,
  AppointmentSubmission,
  AppointmentSubmissionResponse,
} from "./types";
import { fileToBase64 } from "./utils";

const buildAttachmentPayload = async (
  attachment?: AppointmentSubmission["attachment"],
): Promise<AppointmentAttachmentPayload | null> => {
  if (!attachment) {
    return null;
  }

  const base64Content = await fileToBase64(attachment);

  return {
    name: attachment.name,
    content: base64Content,
    type: attachment.type || undefined,
  };
};

const buildRequestPayload = async (
  submission: AppointmentSubmission,
): Promise<AppointmentRequestPayload> => {
  const { attachment, ...rest } = submission;

  return {
    ...rest,
    attachment: await buildAttachmentPayload(attachment),
  };
};

export const submitAppointmentRequest = async (
  submission: AppointmentSubmission,
): Promise<AppointmentSubmissionResponse> => {
  const payload = await buildRequestPayload(submission);
  const endpoint = getAppointmentApiUrl();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "We couldn't send your request. Please try again.";

    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody.error) {
        errorMessage = errorBody.error;
      }
    } catch {
      // Swallow JSON parse errors and fall back to the default message.
    }
    throw new Error(errorMessage);
  }

  return (await response.json()) as AppointmentSubmissionResponse;
};
