import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { z } from "zod";

import { getAppointmentsCollection } from "../lib/db";
import { logger } from "../lib/logger";
import { sendAppointmentEmail } from "../lib/brevoClient";
import type { AppointmentSubmission, StoredAppointment } from "../types";

const attachmentSchema = z
  .object({
    name: z.string().min(1),
    type: z.string().optional(),
    content: z.string().min(1),
  })
  .optional()
  .nullable();

const appointmentSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    service: z.enum(["online tutoring", "assignment help"]),
    instantHelp: z.enum(["yes", "no"]),
    subject: z.string().min(1),
    topic: z.string().min(1),
    date: z.string().optional(),
    time: z.string().optional(),
    timezone: z.string().optional(),
    notes: z.string().optional(),
    attachment: attachmentSchema,
  })
  .superRefine((submission, ctx) => {
    const requiresSchedule = submission.service === "online tutoring";
    if (requiresSchedule && (!submission.date || !submission.time || !submission.timezone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date, time, and timezone are required for online tutoring requests.",
        path: ["scheduling"],
      });
    }
  });

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submission = appointmentSchema.parse(req.body) as AppointmentSubmission;
    const collection = await getAppointmentsCollection();

    const record: StoredAppointment = {
      ...submission,
      attachment: submission.attachment ?? null,
      status: "pending",
      createdAt: new Date(),
    };

    const { insertedId } = await collection.insertOne(record);

    try {
      await sendAppointmentEmail(submission);
    } catch (error) {
      logger.error({ err: error }, "Failed to send Brevo email");
      await collection.updateOne(
        { _id: insertedId },
        {
          $set: {
            status: "email_failed",
            emailError: error instanceof Error ? error.message : "Unknown error",
          },
        },
      );
      throw error;
    }

    await collection.updateOne(
      { _id: insertedId },
      {
        $set: {
          status: "notified",
        },
      },
    );

    res.status(201).json({
      id: insertedId.toString(),
      status: "ok",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Invalid request payload",
        details: error.flatten(),
      });
      return;
    }

    next(error);
  }
});

export default router;

