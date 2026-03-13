import { useState, useEffect } from 'react';

export default function Admin() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    setError(null);
    fetch('/submissions', {
      headers: { 'x-admin-password': password },
    })
      .then(r => {
        if (!r.ok) throw new Error('Incorrect password');
        return r.json();
      })
      .then(data => { setSubs(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); setAuthed(false); });
  }, [authed]);

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={styles.page}>
        {/* Ambient orbs */}
        <div style={styles.orbTopRight} />
        <div style={styles.orbBottomLeft} />

        <div style={styles.card}>
          {/* Logo mark */}
          <div style={styles.logoRow}>
            <div style={styles.logoMark} />
            <span style={styles.logoText}>AI Course</span>
          </div>

          <div style={styles.systemLabel}>
            <span style={styles.dot} />
            Admin Portal
          </div>

          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subheading}>Enter your password to view sign-up submissions.</p>

          {error && (
            <div style={styles.errorBanner}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form
            onSubmit={e => { e.preventDefault(); setAuthed(true); }}
            style={styles.form}
          >
            <div style={styles.inputWrap}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.inputIcon}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                autoFocus
                required
              />
            </div>

            <button type="submit" style={styles.btn}>
              Access Dashboard
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          <p style={styles.footerNote}>Restricted access · AI Course admin only</p>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div style={{ ...styles.page, alignItems: 'flex-start', padding: '3rem 2rem' }}>
      <div style={styles.orbTopRight} />
      <div style={styles.orbBottomLeft} />

      <div style={{ maxWidth: 960, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={styles.systemLabel}><span style={styles.dot} />Sign-up Submissions</div>
            <h1 style={{ ...styles.heading, marginTop: '0.5rem' }}>
              {loading ? 'Loading…' : `${subs.length} enrolment${subs.length !== 1 ? 's' : ''}`}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {subs.length > 0 && (
              <button onClick={() => {
                const header = ['Time', 'First Name', 'Last Name', 'Email', 'Phone', 'City', 'State'];
                const rows = subs.map(s => [
                  new Date(s.timestamp).toLocaleString(),
                  s.firstName, s.lastName, s.email, s.phone, s.city, s.state
                ].map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`));
                const csv = [header, ...rows].map(r => r.join(',')).join('\n');
                const a = document.createElement('a');
                a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                a.download = `signups-${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
              }} style={styles.exportBtn}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export CSV
              </button>
            )}
            <button
              onClick={() => { setAuthed(false); setPassword(''); setSubs([]); }}
              style={styles.logoutBtn}
            >
            Sign out
          </button>
          </div>
        </div>

        {loading && <p style={{ color: 'var(--text-secondary, #8a8a98)' }}>Fetching data…</p>}

        {!loading && subs.length === 0 && (
          <div style={styles.emptyState}>No sign-ups yet. Check back soon.</div>
        )}

        {!loading && subs.length > 0 && (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Time', 'Name', 'Email', 'Phone', 'City', 'State'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((s, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>{new Date(s.timestamp).toLocaleString()}</td>
                    <td style={styles.td}>{s.firstName} {s.lastName}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.phone}</td>
                    <td style={styles.td}>{s.city}</td>
                    <td style={styles.td}>{s.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#06050a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  orbTopRight: {
    position: 'fixed', top: '-20%', right: '-10%',
    width: 700, height: 700, borderRadius: '50%',
    background: 'radial-gradient(circle, #5B54FA 0%, transparent 70%)',
    filter: 'blur(120px)', opacity: 0.35, pointerEvents: 'none',
  },
  orbBottomLeft: {
    position: 'fixed', bottom: '-20%', left: '-10%',
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, #D285FF 0%, transparent 70%)',
    filter: 'blur(120px)', opacity: 0.2, pointerEvents: 'none',
  },
  card: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: 420,
    background: 'rgba(20, 18, 28, 0.55)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '2.5rem',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem',
  },
  logoMark: {
    width: 16, height: 16, borderRadius: 4,
    background: 'linear-gradient(135deg, #D285FF, #5B54FA)',
    boxShadow: '0 0 12px rgba(210,133,255,0.4)',
  },
  logoText: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '-0.01em' },
  systemLabel: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    fontFamily: "'Space Mono', monospace",
    fontSize: '0.6rem', textTransform: 'uppercase',
    letterSpacing: '0.12em', color: '#8a8a98',
    marginBottom: '0.75rem',
  },
  dot: {
    display: 'inline-block', width: 4, height: 4, borderRadius: '50%',
    background: '#D285FF', boxShadow: '0 0 8px #D285FF', flexShrink: 0,
  },
  heading: {
    fontSize: '1.75rem', fontWeight: 400, letterSpacing: '-0.03em',
    marginBottom: '0.5rem', lineHeight: 1.1,
  },
  subheading: {
    fontSize: '0.875rem', color: '#8a8a98', marginBottom: '1.75rem', lineHeight: 1.5,
  },
  errorBanner: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(255, 80, 80, 0.1)', border: '1px solid rgba(255,80,80,0.25)',
    borderRadius: 10, padding: '0.65rem 0.9rem',
    fontSize: '0.8rem', color: '#ff8080', marginBottom: '1.25rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  inputWrap: {
    position: 'relative', display: 'flex', alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute', left: '0.9rem', color: '#8a8a98', pointerEvents: 'none',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '0.8rem 0.9rem 0.8rem 2.4rem',
    color: '#fff',
    fontSize: '0.9rem',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    background: 'linear-gradient(135deg, #F9E5FF 0%, #E2DFFF 100%)',
    color: '#000', border: 'none', borderRadius: 100,
    padding: '0.8rem 1.5rem', fontSize: '0.875rem', fontWeight: 500,
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    transition: 'box-shadow 0.2s, transform 0.2s',
    marginTop: '0.25rem',
  },
  footerNote: {
    textAlign: 'center', fontSize: '0.7rem', color: 'rgba(138,138,152,0.6)',
    marginTop: '1.5rem', fontFamily: "'Space Mono', monospace",
    letterSpacing: '0.05em',
  },
  exportBtn: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    background: 'linear-gradient(135deg, #F9E5FF 0%, #E2DFFF 100%)',
    color: '#000', border: 'none', borderRadius: 100,
    padding: '0.5rem 1.1rem', fontSize: '0.8rem', fontWeight: 500,
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 100, padding: '0.5rem 1.25rem',
    color: '#8a8a98', fontSize: '0.8rem', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'background 0.2s',
  },
  emptyState: {
    background: 'rgba(20,18,28,0.55)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16, padding: '3rem', textAlign: 'center',
    color: '#8a8a98', fontSize: '0.9rem',
  },
  tableWrap: {
    background: 'rgba(20,18,28,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '0.85rem 1rem', textAlign: 'left',
    fontFamily: "'Space Mono', monospace", fontSize: '0.6rem',
    textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a98',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  },
  tr: { transition: 'background 0.15s' },
  td: {
    padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#d4d4d8',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
};
