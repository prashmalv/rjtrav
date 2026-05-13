import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import StatusBar from '../components/StatusBar'

const COUNTRY_CODES = [
  { flag: '🇮🇳', code: '+91', name: 'India' },
  { flag: '🇺🇸', code: '+1', name: 'USA' },
  { flag: '🇬🇧', code: '+44', name: 'UK' },
  { flag: '🇩🇪', code: '+49', name: 'Germany' },
  { flag: '🇫🇷', code: '+33', name: 'France' },
  { flag: '🇯🇵', code: '+81', name: 'Japan' },
  { flag: '🇦🇺', code: '+61', name: 'Australia' },
  { flag: '🇨🇦', code: '+1', name: 'Canada' },
  { flag: '🇸🇬', code: '+65', name: 'Singapore' },
  { flag: '🇦🇪', code: '+971', name: 'UAE' },
]

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const aiRedirectState = location.state?.aiRedirect ? { aiRedirect: true, initialMsg: location.state.initialMsg } : {}
  const [tab, setTab] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0])
  const [showCountries, setShowCountries] = useState(false)

  const mobileValid = mobile.length >= 7
  const emailValid = email.includes('@') && email.includes('.')

  return (
    <div className="app-shell">
      <StatusBar light />

      {/* Hero */}
      <div style={{ background: 'var(--grad-hero)', padding: '20px 18px 28px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.25 }} />
        <button style={{ position: 'relative', zIndex: 2, fontSize: 18, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12 }} onClick={() => navigate(-1)}>←</button>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>🧳</div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>Welcome, Traveller!</div>
          <div style={{ fontSize: 11, opacity: 0.9, marginTop: 3 }}>Sign in to book, plan & explore Rajasthan</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--soft)', borderRadius: 12, padding: 4 }}>
            {[['mobile', '📱 Mobile'], ['email', '📧 Email']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 12.5, fontWeight: 800,
                  background: tab === key ? '#fff' : 'transparent',
                  color: tab === key ? 'var(--primary-dark)' : 'var(--ink-mute)',
                  border: 'none', cursor: 'pointer',
                  boxShadow: tab === key ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >{label}</button>
            ))}
          </div>

          {/* Mobile tab */}
          {tab === 'mobile' && (
            <>
              <div className="fld">
                <label>Mobile Number</label>
                <div className="input focused" style={{ gap: 0 }}>
                  {/* Country code picker */}
                  <div
                    onClick={() => setShowCountries(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 10px 0 4px', borderRight: '1px solid var(--border)', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <span style={{ fontSize: 18 }}>{countryCode.flag}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{countryCode.code}</span>
                    <span style={{ fontSize: 9, color: 'var(--ink-mute)' }}>▼</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    style={{ flex: 1, paddingLeft: 10 }}
                  />
                  {mobileValid && <span style={{ fontSize: 14, color: '#10B981', paddingRight: 10 }}>✓</span>}
                </div>
                {/* Country dropdown */}
                {showCountries && (
                  <>
                    <div onClick={() => setShowCountries(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
                    <div style={{ position: 'absolute', zIndex: 99, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxHeight: 240, overflowY: 'auto', left: 0, right: 0, marginTop: 4 }}>
                      {COUNTRY_CODES.map(c => (
                        <div
                          key={c.name}
                          onClick={() => { setCountryCode(c); setShowCountries(false) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--soft)', background: c.name === countryCode.name ? 'var(--primary-ghost)' : 'transparent' }}
                        >
                          <span style={{ fontSize: 20 }}>{c.flag}</span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--ink-mute)', fontWeight: 700 }}>{c.code}</span>
                          {c.name === countryCode.name && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button className="btn-pri" style={{ opacity: mobileValid ? 1 : 0.6 }} onClick={() => navigate('/otp', { state: aiRedirectState })}>
                Send OTP via SMS →
              </button>
            </>
          )}

          {/* Email tab */}
          {tab === 'email' && (
            <>
              <div className="fld">
                <label>Email Address</label>
                <div className="input focused">
                  <span className="ic">📧</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoCapitalize="none"
                  />
                  {emailValid && <span style={{ fontSize: 14, color: '#10B981' }}>✓</span>}
                </div>
              </div>
              <button className="btn-pri" style={{ opacity: emailValid ? 1 : 0.6 }} onClick={() => navigate('/otp', { state: aiRedirectState })}>
                Send OTP via Email →
              </button>
            </>
          )}

          <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <div>
              <div className="bold" style={{ fontSize: 12, color: 'var(--accent-dark)' }}>Secure & Private</div>
              <div className="text-xs muted" style={{ marginTop: 2, lineHeight: 1.5 }}>
                OTP-based login — no password needed. Booking confirmations, AI guide alerts & 24h grievance updates included.
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span className="text-xs muted">Need help? </span>
            <span className="text-xs" style={{ color: 'var(--primary)', fontWeight: 800 }}>Tourist Helpline 1363 →</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className="text-xs muted">Government Officer? </span>
            <span className="text-xs" style={{ color: '#1E3A8A', fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/officer-login')}>Officer Portal →</span>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
