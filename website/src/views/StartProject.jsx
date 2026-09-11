/* NumidAI · "Start Your Project" — premium multi-step acquisition form */
import { useMemo, useRef, useState } from 'react';
import { formSteps, formCopy } from '../data/startProjectForm.js';
import { FieldShell, TextInput, RadioChips, CheckChips, Progress } from '../components/ui.jsx';
import { submitProject } from '../lib/api.js';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function StartProject({ lang }) {
  const copy = formCopy[lang];
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState('form'); // form | submitting | success
  const [submitErr, setSubmitErr] = useState('');
  const [result, setResult] = useState(null);
  const [anim, setAnim] = useState('');
  const cardRef = useRef(null);

  const steps = formSteps;
  const current = steps[step];
  const set = (id, v) => {
    setData((d) => ({ ...d, [id]: v }));
    setErrors((e) => ({ ...e, [id]: undefined }));
  };

  const validateStep = () => {
    const errs = {};
    for (const f of current.fields) {
      const v = data[f.id];
      if (f.required) {
        const empty =
          v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
        if (empty) {
          errs[f.id] = copy.errRequired;
          continue;
        }
      }
      if (f.type === 'email' && v && !EMAIL_RE.test(v)) errs[f.id] = copy.errEmail;
      if (f.type === 'number' && v !== undefined && v !== '') {
        const n = Number(v);
        if (!Number.isFinite(n) || (f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max))
          errs[f.id] = copy.errNumber;
      }
      /* "Other" companion text required when Other is chosen */
      if (f.otherId) {
        const chose =
          f.type === 'checks' ? (v || []).includes('other') : v === 'other';
        if (chose && !String(data[f.otherId] || '').trim())
          errs[f.otherId] = copy.errRequired;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const go = (dir) => {
    if (dir > 0 && !validateStep()) {
      cardRef.current?.querySelector('.f-field--err')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    setAnim(dir > 0 ? 'out-l' : 'out-r');
    setTimeout(() => {
      setStep((s) => Math.min(steps.length - 1, Math.max(0, s + dir)));
      setAnim(dir > 0 ? 'in-r' : 'in-l');
      setTimeout(() => setAnim(''), 30);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 220);
  };

  const submit = async () => {
    if (!validateStep()) return;
    setPhase('submitting');
    setSubmitErr('');
    try {
      const payload = {
        full_name: data.full_name,
        email: data.email,
        location: data.location,
        project_type: data.project_type,
        project_type_other: data.project_type_other || null,
        project_stage: data.project_stage,
        project_stage_other: data.project_stage_other || null,
        surface_area_m2: data.surface_area_m2,
        floors: data.floors,
        priorities: data.priorities || [],
        priorities_other: data.priorities_other || null,
        budget_range: data.budget_range || null,
        timeline: data.timeline || null,
        sustainability_prefs: data.sustainability_prefs || [],
        sustainability_other: data.sustainability_other || null,
        additional_comments: data.additional_comments || null
      };
      const res = await submitProject(payload);
      setResult(res);
      setPhase('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[NumidAI] submission failed:', err);
      setSubmitErr(copy.errSubmit);
      setPhase('form');
    }
  };

  const pct = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step, steps.length]);

  if (phase === 'success') {
    return (
      <section className="sp sp--success">
        <div className="sp-card sp-card--success" role="status">
          <div className="sp-check" aria-hidden>✓</div>
          <h1 className="sp-success-title">{copy.successTitle}</h1>
          {copy.successLines.map((l) => (
            <p key={l} className="sp-success-line">{l}</p>
          ))}
          {result?.project_code && (
            <p className="sp-ref">
              {copy.successRef}
              <b>{result.project_code}</b>
            </p>
          )}
          <a className="btn btn--primary" href="#home" onClick={() => setTimeout(() => location.reload(), 50)}>
            {copy.successHome}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="sp">
      <header className="sp-head">
        <p className="eyebrow">{copy.kicker}</p>
        <h1 className="sp-title">{copy.title}</h1>
        <p className="sp-intro">{copy.intro}</p>
      </header>

      <Progress steps={steps} current={step} lang={lang} />
      <div className="prog-bar" aria-hidden>
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="prog-count">{copy.stepOf(step + 1, steps.length)}</p>

      <div ref={cardRef} className={`sp-card anim-${anim || 'none'}`}>
        <h2 className="sp-step-title">{current.title[lang]}</h2>
        <p className="sp-step-lede">{current.lede[lang]}</p>

        {current.fields.map((f) => {
          const v = data[f.id];
          const showOther =
            f.otherId &&
            (f.type === 'checks' ? (v || []).includes('other') : v === 'other');
          return (
            <div key={f.id}>
              <FieldShell label={f.label[lang]} required={f.required} error={errors[f.id]} copy={copy}>
                {(f.type === 'text' || f.type === 'email' || f.type === 'number') && (
                  <TextInput
                    type={f.type}
                    value={v ?? ''}
                    min={f.min}
                    max={f.max}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder?.[lang]}
                    onChange={(nv) => set(f.id, nv)}
                  />
                )}
                {f.type === 'textarea' && (
                  <TextInput
                    type="textarea"
                    rows={f.rows}
                    value={v ?? ''}
                    placeholder={f.placeholder?.[lang]}
                    onChange={(nv) => set(f.id, nv)}
                  />
                )}
                {f.type === 'radio' && (
                  <RadioChips options={f.options} value={v ?? ''} lang={lang} onChange={(nv) => set(f.id, nv)} />
                )}
                {f.type === 'checks' && (
                  <CheckChips options={f.options} value={v ?? []} lang={lang} onChange={(nv) => set(f.id, nv)} />
                )}
              </FieldShell>
              {showOther && (
                <FieldShell label={copy.otherPlaceholder} required error={errors[f.otherId]} copy={copy}>
                  <TextInput
                    value={data[f.otherId] ?? ''}
                    placeholder={copy.otherPlaceholder}
                    onChange={(nv) => set(f.otherId, nv)}
                  />
                </FieldShell>
              )}
            </div>
          );
        })}

        {submitErr && <p className="f-error sp-submit-err" role="alert">{submitErr}</p>}

        <div className="sp-nav">
          {step > 0 ? (
            <button type="button" className="btn btn--outline-dark" onClick={() => go(-1)}>
              {copy.back}
            </button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <button type="button" className="btn btn--primary" onClick={() => go(1)}>
              {copy.next} <span aria-hidden>→</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              disabled={phase === 'submitting'}
              onClick={submit}
            >
              {phase === 'submitting' ? (
                <>
                  <span className="spinner" aria-hidden /> {copy.submitting}
                </>
              ) : (
                copy.submit
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
