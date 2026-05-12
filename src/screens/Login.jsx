import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'

export default function Login() {
  const navigate = useNavigate()
  const [mobile, setMobile] = useState('')

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="Sign in as Tourist" back />

      <div className="screen-scroll">
        <div className="content">
          <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
            <div style={{ fontSize: 38, marginBottom: 6 }}>🧳</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary-dark)' }}>Welcome, traveler!</div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>Enter your registered mobile</div>
          </div>

          <div className="fld">
            <label>Mobile Number</label>
            <div className="input focused">
              <span className="ic">🇮🇳 +91</span>
              <input
                type="tel"
                placeholder="9829012345"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                maxLength={10}
              />
              {mobile.length === 10 && <span style={{ fontSize: 12, color: '#10B981' }}>✓</span>}
            </div>
          </div>

          <button className="btn-pri" onClick={() => navigate('/otp')}>Send OTP via SMS</button>

          <div className="divider"><span>OR</span></div>

          <button className="btn-sec" onClick={() => navigate('/otp')}>🪪 Sign in via DigiLocker</button>

          <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <div>
              <div className="bold" style={{ fontSize: 12, color: 'var(--accent-dark)' }}>Why we ask for mobile</div>
              <div className="text-xs muted" style={{ marginTop: 2, lineHeight: 1.5 }}>Booking confirmations, AI guide alerts, and 24h grievance updates — all over secure SMS & in-app.</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', textAlign: 'center' }}>
            <span className="text-xs muted">Need help? </span>
            <span className="text-xs" style={{ color: 'var(--primary)', fontWeight: 800 }}>Tourist Helpline 1363 →</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className="text-xs muted">Are you a Government Officer? </span>
            <span className="text-xs" style={{ color: '#1E3A8A', fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/officer-login')}>Officer Portal →</span>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
