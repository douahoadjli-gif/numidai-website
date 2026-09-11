/* One-off: upsert the admin user into MongoDB with a bcrypt-hashed password.
   Usage: MONGODB_URI=... ADMIN_USERNAME=admin ADMIN_PASSWORD=*** node scripts/seed-admin.mjs
   Never hardcode credentials here -- always pass via env at invocation time. */
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

if (!uri || !username || !password) {
  console.error('MONGODB_URI, ADMIN_USERNAME, and ADMIN_PASSWORD must all be set');
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db('numidai');
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.collection('admins').updateOne(
    { username },
    { $set: { username, passwordHash, role: 'admin', updatedAt: new Date() } },
    { upsert: true }
  );
  console.log(
    result.upsertedCount
      ? `Created admin user "${username}"`
      : `Updated admin user "${username}"`
  );
} finally {
  await client.close();
}
