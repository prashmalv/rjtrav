import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'

export default function SignUp() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <StatusBar light />
      {/* Hero */}
      <div style={{ background: 'var(--grad-hero)', height: 210, flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 18, color: '#fff' }}>
        <div className="pattern-bg" style={{ opacity: 0.25 }} />
        <button style={{ position: 'absolute', top: 14, left: 14, fontSize: 18, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate(-1)}>←</button>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>🎁</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>Join Rajasthan Tourism</h2>
          <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>Free · Secure · Works worldwide</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">

          {/* Benefits */}
          <div className="surface" style={{ padding: 14 }}>
            <div className="bold" style={{ fontSize: 13, marginBottom: 10, color: 'var(--primary-dark)' }}>✨ What you'll get</div>
            {[
              ['🤖', 'Padharo AI', 'Personalised travel guide in 6 languages'],
              ['🗺', 'AI Itinerary Builder', 'Smart trips with crowd intelligence'],
              ['🎫', 'Easy Booking', 'Forts, packages & experiences in 2 taps'],
              ['📢', 'Grievance System', '24-hour resolution guarantee'],
              ['🏅', 'Reward Points', 'Earn points on every booking'],
            ].map(([ico, title, sub]) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{ico}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>{title}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sign in options */}
          <button className="btn-pri" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={() => navigate('/login')}>
            📱 Continue with Mobile Number
          </button>
          <button className="btn-sec" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={() => navigate('/login')}>
            📧 Continue with Email
          </button>

          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.5 }}>
            By continuing you agree to our{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Terms</span> &amp;{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Privacy Policy</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Government Officer? </span>
            <span style={{ fontSize: 11, color: '#1E3A8A', fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/officer-login')}>Officer Login →</span>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
