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

export type AppointmentAttachmentPayload = {
  name: string;
  content: string;
  type?: string;
};

export type AppointmentRequestPayload = Omit<AppointmentSubmission, "attachment"> & {
  attachment?: AppointmentAttachmentPayload | null;
};
