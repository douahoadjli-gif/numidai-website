/* Shared MongoDB connection, cached across warm serverless invocations. */
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not set');
}

let cachedClient = globalThis.__numidaiMongoClient;
let cachedPromise = globalThis.__numidaiMongoPromise;

export async function getDb() {
  if (!cachedPromise) {
    cachedClient = new MongoClient(uri, { maxPoolSize: 5 });
    cachedPromise = cachedClient.connect();
    globalThis.__numidaiMongoClient = cachedClient;
    globalThis.__numidaiMongoPromise = cachedPromise;
  }
  const client = await cachedPromise;
  return client.db('numidai');
}
