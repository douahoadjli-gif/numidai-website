/* ----------------------------------------------------------------------------
   NumidAI · Supabase data layer
   Uses Supabase's REST (PostgREST) + RPC endpoints directly via fetch, so no
   extra npm dependency is required. If you later prefer the official SDK:
   `npm i @supabase/supabase-js` and swap the internals — the exported function
   signatures below can stay identical.

   Env (website/.env — see .env.example):
     VITE_SUPABASE_URL       e.g. https://xxxx.supabase.co
     VITE_SUPABASE_ANON_KEY  the project's anon public key

   DEMO MODE: when env vars are missing, calls resolve with simulated data so
   the form and admin dashboard remain fully previewable before the backend is
   provisioned. A console.info makes the mode unmistakable.
---------------------------------------------------------------------------- */

const URL_ = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const DEMO_MODE = !URL_ || !KEY;

if (DEMO_MODE && typeof console !== 'undefined') {
  // eslint-disable-next-line no-console
  console.info(
    '[NumidAI] Supabase env vars not set — running in DEMO mode. ' +
      'Submissions are simulated. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to go live.'
  );
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function headers(extra = {}) {
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`, // replace with user JWT once Auth is wired
    'Content-Type': 'application/json',
    ...extra
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${URL_}${path}`, { ...options, headers: headers(options.headers) });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${body || res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

/* ------------------------------ public: form ------------------------------ */

/** Create client + project + initial workflow state atomically (RPC). */
export async function submitProject(payload) {
  if (DEMO_MODE) {
    await sleep(1100);
    return {
      project_id: 'demo-' + Math.random().toString(36).slice(2, 10),
      project_code: 'NUM-2026-' + String(Math.floor(1 + Math.random() * 9998)).padStart(4, '0'),
      demo: true
    };
  }
  const rows = await request('/rest/v1/rpc/submit_project', {
    method: 'POST',
    body: JSON.stringify({ payload })
  });
  return rows;
}

/* --------------------------- team: admin queries --------------------------
   These require an authenticated session in production (RLS: authenticated).
   In demo mode they return in-memory sample data for the dashboard preview. */

const demoProjects = [
  {
    id: 'demo-1', project_code: 'NUM-2026-0007', status: 'ai_review', created_at: '2026-07-20T09:15:00Z',
    project_type: 'residential', project_stage: 'design', location: 'Algiers, Algeria',
    surface_area_m2: 420, floors: 3, budget_range: 'medium',
    priorities: ['carbon', 'energy', 'comfort'], sustainability_prefs: ['solar', 'local_materials', 'green_roofs'],
    additional_comments: 'South-facing plot with strong afternoon sun.',
    clients: { full_name: 'Amina Bensalem', email: 'amina@example.com' }
  },
  {
    id: 'demo-2', project_code: 'NUM-2026-0006', status: 'new_request', created_at: '2026-07-21T14:02:00Z',
    project_type: 'commercial', project_stage: 'idea', location: 'Riyadh, Saudi Arabia',
    surface_area_m2: 2600, floors: 5, budget_range: 'high',
    priorities: ['energy', 'costs'], sustainability_prefs: ['solar', 'smart'],
    additional_comments: '',
    clients: { full_name: 'Khalid Al-Rashid', email: 'khalid@example.com' }
  },
  {
    id: 'demo-3', project_code: 'NUM-2026-0004', status: 'architect_review', created_at: '2026-07-14T10:40:00Z',
    project_type: 'public', project_stage: 'retrofit', location: 'Marrakesh, Morocco',
    surface_area_m2: 1150, floors: 2, budget_range: 'medium',
    priorities: ['water', 'comfort'], sustainability_prefs: ['insulation', 'water', 'local_materials'],
    additional_comments: 'Historic envelope must be preserved.',
    clients: { full_name: 'Leïla Haddad', email: 'leila@example.com' }
  }
];

export async function listProjects({ status = '', search = '' } = {}) {
  if (DEMO_MODE) {
    await sleep(350);
    const q = search.trim().toLowerCase();
    return demoProjects.filter(
      (p) =>
        (!status || p.status === status) &&
        (!q ||
          p.project_code.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.clients.full_name.toLowerCase().includes(q) ||
          p.clients.email.toLowerCase().includes(q))
    );
  }
  const params = new URLSearchParams({
    select: '*,clients(full_name,email)',
    order: 'created_at.desc'
  });
  if (status) params.set('status', `eq.${status}`);
  if (search.trim()) {
    const q = search.trim();
    params.set('or', `(project_code.ilike.*${q}*,location.ilike.*${q}*)`);
  }
  return request(`/rest/v1/projects?${params}`);
}

export async function updateProjectStatus(id, status) {
  if (DEMO_MODE) {
    await sleep(250);
    const p = demoProjects.find((x) => x.id === id);
    if (p) p.status = status;
    return { id, status };
  }
  return request(`/rest/v1/projects?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status })
  });
}

export async function addProjectNote(projectId, author, body) {
  if (DEMO_MODE) {
    await sleep(200);
    return { id: 'demo-note', project_id: projectId, author, body };
  }
  return request('/rest/v1/project_notes', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ project_id: projectId, author, body })
  });
}
