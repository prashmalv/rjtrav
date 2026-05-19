import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'

const INTERESTS = [
  { ico: '/images/fort.png', label: 'Forts & Palaces' },
  { ico: '🐅', label: 'Wildlife' },
  { ico: '🏜', label: 'Desert & Dunes' },
  { ico: '🍽', label: 'Food & Cuisine' },
  { ico: '📸', label: 'Photography' },
  { ico: '🛍', label: 'Shopping' },
  { ico: '⛵', label: 'Lakes & Nature' },
  { ico: '🧘', label: 'Wellness & Culture' },
  { ico: '🛕', label: 'Religious Places' },
  { ico: '🏛', label: 'UNESCO Heritage' },
]

function ChipIcon({ ico, size = 22 }) {
  if (typeof ico === 'string' && (ico.startsWith('/') || ico.startsWith('http'))) {
    return <img src={ico} alt="" style={{ width: size, height: size, objectFit: 'contain' }} />
  }
  return <span style={{ fontSize: size }}>{ico}</span>
}

const TRAVEL_STYLES = [
  { ico: '🧍', label: 'Solo', desc: 'Travelling alone' },
  { ico: '👫', label: 'Couple', desc: 'Romantic getaway' },
  { ico: '👨‍👩‍👧', label: 'Family', desc: 'With kids/parents' },
  { ico: '👥', label: 'Group', desc: 'Friends group' },
]

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Other']

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', age: '', nationality: 'Indian', homeCity: 'Delhi', interests: [], travelStyle: 'Family', language: 'English' })

  const toggleInterest = (label) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(label) ? f.interests.filter(i => i !== label) : [...f.interests, label]
    }))
  }

  const handleFinish = () => {
    login({ name: form.name || 'Vikram Singh', initials: (form.name || 'VS').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2), ...form, trips: 0, points: 500, tier: 'Silver' })
    navigate('/home')
  }

  return (
    <div className="app-shell">
      <StatusBar light />
      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '14px 18px 20px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.25 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 4 }}>Step {step} of 3</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>
            {step === 1 ? '👋 Welcome!' : step === 2 ? '🎯 Your Interests' : '🗺 Travel Style'}
          </div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            {step === 1 ? 'Tell us a bit about yourself to personalise your experience' : step === 2 ? 'AI will suggest the best places based on your interests' : 'We will build your itinerary based on this'}
          </div>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ height: 4, borderRadius: 2, background: s <= step ? '#fff' : 'rgba(255,255,255,0.3)', flex: s === step ? 2 : 1, transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Step 1 — Basic Info */}
          {step === 1 && (
            <>
              <div className="fld">
                <label>Your Name</label>
                <div className="input focused">
                  <span className="ic">👤</span>
                  <input placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
              </div>
              <div className="grid-2">
                <div className="fld">
                  <label>Age</label>
                  <div className="input">
                    <input type="number" placeholder="28" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} style={{ flex: 1 }} />
                  </div>
                </div>
                <div className="fld">
                  <label>Nationality</label>
                  <div className="input">
                    <span className="ic">🌏</span>
                    <select style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }} value={form.nationality} onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}>
                      <option>Indian</option>
                      <option>American</option>
                      <option>British</option>
                      <option>German</option>
                      <option>French</option>
                      <option>Japanese</option>
                      <option>Australian</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="fld">
                <label>Home City / Travelling From</label>
                <div className="input">
                  <span className="ic">🏙️</span>
                  <select style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }} value={form.homeCity} onChange={e => setForm(f => ({ ...f, homeCity: e.target.value }))}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="fld">
                <label>Preferred Language</label>
                <div className="input">
                  <span className="ic">🗣</span>
                  <select style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }} value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marwari</option>
                    <option>German</option>
                    <option>French</option>
                    <option>Japanese</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>
              <div className="ai-box">
                <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>🤖 Rajwada AI learns your preferences</div>
                <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3 }}>Based on your home city's travel patterns, AI will suggest smart routes to Rajasthan — avoiding crowded days automatically!</div>
              </div>
              <button className="btn-pri" onClick={() => setStep(2)}>Next →</button>
            </>
          )}

          {/* Step 2 — Interests */}
          {step === 2 && (
            <>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>What do you want to experience? <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 500 }}>(Select all that apply)</span></div>
              </div>
              <div className="grid-2">
                {INTERESTS.map(item => (
                  <div key={item.label} onClick={() => toggleInterest(item.label)} style={{
                    background: form.interests.includes(item.label) ? 'linear-gradient(135deg,var(--primary-ghost),var(--soft))' : 'var(--surface)',
                    border: `${form.interests.includes(item.label) ? 2 : 1}px solid ${form.interests.includes(item.label) ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 12, padding: '12px 10px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  }}>
                    <ChipIcon ico={item.ico} size={22} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: form.interests.includes(item.label) ? 'var(--primary-dark)' : 'var(--ink)' }}>{item.label}</span>
                    {form.interests.includes(item.label) && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 800, fontSize: 14 }}>✓</span>}
                  </div>
                ))}
              </div>
              {form.interests.length > 0 && (
                <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', textAlign: 'center' }}>
                  {form.interests.length} interest{form.interests.length > 1 ? 's' : ''} selected
                </div>
              )}
              <div className="grid-2">
                <button className="btn-sec" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-pri" onClick={() => setStep(3)}>Next →</button>
              </div>
            </>
          )}

          {/* Step 3 — Travel Style */}
          {step === 3 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>How do you travel?</div>
              {TRAVEL_STYLES.map(s => (
                <div key={s.label} onClick={() => setForm(f => ({ ...f, travelStyle: s.label }))} style={{
                  background: form.travelStyle === s.label ? 'linear-gradient(135deg,var(--primary-ghost),var(--soft))' : 'var(--surface)',
                  border: `${form.travelStyle === s.label ? 2 : 1}px solid ${form.travelStyle === s.label ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 12, padding: '14px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 30 }}>{s.ico}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: form.travelStyle === s.label ? 'var(--primary-dark)' : 'var(--ink)' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{s.desc}</div>
                  </div>
                  {form.travelStyle === s.label && <span style={{ color: 'var(--primary)', fontSize: 20, fontWeight: 800 }}>✓</span>}
                </div>
              ))}

              <div className="ai-box">
                <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>🎁 500 Welcome Points!</div>
                <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3 }}>
                  Complete your profile to earn 500 reward points. Reach Rajasthan Gold tier with 5,000 points.
                </div>
              </div>

              <div className="grid-2">
                <button className="btn-sec" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-gold" onClick={handleFinish}>🚀 Start Exploring!</button>
              </div>
            </>
          )}
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
