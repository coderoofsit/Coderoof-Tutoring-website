import type { ObjectId } from "mongodb";

export type AttachmentPayload = {
  name: string;
  content: string;
  type?: string;
};

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
  attachment?: AttachmentPayload | null;
};

export type StoredAppointment = AppointmentSubmission & {
  _id?: ObjectId;
  status: "pending" | "email_failed" | "notified";
  createdAt: Date;
  emailError?: string;
};

