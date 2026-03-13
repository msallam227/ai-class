import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Terminal from './components/Terminal'
import FloatingLogos from './components/FloatingLogos'
import Admin from './components/Admin'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// ── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(null)
  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

// ── Signup form ───────────────────────────────────────────────────────────────
function SignupForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', state: '' })
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="success-message">
        <div className="success-icon">✓</div>
        <h3>You're in, {form.firstName}!</h3>
        <p>We'll email you the week of March 24th to confirm enrollment. Get ready to build.</p>
      </div>
    )
  }

  return (
    <form onSubmit={async e => {
            e.preventDefault();
            try {
              await fetch('http://localhost:3002/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
              });
            } catch (err) {
              console.error('signup failed', err);
            }
            setSubmitted(true);
          }}>
      <div className="form-row">
        <div className="form-group">
          <input type="text" name="firstName" className="form-input" placeholder="First Name"
            value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required />
        </div>
        <div className="form-group">
          <input type="text" name="lastName" className="form-input" placeholder="Last Name"
            value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required />
        </div>
      </div>
      <div className="form-group">
        <input type="email" name="email" className="form-input" placeholder="Email Address"
          value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
      </div>
      <div className="form-group">
        <input type="tel" name="phone" className="form-input" placeholder="Phone Number"
          value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <input type="text" name="city" className="form-input" placeholder="City"
            value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required />
        </div>
        <div className="form-group">
          <input type="text" name="state" className="form-input" placeholder="State"
            value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} required />
        </div>
      </div>
      <button type="submit" className="btn btn-primary signup-btn">
        Reserve Your Spot — It&apos;s Free
        <span className="btn-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <span className="micro-note">
        This class is 100% free. You will receive a confirmation email the week of March 24th.
      </span>
    </form>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  // show admin portal if the pathname matches
  if (window.location.pathname === '/admin') {
    return <Admin />
  }

  const timeLeft = useCountdown('2026-03-24T00:00:00')
  const appRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-content .system-label', { y: 20, opacity: 0, duration: 0.6 })
        .from('.hero h1', { y: 60, opacity: 0, duration: 0.9 }, '-=0.3')
        .from('.hero > .hero-content > p', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
        .from('.hero-ctas', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.class-info-badges', { y: 16, opacity: 0, duration: 0.5 }, '-=0.3')
        .from('.hero-visual', { x: 40, opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.8')

      // Terminal demo section
      gsap.from('.demo-section .demo-left', {
        scrollTrigger: { trigger: '.demo-section', start: 'top 75%' },
        x: -50, opacity: 0, duration: 0.9, ease: 'power3.out',
      })
      gsap.from('.demo-section .terminal-wrap', {
        scrollTrigger: { trigger: '.demo-section', start: 'top 75%' },
        x: 50, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15,
      })

      // Section headers
      gsap.utils.toArray('.section-header').forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 82%' },
          y: 36, opacity: 0, duration: 0.8, ease: 'power3.out',
        })
      })

      // Bento cards stagger
      gsap.utils.toArray('.bento-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%' },
          y: 50, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
        })
      })

      // Qualifications
      gsap.from('.qual-banner', {
        scrollTrigger: { trigger: '.qual-banner', start: 'top 82%' },
        y: 24, opacity: 0, duration: 0.7, ease: 'power3.out',
      })
      gsap.utils.toArray('.who-pill').forEach((pill, i) => {
        gsap.from(pill, {
          scrollTrigger: { trigger: '.qual-banner', start: 'top 82%' },
          scale: 0.85, opacity: 0, duration: 0.4, delay: 0.1 + i * 0.06, ease: 'back.out(1.5)',
        })
      })

      // Timeline items
      gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: 'top 82%' },
          x: -40, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
        })
      })

      // Side hustle steps
      gsap.utils.toArray('.hustle-step').forEach((step, i) => {
        gsap.from(step, {
          scrollTrigger: { trigger: step, start: 'top 88%' },
          y: 40, opacity: 0, scale: 0.95, duration: 0.6, delay: i * 0.09, ease: 'back.out(1.4)',
        })
      })

      // Tool cards
      gsap.from('.tools-grid', {
        scrollTrigger: { trigger: '.tools-grid', start: 'top 82%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      })

      // Floating logos section
      gsap.from('.floating-header', {
        scrollTrigger: { trigger: '.floating-header', start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      })
      gsap.utils.toArray('.glass-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: '.floating-stage', start: 'top 80%' },
          scale: 0, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'back.out(1.7)',
        })
      })

      // Outcome cards
      gsap.utils.toArray('.outcome-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%' },
          y: 40, opacity: 0, scale: 0.95, duration: 0.6, delay: i * 0.09, ease: 'power3.out',
        })
      })

      // Instructor
      gsap.from('.instructor-card', {
        scrollTrigger: { trigger: '.instructor-card', start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
      })

      // Signup
      gsap.from('.signup-card', {
        scrollTrigger: { trigger: '.signup-card', start: 'top 80%' },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      })
    }, appRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="app" ref={appRef}>
      <div className="ambient-glow">
        <div className="glow-orb top-right" />
        <div className="glow-orb bottom-left" />
      </div>
      <div className="grain" />

      <div className="container">
        {/* ── NAV ── */}
        <nav>
          <div className="logo">
            <div className="logo-mark" />
            AI Course
          </div>
          <div className="nav-links">
            <a href="#overview">Learn</a>
            <a href="#hustle">Side Hustle</a>
            <a href="#syllabus">Syllabus</a>
            <a href="#instructor">Instructor</a>
          </div>
          <a href="#enroll" className="btn btn-nav">Sign Up Free</a>
        </nav>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-content">
            <div className="system-label" style={{ marginBottom: '1.5rem' }}>[ Cohort 01 · Registration Open ]</div>
            <h1>
              Build and Launch a <br />
              <span className="text-gradient">Website with AI</span>
              <br />in 4 Weeks
            </h1>
            <p>
              Learn how to turn an idea into a real product using AI tools — from concept to a live, revenue-generating website. Design, code, automate, market, and launch, even if you don't know how to program.
            </p>
            <div className="hero-ctas">
              <a href="#enroll" className="btn btn-primary">
                Join the Course — Free
                <span className="btn-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
              <a href="#syllabus" className="btn btn-secondary">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
                View Syllabus
              </a>
            </div>
            <div className="class-info-badges">
              <span className="badge">Mondays &amp; Fridays</span>
              <span className="badge">Starting March 24, 2026</span>
              <span className="badge free-badge">100% Free</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="prismatic-core">
              <div className="core-light" />
              <div className="cube cube-1">
                <div className="face front" /><div className="face back" />
                <div className="face right" /><div className="face left" />
                <div className="face top" /><div className="face bottom" />
              </div>
              <div className="cube cube-2">
                <div className="face front" /><div className="face back" />
                <div className="face right" /><div className="face left" />
                <div className="face top" /><div className="face bottom" />
              </div>
              <div className="cube cube-3">
                <div className="face front" /><div className="face back" />
                <div className="face right" /><div className="face left" />
                <div className="face top" /><div className="face bottom" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── TERMINAL DEMO ── */}
      <section className="demo-section">
        <div className="container">
          <div className="demo-inner">
            <div className="demo-left">
              <div className="system-label" style={{ marginBottom: '1rem' }}>See It In Action</div>
              <h2 className="section-title">This is how you'll build.</h2>
              <p className="demo-desc">
                You'll use Claude Code right in your terminal to generate entire apps, connect databases, configure automations, and deploy live — all through conversation.
              </p>
              <ul className="demo-bullets">
                <li><span className="bullet-dot" />No syntax memorization</li>
                <li><span className="bullet-dot" />AI writes the code, you direct it</li>
                <li><span className="bullet-dot" />Errors explained in plain English</li>
                <li><span className="bullet-dot" />Ship in hours, not months</li>
              </ul>
            </div>
            <Terminal />
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="video-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <div className="system-label" style={{ justifyContent: 'center' }}>See It Live</div>
            <h2 className="section-title" style={{ marginTop: '1rem' }}>Learn how to make websites like this.</h2>
            <p className="schedule-note" style={{ textAlign: 'center' }}>Watch what's possible when you combine AI with the right tools — built entirely in this course.</p>
          </div>
          <div className="video-wrapper">
            <video
              src="/Area1.mp4"
              controls
              playsInline
              className="course-video"
            />
          </div>
        </div>
      </section>

      <div className="container">
        {/* ── WHAT YOU'LL LEARN ── */}
        <section id="overview" className="bento-section">
          <div className="section-header">
            <div className="system-label">What You'll Learn</div>
            <h2 className="section-title">Everything you need to ship.</h2>
          </div>

          <div className="bento-grid">
            <div className="bento-card card-1">
              <div className="bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="bento-title">Idea to Product</h3>
              <p className="bento-desc">Turn a vague idea into a structured digital product. Define user flows, scope features, and prompt AI to generate your entire app architecture before writing a single line of code.</p>
            </div>

            <div className="bento-card card-2">
              <div className="bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h3 className="bento-title">Design Your Website</h3>
              <p className="bento-desc">Use Figma and AI design tools to build beautiful, responsive UIs — no design degree needed.</p>
            </div>

            <div className="bento-card card-3">
              <div className="bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h3 className="bento-title">AI Coding</h3>
              <p className="bento-desc">Use Claude Code in Terminal and VS Code to build your entire site through conversation.</p>
            </div>

            <div className="bento-card card-4">
              <div className="bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </div>
              <h3 className="bento-title">Connect APIs &amp; Databases</h3>
              <p className="bento-desc">Set up Supabase for auth and data, integrate external APIs, and make your app dynamic and production-ready.</p>
            </div>

            <div className="bento-card card-5">
              <div className="bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l-5.64-5.64" />
                </svg>
              </div>
              <h3 className="bento-title">Launch &amp; Deploy</h3>
              <p className="bento-desc">Deploy your live website to Vercel or Render and give your product a real URL the world can visit.</p>
            </div>

            <div className="bento-card card-6">
              <div className="bento-icon" style={{ color: '#ff9500' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="bento-title">Marketing with AI</h3>
              <p className="bento-desc">Generate landing page copy, social media content, ad creatives, and SEO-optimized blog posts using AI — in minutes, not weeks.</p>
            </div>

            <div className="bento-card card-7">
              <div className="bento-icon" style={{ color: '#9B5FE3' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="bento-title">Marketing Automations</h3>
              <p className="bento-desc">Build automated email sequences, lead capture flows, and social posting pipelines that run your marketing on autopilot using Make.</p>
            </div>

            <div className="bento-card card-8">
              <div className="bento-icon" style={{ color: '#61DAFB' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
              <h3 className="bento-title">AI Agents &amp; Automations</h3>
              <p className="bento-desc">Build AI agents that handle customer inquiries, qualify leads, schedule follow-ups, and run workflows 24/7 — without you lifting a finger.</p>
            </div>
          </div>
        </section>

        {/* ── CTA STRIP 1 ── */}
        <div className="cta-strip">
          <p className="cta-strip-text">Ready to build your first AI-powered product?</p>
          <a href="#enroll" className="btn btn-primary">
            Sign Up — It's Free
            <span className="btn-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </a>
        </div>

        {/* ── A-Z SIDE HUSTLE ── */}
        <section id="hustle" className="hustle-section">
          <div className="section-header">
            <div className="system-label">The Full Picture</div>
            <h2 className="section-title">Your A–Z side hustle.</h2>
            <p className="schedule-note">By the end you'll know how to run an entire business with AI — from first idea to recurring revenue.</p>
          </div>

          <div className="hustle-grid">
            {[
              { letter: 'A', title: 'Build Your Product', desc: 'Use AI to design and code a real website or web app from scratch.' },
              { letter: 'B', title: 'Launch It Live', desc: 'Deploy to a real domain with a working database and auth system.' },
              { letter: 'C', title: 'Market with AI', desc: 'Generate content, ad copy, emails, and SEO pages automatically.' },
              { letter: 'D', title: 'Automate Marketing', desc: 'Set up email sequences, lead funnels, and social posts that run themselves.' },
              { letter: 'E', title: 'Deploy AI Agents', desc: 'Build agents that answer questions, qualify leads, and follow up with customers.' },
              { letter: 'F', title: 'Run on Autopilot', desc: 'Connect everything with Make workflows so your business operates 24/7.' },
              { letter: 'G', title: 'Monetize It', desc: 'Add Stripe payments, digital products, or service bookings to earn revenue.' },
              { letter: 'Z', title: 'Scale from Zero', desc: 'You walk away with a real product, live site, and a business you can grow.' },
            ].map(step => (
              <div key={step.letter} className="hustle-step">
                <div className="hustle-letter">{step.letter}</div>
                <h3 className="hustle-title">{step.title}</h3>
                <p className="hustle-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA STRIP 2 ── */}
        <div className="cta-strip">
          <p className="cta-strip-text">Cohort 01 starts March 24 — spots are limited.</p>
          <a href="#enroll" className="btn btn-primary">
            Reserve Your Spot
            <span className="btn-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </a>
        </div>

        {/* ── QUALIFICATIONS ── */}
        <section className="qualifications-section">
          <div className="qual-banner">
            <div className="qual-left">
              <div className="system-label">Qualifications</div>
              <p className="qual-statement">No coding experience required.</p>
            </div>
            <div className="qual-right">
              {[
                'Founders',
                'Creators',
                'Non-technical builders',
                'Entrepreneurs',
                'Side hustlers',
                'Anyone with an idea',
              ].map(item => (
                <span key={item} className="who-pill">{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CURRICULUM ── */}
        <section id="syllabus" className="timeline-section">
          <div className="section-header">
            <div className="system-label">Curriculum</div>
            <h2 className="section-title">The 4-Week Sprint.</h2>
            <p className="schedule-note">Classes meet every Monday &amp; Friday · Starting March 24, 2026</p>
          </div>

          <div className="timeline">
            {[
              {
                week: 'WEEK_01',
                title: 'From Idea to Product',
                body: 'Create and validate a startup idea. Understand the fundamentals of modern web development, define your product, user flows, and structure — before writing a single line of code.',
              },
              {
                week: 'WEEK_02',
                title: 'Designing Your Website',
                body: 'Design your product UI in Figma using AI design assistants. Build high-fidelity mockups, set up your design system, and prepare all assets for development.',
              },
              {
                week: 'WEEK_03',
                title: 'Coding with AI',
                body: 'Learn Terminal and VS Code. Use Claude Code to generate and build your website. Connect your frontend to Supabase for auth and data, and debug with AI pair programming.',
              },
              {
                week: 'WEEK_04',
                title: 'Launch, Market & Automate',
                body: 'Deploy live on Vercel or Render. Set up Make automation workflows for email marketing, lead capture, and AI agents. Walk away with a fully automated, revenue-ready product.',
              },
            ].map(item => (
              <div key={item.week} className="timeline-item">
                <div className="timeline-node" />
                <div className="timeline-content">
                  <span className="timeline-week">{item.week}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA STRIP 3 ── */}
        <div className="cta-strip">
          <p className="cta-strip-text">4 weeks. No experience needed. 100% free.</p>
          <a href="#enroll" className="btn btn-primary">
            Join the Course
            <span className="btn-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </a>
        </div>

        {/* ── TOOLS ── */}
        <section id="tools" className="tools-section">
          <div className="system-label" style={{ justifyContent: 'center' }}>Tech Stack</div>
          <h2 className="section-title" style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Tools You'll Master
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Including Terminal and VS Code — the developer's home base
          </p>
          <div className="tools-grid">
            {[
              { name: 'Claude Code' },
              { name: 'VS Code' },
              { name: 'Terminal' },
              { name: 'Supabase' },
              { name: 'Vercel / Render' },
              { name: 'Make' },
              { name: 'Figma' },
              { name: 'Midjourney' },
              { name: 'React' },
            ].map(tool => (
              <div key={tool.name} className="tool-card">{tool.name}</div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FLOATING LOGOS ── */}
      <FloatingLogos />

      <div className="container">
        {/* ── FINAL OUTCOME ── */}
        <section className="outcome-section">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <div className="system-label" style={{ justifyContent: 'center' }}>Final Outcome</div>
            <h2 className="section-title" style={{ marginTop: '1rem' }}>What you walk away with.</h2>
            <p className="schedule-note" style={{ textAlign: 'center' }}>A complete A-Z side hustle — built, launched, and automated</p>
          </div>
          <div className="outcome-grid">
            {[
              { title: 'A Live Website', desc: 'Your fully deployed product with a real URL.' },
              { title: 'A Working Database', desc: 'Real data storage powering your app with Supabase.' },
              { title: 'AI Automations', desc: 'Make workflows running your business 24/7.' },
              { title: 'Marketing System', desc: 'AI-generated content and automated email sequences.' },
              { title: 'AI Agents', desc: 'Agents that handle leads, follow-ups, and customer questions.' },
              { title: 'Revenue-Ready', desc: 'Stripe payments, digital products, or services wired up and ready.' },
              { title: 'Business on Autopilot', desc: 'End-to-end workflows so your side hustle runs while you sleep.' },
              { title: 'A Real Side Hustle', desc: 'Something you built yourself and can actually launch or monetize.' },
            ].map((item, i) => (
              <div key={item.title} className="outcome-card">
                <div className="outcome-num">0{i + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── INSTRUCTOR ── */}
        <section id="instructor" className="instructor-section">
          <div className="section-header">
            <div className="system-label">About the Instructor</div>
            <h2 className="section-title">Meet your teacher.</h2>
          </div>
          <div className="instructor-card">
            <div className="instructor-avatar">
              <img src="/mariam.jpg" alt="Mariam Sallam" className="avatar-photo" />
              <div className="instructor-code">4F634</div>
            </div>
            <div className="instructor-info">
              <h3>Mariam Sallam</h3>
              <p className="instructor-bio">
                Mariam has spent over 10 years working in EdTech, helping people from all backgrounds learn to build with technology. She has worked with leading companies including{' '}
                <strong>2U</strong>, <strong>Springboard</strong>, and <strong>ThriveDX</strong>, and holds a degree in programming. Her teaching style bridges technical depth and real-world accessibility — making complex concepts click for non-technical builders.
              </p>
              <div className="instructor-companies">
                {['2U', 'Springboard', 'ThriveDX'].map(c => (
                  <span key={c} className="company-badge">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SIGNUP ── */}
        <section id="enroll" className="signup-section">
          <div className="signup-card">
            <div className="signup-card-inner">
              <div className="system-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                [ Registration Open ]
              </div>
              <h2>Ready to build?</h2>
              <p>Join Cohort 01. Transform your idea into a live, automated side hustle — for free.</p>

              {timeLeft && (
                <div className="countdown">
                  <div className="countdown-label">Registration closes March 24</div>
                  <div className="countdown-timer">
                    {[
                      { val: timeLeft.days, label: 'Days' },
                      { val: timeLeft.hours, label: 'Hours' },
                      { val: timeLeft.minutes, label: 'Min' },
                      { val: timeLeft.seconds, label: 'Sec' },
                    ].map(({ val, label }) => (
                      <div key={label} className="countdown-unit">
                        <span className="countdown-num">{String(val).padStart(2, '0')}</span>
                        <span className="countdown-unit-label">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <SignupForm />
            </div>
          </div>
        </section>

        <footer>
          <div className="logo">
            <div className="logo-mark" style={{ width: '12px', height: '12px' }} />
            AI Course by Mariam Sallam
          </div>
          <div>© 2026 · Classes start March 24 · Mondays &amp; Fridays · Free</div>
        </footer>
      </div>
    </div>
  )
}
