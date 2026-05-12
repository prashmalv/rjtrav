import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'

export default function SignUp() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <StatusBar light />
      {/* Hero */}
      <div style={{ background: 'var(--grad-hero)', height: 200, flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 18, color: '#fff' }}>
        <div className="pattern-bg" />
        <button style={{ position: 'absolute', top: 14, left: 14, fontSize: 18, color: '#fff', background: 'none', border: 'none' }} onClick={() => navigate(-1)}>←</button>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 34, marginBottom: 4 }}>🎁</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>Join & explore Rajasthan</h2>
          <div style={{ fontSize: 11, opacity: 0.92 }}>Free · 24×7 support · DPDP compliant</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Benefits */}
          <div className="surface" style={{ padding: 14 }}>
            <div className="bold" style={{ fontSize: 13, marginBottom: 10 }}>What you'll get</div>
            {[
              ['🎫', 'Book stays, packages & experiences'],
              ['🤖', 'Padharo AI · Hindi · Marwari · English'],
              ['📢', 'AI Grievance system · 24h response'],
              ['🪪', 'DigiLocker integration · Verified ID'],
            ].map(([ico, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{ico}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>

          <button className="btn-pri" onClick={() => navigate('/login')}>📱 Continue with Mobile (OTP)</button>
          <button className="btn-sec" onClick={() => navigate('/login')}>🪪 Sign in with DigiLocker</button>

          <div className="grid-2">
            <button style={{ background: '#fff', border: '1px solid var(--border)', padding: '11px 0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: 'var(--ink)' }} onClick={() => navigate('/login')}>📧 Email</button>
            <button style={{ background: '#fff', border: '1px solid var(--border)', padding: '11px 0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: 'var(--ink)' }} onClick={() => navigate('/login')}>G Google</button>
          </div>

          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.5 }}>
            By continuing you agree to <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Terms</span> &amp; <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Privacy Policy</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Are you a Govt Officer? </span>
            <span style={{ fontSize: 11, color: '#1E3A8A', fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/officer-login')}>Officer Login →</span>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
