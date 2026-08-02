/* NumidAI · reusable form primitives (design-system compliant) */
import { useId } from 'react';

export function FieldShell({ label, required, error, children, copy }) {
  return (
    <div className={`f-field${error ? ' f-field--err' : ''}`}>
      <label className="f-label">
        {label}
        {required && <span className="f-req"> · {copy.requiredMark}</span>}
      </label>
      {children}
      {error && (
        <p className="f-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ value, onChange, type = 'text', placeholder, autoComplete, min, max, rows }) {
  const id = useId();
  if (type === 'textarea') {
    return (
      <textarea
        id={id}
        className="f-input f-textarea"
        rows={rows || 5}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      id={id}
      className="f-input"
      type={type}
      inputMode={type === 'number' ? 'numeric' : undefined}
      min={min}
      max={max}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* Single-choice — rendered as premium selectable chips */
export function RadioChips({ options, value, onChange, lang }) {
  return (
    <div className="chips" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`chip${value === o.value ? ' chip--on' : ''}`}
          onClick={() => onChange(value === o.value ? '' : o.value)}
        >
          <span className="chip__dot" aria-hidden />
          {o[lang]}
        </button>
      ))}
    </div>
  );
}

/* Multi-choice chips */
export function CheckChips({ options, value = [], onChange, lang }) {
  const toggle = (v) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className="chips">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="checkbox"
          aria-checked={value.includes(o.value)}
          className={`chip${value.includes(o.value) ? ' chip--on' : ''}`}
          onClick={() => toggle(o.value)}
        >
          <span className="chip__tick" aria-hidden>✓</span>
          {o[lang]}
        </button>
      ))}
    </div>
  );
}

/* Step progress — blueprint-line style */
export function Progress({ steps, current, lang }) {
  return (
    <ol className="prog" aria-label="Progress">
      {steps.map((s, i) => (
        <li
          key={s.id}
          className={`prog__step${i === current ? ' is-now' : ''}${i < current ? ' is-done' : ''}`}
        >
          <span className="prog__dot">{i < current ? '✓' : i + 1}</span>
          <span className="prog__lbl">{s.title[lang]}</span>
        </li>
      ))}
    </ol>
  );
}
