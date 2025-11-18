import { MongoClient, type Collection } from "mongodb";

import { config } from "./config";
import { logger } from "./logger";
import type { StoredAppointment } from "../types";

let cachedClient: MongoClient | undefined;

const getClient = async (): Promise<MongoClient> => {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(config.MONGODB_URI);
  cachedClient = await client.connect();
  logger.info("Connected to MongoDB");
  return cachedClient;
};

export const getAppointmentsCollection = async (): Promise<Collection<StoredAppointment>> => {
  const client = await getClient();
  const db = client.db(config.MONGODB_DB_NAME);
  return db.collection<StoredAppointment>("appointments");
};

