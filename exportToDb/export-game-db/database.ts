import { MongoClient, Db } from "mongodb";

import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
const DB_NAME = process.env.DB_NAME || "highscorehaven";

let db: Db;

export async function connectDB(): Promise<Db> {
  if (db) return db;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("Connected to MongoDB Atlas ✓");
  return db;
}

export function getDB(): Db {
  if (!db) throw new Error("Database not connected");
  return db;
}
