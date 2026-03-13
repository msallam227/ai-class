import './FloatingLogos.css'

const LOGOS = [
  {
    name: 'Claude Code',
    tag: 'AI Coding',
    color: '#D285FF',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 22h20L12 2z" />
      </svg>
    ),
    pos: { top: '8%', left: '4%' },
    anim: 'float-a',
    delay: '0s',
  },
  {
    name: 'VS Code',
    tag: 'Editor',
    color: '#5B54FA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    pos: { top: '3%', left: '28%' },
    anim: 'float-b',
    delay: '0.8s',
  },
  {
    name: 'Terminal',
    tag: 'Command Line',
    color: '#27c93f',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    pos: { top: '6%', left: '56%' },
    anim: 'float-c',
    delay: '1.4s',
  },
  {
    name: 'Supabase',
    tag: 'Database',
    color: '#3ECF8E',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    pos: { top: '8%', left: '80%' },
    anim: 'float-a',
    delay: '0.4s',
  },
  {
    name: 'Vercel',
    tag: 'Hosting',
    color: '#ffffff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    ),
    pos: { top: '42%', left: '88%' },
    anim: 'float-b',
    delay: '1s',
  },
  {
    name: 'Make',
    tag: 'Automations',
    color: '#9B5FE3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    pos: { top: '72%', left: '75%' },
    anim: 'float-c',
    delay: '0.2s',
  },
  {
    name: 'Figma',
    tag: 'Design',
    color: '#F24E1E',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
        <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
        <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
        <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
        <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 0 1-7 0z" />
      </svg>
    ),
    pos: { top: '75%', left: '10%' },
    anim: 'float-a',
    delay: '1.6s',
  },
  {
    name: 'React',
    tag: 'Frontend',
    color: '#61DAFB',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
    pos: { top: '40%', left: '42%' },
    anim: 'float-b',
    delay: '0.6s',
  },
  {
    name: 'Midjourney',
    tag: 'Visuals',
    color: '#ff9500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
        <path d="M12 8l2.5 4H9.5L12 8z" />
        <path d="M9 15l1.5-3h3L15 15" />
      </svg>
    ),
    pos: { top: '55%', left: '20%' },
    anim: 'float-c',
    delay: '1.2s',
  },
]

export default function FloatingLogos() {
  return (
    <section className="floating-section">
      <div className="floating-bg-glow" />
      <div className="floating-header">
        <div className="system-label" style={{ justifyContent: 'center' }}>Your AI Toolkit</div>
        <h2 className="section-title" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Every tool you need, in one course.
        </h2>
        <p className="floating-sub">
          Glassmorphism isn't just an aesthetic — it's how modern products feel. You'll build with all of these.
        </p>
      </div>

      <div className="floating-stage">
        {LOGOS.map((logo) => (
          <div
            key={logo.name}
            className={`glass-card ${logo.anim}`}
            style={{
              top: logo.pos.top,
              left: logo.pos.left,
              animationDelay: logo.delay,
              '--card-color': logo.color,
            }}
          >
            <div className="glass-icon" style={{ color: logo.color }}>
              {logo.icon}
            </div>
            <div className="glass-text">
              <span className="glass-name">{logo.name}</span>
              <span className="glass-tag">{logo.tag}</span>
            </div>
          </div>
        ))}

        {/* Center focal glow */}
        <div className="stage-center-glow" />
      </div>
    </section>
  )
}
