/* NumidAI · Admin Dashboard (foundation)
   Architecture + reusable components for the internal team console.
   Production: gate behind Supabase Auth (RLS already restricts data to
   authenticated users). Demo mode shows sample data. */
import { useEffect, useMemo, useState } from 'react';
import { listProjects, updateProjectStatus, DEMO_MODE } from '../lib/supabase.js';

export const PIPELINE = [
  ['new_request', 'New Request'],
  ['ai_review', 'AI Review'],
  ['concept_generation', 'Concept Generation'],
  ['architect_review', 'Architect Review'],
  ['engineering_review', 'Engineering Review'],
  ['client_approval', 'Client Approval'],
  ['construction_documents', 'Construction Documents'],
  ['completed', 'Completed']
];
const LABEL = Object.fromEntries(PIPELINE);

export function StatusBadge({ status }) {
  return <span className={`st st--${status}`}>{LABEL[status] || status}</span>;
}

export function StatusSelect({ value, onChange, busy }) {
  return (
    <select
      className="st-select"
      value={value}
      disabled={busy}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Update project status"
    >
      {PIPELINE.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}

function AnswerRow({ k, v }) {
  if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) return null;
  return (
    <div className="ans">
      <span>{k}</span>
      <b>{Array.isArray(v) ? v.join(', ') : String(v)}</b>
    </div>
  );
}

export default function AdminDashboard() {
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      setRows(await listProjects({ status, search }));
    } catch (e) {
      setRows([]);
      setError(String(e.message || e));
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  const onSearch = (e) => { e.preventDefault(); load(); };

  const changeStatus = async (id, s) => {
    setBusyId(id);
    try {
      await updateProjectStatus(id, s);
      setRows((r) => r.map((p) => (p.id === id ? { ...p, status: s } : p)));
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusyId(null);
    }
  };

  const open = useMemo(() => rows?.find((p) => p.id === openId), [rows, openId]);

  return (
    <section className="adm">
      <header className="adm-head">
        <div>
          <p className="eyebrow">INTERNAL · TEAM CONSOLE</p>
          <h1 className="adm-title">Projects</h1>
        </div>
        <form className="adm-tools" onSubmit={onSearch}>
          <input
            className="f-input adm-search"
            placeholder="Search code, client, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="st-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            {PIPELINE.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </form>
      </header>

      {DEMO_MODE && (
        <p className="sp-demo-note">
          Demo mode — sample data. In production this console requires a Supabase Auth session
          (RLS grants table access to authenticated team members only).
        </p>
      )}
      {error && <p className="f-error" role="alert">{error}</p>}

      <div className="adm-table" role="table">
        <div className="adm-tr adm-tr--head" role="row">
          <span>Code</span><span>Client</span><span>Type</span><span>Location</span><span>Status</span><span>Update</span>
        </div>
        {rows === null && <div className="adm-empty">Loading…</div>}
        {rows && rows.length === 0 && <div className="adm-empty">No projects match.</div>}
        {rows?.map((p) => (
          <div key={p.id} className="adm-tr" role="row">
            <button className="adm-code" onClick={() => setOpenId(openId === p.id ? null : p.id)}>
              {p.project_code}
            </button>
            <span>{p.clients?.full_name}<small>{p.clients?.email}</small></span>
            <span>{p.project_type}</span>
            <span>{p.location}</span>
            <span><StatusBadge status={p.status} /></span>
            <span>
              <StatusSelect value={p.status} busy={busyId === p.id} onChange={(s) => changeStatus(p.id, s)} />
            </span>
          </div>
        ))}
      </div>

      {open && (
        <aside className="adm-drawer" aria-label={`Project ${open.project_code}`}>
          <div className="adm-drawer-head">
            <h2>{open.project_code}</h2>
            <StatusBadge status={open.status} />
            <button className="adm-x" onClick={() => setOpenId(null)} aria-label="Close">×</button>
          </div>
          <h3>Client answers</h3>
          <AnswerRow k="Client" v={`${open.clients?.full_name} · ${open.clients?.email}`} />
          <AnswerRow k="Location" v={open.location} />
          <AnswerRow k="Type" v={open.project_type} />
          <AnswerRow k="Stage" v={open.project_stage} />
          <AnswerRow k="Surface (m²)" v={open.surface_area_m2} />
          <AnswerRow k="Floors" v={open.floors} />
          <AnswerRow k="Priorities" v={open.priorities} />
          <AnswerRow k="Budget" v={open.budget_range} />
          <AnswerRow k="Preferences" v={open.sustainability_prefs} />
          <AnswerRow k="Comments" v={open.additional_comments} />
          <h3>Coming next</h3>
          <p className="adm-soon">
            File uploads (project_files) · internal notes (project_notes) · client messaging
            (messages) · AI-agent hooks reading this project via the REST API.
          </p>
        </aside>
      )}
    </section>
  );
}
