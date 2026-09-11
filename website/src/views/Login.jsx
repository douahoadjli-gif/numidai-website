import { useState } from 'react';
import { FieldShell, TextInput } from '../components/ui.jsx';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      onSuccess?.(data.username);
    } catch {
      setError('Network error — please try again');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section" style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="section__head">
        <h1 className="section__title">Admin login</h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <FieldShell label="Username" copy={{ requiredMark: 'required' }}>
          <TextInput value={username} onChange={setUsername} autoComplete="username" />
        </FieldShell>
        <FieldShell label="Password" copy={{ requiredMark: 'required' }} error={error || undefined}>
          <TextInput
            value={password}
            onChange={setPassword}
            type="password"
            autoComplete="current-password"
          />
        </FieldShell>
        <button type="submit" className="btn btn--primary" disabled={busy} style={{ marginTop: '0.5rem' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
