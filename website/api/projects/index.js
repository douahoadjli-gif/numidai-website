import { getDb } from '../_db.js';
import { requireAdmin } from '../_auth.js';

async function nextProjectCode(db) {
  const year = new Date().getFullYear();
  const count = await db.collection('projects').countDocuments({
    project_code: { $regex: `^NUM-${year}-` }
  });
  return `NUM-${year}-${String(count + 1).padStart(4, '0')}`;
}

function toClient(doc) {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export default async function handler(req, res) {
  const db = await getDb();

  if (req.method === 'POST') {
    const body = req.body || {};
    if (!body.full_name || !body.email) {
      res.status(400).json({ error: 'full_name and email are required' });
      return;
    }
    const project_code = await nextProjectCode(db);
    const doc = {
      project_code,
      status: 'new_request',
      created_at: new Date(),
      project_type: body.project_type || null,
      project_type_other: body.project_type_other || null,
      project_stage: body.project_stage || null,
      project_stage_other: body.project_stage_other || null,
      surface_area_m2: body.surface_area_m2 ?? null,
      floors: body.floors ?? null,
      location: body.location || null,
      priorities: body.priorities || [],
      priorities_other: body.priorities_other || null,
      budget_range: body.budget_range || null,
      timeline: body.timeline || null,
      sustainability_prefs: body.sustainability_prefs || [],
      sustainability_other: body.sustainability_other || null,
      additional_comments: body.additional_comments || null,
      clients: { full_name: body.full_name, email: body.email }
    };
    const result = await db.collection('projects').insertOne(doc);
    res.status(201).json({ project_id: result.insertedId.toString(), project_code });
    return;
  }

  if (req.method === 'GET') {
    if (!requireAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { status, search } = req.query || {};
    const filter = {};
    if (status) filter.status = status;
    if (search && search.trim()) {
      const re = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { project_code: re },
        { location: re },
        { 'clients.full_name': re },
        { 'clients.email': re }
      ];
    }
    const docs = await db
      .collection('projects')
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();
    res.status(200).json(docs.map(toClient));
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
