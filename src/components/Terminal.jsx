import { useState, useEffect, useRef } from 'react'
import './Terminal.css'

const SCRIPT = [
  { type: 'cmd', text: 'mkdir my-startup && cd my-startup', delay: 800 },
  { type: 'cmd', text: 'claude "build me a SaaS landing page with auth"', delay: 1200 },
  { type: 'sys', text: '  Analyzing your request...', delay: 200 },
  { type: 'ok',  text: '  ✓ Created Hero.jsx, Pricing.jsx, Dashboard.jsx', delay: 500 },
  { type: 'ok',  text: '  ✓ Connected Supabase authentication', delay: 400 },
  { type: 'ok',  text: '  ✓ Built database schema', delay: 400 },
  { type: 'cmd', text: 'claude "add email marketing automation"', delay: 1000 },
  { type: 'sys', text: '  Connecting to Make webhooks...', delay: 200 },
  { type: 'ok',  text: '  ✓ Welcome email sequence — active', delay: 500 },
  { type: 'ok',  text: '  ✓ Lead capture form — wired up', delay: 400 },
  { type: 'ok',  text: '  ✓ AI agent for follow-ups — deployed', delay: 400 },
  { type: 'cmd', text: 'vercel deploy --prod', delay: 1000 },
  { type: 'sys', text: '  Deploying to edge network...', delay: 300 },
  { type: 'ok',  text: '  ✓ Live → https://my-startup.vercel.app', delay: 600 },
  { type: 'done', text: '', delay: 400 },
]

function useTyping(text, speed = 40, active = true) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active) return
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, active])
  return displayed
}

function Line({ line }) {
  const [done, setDone] = useState(line.type !== 'cmd')
  const typed = useTyping(line.type === 'cmd' ? line.text : '', 35, !done)

  useEffect(() => {
    if (line.type === 'cmd') {
      const id = setTimeout(() => setDone(true), line.text.length * 35 + 100)
      return () => clearTimeout(id)
    }
  }, [line])

  const text = line.type === 'cmd' ? typed : line.text

  return (
    <div className={`t-line t-line--${line.type}`}>
      {line.type === 'cmd' && <span className="t-prompt">❯ </span>}
      {text}
      {line.type === 'cmd' && !done && <span className="t-cursor" />}
    </div>
  )
}

export default function Terminal() {
  const [visibleLines, setVisibleLines] = useState([])
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let timeout = 0
    SCRIPT.forEach((line, i) => {
      const typingTime = line.type === 'cmd' ? line.text.length * 35 : 0
      timeout += line.delay
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
      }, timeout)
      timeout += typingTime
      return t
    })
  }, [started])

  useEffect(() => {
    if (ref.current) {
      const el = ref.current.querySelector('.t-body')
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [visibleLines])

  return (
    <div className="terminal-wrap" ref={ref}>
      <div className="terminal">
        <div className="t-titlebar">
          <div className="t-dots">
            <span className="t-dot red" />
            <span className="t-dot yellow" />
            <span className="t-dot green" />
          </div>
          <span className="t-title">claude — my-startup — zsh</span>
        </div>
        <div className="t-body">
          {visibleLines.map((line, i) => (
            line.type === 'done'
              ? <div key={i} className="t-line t-line--sys">  Session complete. Your product is live.</div>
              : <Line key={i} line={line} />
          ))}
          {visibleLines.length === 0 && (
            <div className="t-line t-line--sys">  Waiting to start...</div>
          )}
        </div>
      </div>
    </div>
  )
}
