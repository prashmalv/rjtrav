import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'

const CATEGORIES = [
  { ico: '💰', title: 'Overcharging', sub: 'Pricing disputes', accent: true },
  { ico: '🏨', title: 'BSP / Operator', sub: 'Hotel, guide, tour' },
  { ico: '🚧', title: 'Infrastructure', sub: 'Roads, toilets, signs' },
  { ico: '🛡', title: 'Safety', sub: 'Harassment, theft' },
  { ico: '🎫', title: 'Booking Issue', sub: 'Refund, cancel' },
  { ico: '🚌', title: 'Transport', sub: 'Cab, bus, auto' },
  { ico: '🍽', title: 'Food / Hygiene', sub: 'Restaurants' },
  { ico: '📋', title: 'Other', sub: 'Anything else' },
]

export default function FileGrievance() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState(null)
  const [desc, setDesc] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const handleNext = () => {
    if (step === 2) {
      setAnalyzing(true)
      setTimeout(() => { setAnalyzing(false); setAnalyzed(true); setStep(3) }, 2000)
    } else if (step === 3) {
      navigate('/grievance-submitted')
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title={step === 1 ? 'File a Grievance' : step === 2 ? 'Add Details' : 'AI Analysis'} back />

      {/* Progress */}
      <div style={{ padding: '6px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--ink-mute)', fontWeight: 600, marginBottom: 5 }}>
          <span>Step {step} of 3</span>
          <span>{step === 1 ? 'Category' : step === 2 ? 'Description & Evidence' : 'AI Analysis'}</span>
        </div>
        <div className="progress-bar"><div className="fill" style={{ width: `${(step / 3) * 100}%` }} /></div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Step 1 - Category */}
          {step === 1 && (
            <>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>What's the issue?</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>Pick a category — AI will refine and route</div>
              </div>

              <div className="grid-2">
                {CATEGORIES.map(cat => (
                  <div
                    key={cat.title}
                    onClick={() => setCategory(cat.title)}
                    style={{
                      background: category === cat.title
                        ? 'linear-gradient(180deg,var(--accent-light),var(--surface))'
                        : 'var(--surface)',
                      border: `${category === cat.title ? 2 : 1}px solid ${category === cat.title ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '13px 8px', textAlign: 'center', cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 4 }}>{cat.ico}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{cat.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 2 }}>{cat.sub}</div>
                  </div>
                ))}
              </div>

              <div className="ai-box">
                <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>🤖 Not sure?</div>
                <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3 }}>
                  Just describe in next step — AI auto-categorizes with 96% accuracy and routes to right officer.
                </div>
              </div>

              <button className={`btn-pri${!category ? ' btn-disabled' : ''}`} style={{ opacity: category ? 1 : 0.5 }} onClick={() => category && handleNext()}>
                Continue with "{category || '...'}" →
              </button>
            </>
          )}

          {/* Step 2 - Description */}
          {step === 2 && (
            <>
              <div className="fld">
                <label>Describe what happened *</label>
                <div className="input" style={{ alignItems: 'flex-start', flexDirection: 'column', padding: 10, height: 100 }}>
                  <textarea
                    style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', font: 'inherit', fontSize: 12, color: 'var(--ink)', resize: 'none', lineHeight: 1.5 }}
                    placeholder="Describe the issue in detail..."
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    rows={4}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-mute)' }}>
                  <span>Min 30 chars</span>
                  <span>{desc.length} / 500</span>
                </div>
              </div>

              <div className="fld">
                <label>📍 Location (auto-detected)</label>
                <div className="input">
                  <span className="ic">📌</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 12 }}>Brahma Ghat, Pushkar 305022</span>
                  <span style={{ fontSize: 9.5, color: '#10B981', fontWeight: 800 }}>GPS ✓</span>
                </div>
              </div>

              <div className="fld">
                <label>Add Evidence (optional)</label>
                <div className="grid-3">
                  <div style={{ aspectRatio: 1, background: 'var(--grad-hero)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📷</div>
                  <div style={{ aspectRatio: 1, background: 'var(--surface)', border: '2px dashed var(--primary)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer', fontSize: 20 }}>+<span style={{ fontSize: 10, fontWeight: 700 }}>Add</span></div>
                </div>
              </div>

              <div className="grid-2">
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎤</div>
                  <div><div style={{ fontSize: 11, fontWeight: 700 }}>Voice Note</div><div style={{ fontSize: 9.5, color: '#10B981', fontWeight: 700 }}>▶ 0:34 added</div></div>
                </div>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎥</div>
                  <div><div style={{ fontSize: 11, fontWeight: 700 }}>Video</div><div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>Optional</div></div>
                </div>
              </div>

              <button className="btn-pri" onClick={handleNext}>
                {analyzing ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    AI Analysing...
                  </span>
                ) : 'Run AI Analysis →'}
              </button>
            </>
          )}

          {/* Step 3 - AI Analysis */}
          {step === 3 && (
            <>
              <div style={{ background: 'linear-gradient(135deg,var(--accent-light),var(--soft))', borderRadius: 12, padding: 12, border: '1.5px solid var(--accent)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -9, left: 10, background: 'linear-gradient(135deg,var(--accent),var(--accent-dark))', color: '#3D1F00', fontSize: 9, fontWeight: 800, letterSpacing: 0.6, padding: '2px 8px', borderRadius: 6 }}>AI ANALYSIS COMPLETE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <div style={{ fontSize: 28 }}>🤖</div>
                  <div>
                    <div className="bold" style={{ fontSize: 14, color: 'var(--ink)' }}>Rajwada AI reviewed</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Processed in 2.4 seconds</div>
                  </div>
                </div>
              </div>

              <div className="surface" style={{ padding: 12 }}>
                <div className="bold" style={{ fontSize: 12, marginBottom: 8 }}>📂 Auto-Categorization</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{category || 'Overcharging'} (BSP)</span>
                  <span className="chip chip-success">96% confident</span>
                </div>
                <div className="ai-meter"><div className="fill" style={{ width: '96%', background: '#10B981' }} /></div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 4 }}>Sub: Tour operator pricing dispute</div>
              </div>

              <div className="kpi-row">
                <div className="kpi" style={{ borderLeft: '3px solid #EF4444' }}>
                  <div className="kl">Priority</div>
                  <div className="kv" style={{ fontSize: 14, color: '#EF4444' }}>⚡ HIGH</div>
                  <div className="kd" style={{ color: 'var(--ink-mute)' }}>₹3,000 disputed</div>
                </div>
                <div className="kpi" style={{ borderLeft: '3px solid var(--accent)' }}>
                  <div className="kl">Sentiment</div>
                  <div className="kv" style={{ fontSize: 14, color: 'var(--accent-dark)' }}>😟 Distressed</div>
                  <div className="kd" style={{ color: 'var(--ink-mute)' }}>Negative tone</div>
                </div>
              </div>

              <div className="surface" style={{ padding: 12 }}>
                <div className="bold" style={{ fontSize: 12, marginBottom: 8 }}>🎯 Routing Plan</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>👮</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>DTO Pushkar Circle</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>L1 · Anita Sharma · 18h avg</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🏢</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>RTDC HQ (if escalated)</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>L2 · Auto-escalate in 48h</div>
                  </div>
                </div>
              </div>

              <div className="ai-box">
                <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 5 }}>💡 AI Suggested Resolution</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  1️⃣ <strong>Refund of ₹3,000</strong> by BSP within 7 days<br />
                  2️⃣ <strong>Warning notice</strong> (3rd complaint this month)<br />
                  3️⃣ <strong>Listing review</strong> on tourism portal<br />
                  <span style={{ color: 'var(--accent-dark)', fontWeight: 700 }}>Est resolution: 4–7 days</span>
                </div>
              </div>

              <div className="grid-2">
                <button className="btn-sec" style={{ fontSize: 12 }} onClick={() => setStep(2)}>Edit</button>
                <button className="btn-pri" style={{ fontSize: 12 }} onClick={() => navigate('/grievance-submitted')}>Submit →</button>
              </div>
            </>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
