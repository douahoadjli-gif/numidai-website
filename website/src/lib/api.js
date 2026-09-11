/* ----------------------------------------------------------------------------
   NumidAI · data layer — talks to the Vercel serverless API (api/projects/*),
   which is backed by MongoDB. No demo/mock mode: this always hits the real
   database. Admin-only endpoints rely on the httpOnly session cookie set by
   /api/login, sent automatically on same-origin requests.
---------------------------------------------------------------------------- */

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body;
}

/** Public: submit a new project from the "Start Your Project" form. */
export function submitProject(payload) {
  return request('/api/projects', { method: 'POST', body: JSON.stringify(payload) });
}

/** Admin: list projects, optionally filtered by status and/or search text. */
export function listProjects({ status = '', search = '' } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (search.trim()) params.set('search', search.trim());
  const qs = params.toString();
  return request(`/api/projects${qs ? `?${qs}` : ''}`);
}

/** Admin: update a project's pipeline status. */
export function updateProjectStatus(id, status) {
  return request(`/api/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}
