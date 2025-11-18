export type AppointmentSubmission = {
  name: string;
  email: string;
  service: "online tutoring" | "assignment help";
  instantHelp: "yes" | "no";
  subject: string;
  topic: string;
  date?: string;
  time?: string;
  timezone?: string;
  notes?: string;
  attachment?: File | null;
};

export type BrevoAttachment = {
  name: string;
  content: string;
  type?: string;
};

export type BrevoTransactionalEmail = {
  to: string[];
  templateId: number;
  params: Record<string, unknown>;
  attachment?: BrevoAttachment[];
};

export type BrevoConfig = {
  apiKey: string;
  templateId: number;
  recipientEmail: string;
  senderEmail: string;
  senderName: string;
};
