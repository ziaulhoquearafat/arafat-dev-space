import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare mongoose connection on global to prevent multiple connections in hot reload
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const mongooseCache: MongooseCache = cached;

export async function dbConnect() {
  const MONGODB_URI = process.env.MONGO_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env",
    );
  }

  if (mongooseCache.conn) return mongooseCache.conn;
  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  mongooseCache.conn = await mongooseCache.promise;
  return mongooseCache.conn;
}
