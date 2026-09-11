import { ObjectId } from 'mongodb';
import { getDb } from '../_db.js';
import { requireAdmin } from '../_auth.js';

const VALID_STATUSES = new Set([
  'new_request',
  'ai_review',
  'concept_generation',
  'architect_review',
  'engineering_review',
  'client_approval',
  'construction_documents',
  'completed'
]);

export default async function handler(req, res) {
  if (!requireAdmin(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (req.method !== 'PATCH') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid project id' });
    return;
  }

  const { status } = req.body || {};
  if (!VALID_STATUSES.has(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  const db = await getDb();
  const result = await db
    .collection('projects')
    .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

  if (result.matchedCount === 0) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.status(200).json({ id, status });
}
