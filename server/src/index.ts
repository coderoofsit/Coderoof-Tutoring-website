import cors from "cors";
import express from "express";

import appointmentsRouter from "./routes/appointments";
import { config } from "./lib/config";
import { logger } from "./lib/logger";

const app = express();

app.use(
  cors({
    origin: config.allowedOrigins ?? true,
  }),
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/appointments", appointmentsRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err: error }, "Unhandled server error");
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.PORT, () => {
  logger.info(`Server listening on port ${config.PORT}`);
});

