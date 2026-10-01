import mongoose from "mongoose";
import { getMongoUri, isDbConfigured } from "./env";

export class DbNotConfiguredError extends Error {
  constructor() {
    super("Database is not configured. Set MONGODB_URI in your environment.");
    this.name = "DbNotConfiguredError";
  }
}

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithMongoose = globalThis as unknown as { _bytespaceMongoose?: Cache };
const cache: Cache = (globalWithMongoose._bytespaceMongoose ??= { conn: null, promise: null });

/** Returns a cached Mongoose connection (safe for hot reload and serverless). */
export async function connectDB() {
  if (!isDbConfigured()) throw new DbNotConfiguredError();
  if (cache.conn) return cache.conn;

  cache.promise ??= mongoose.connect(getMongoUri(), {
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 10,
  });

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}
