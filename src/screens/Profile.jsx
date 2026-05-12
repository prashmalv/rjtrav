import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout, showToast } = useApp()

  const handleLogout = () => {
    logout()
    navigate('/visitor')
  }

  return (
    <div className="app-shell">
      <StatusBar light />
      <div style={{ background: 'var(--grad-hero)', padding: '18px 16px 40px', color: '#fff', textAlign: 'center', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.3 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button className="appbar-back" style={{ color: '#fff' }} onClick={() => navigate(-1)}>≡</button>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Me</span>
          <button style={{ fontSize: 16, color: '#fff', background: 'none' }}>⚙️</button>
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),#fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'var(--primary-darker)', margin: '0 auto 8px', border: '3px solid rgba(255,255,255,0.3)' }}>
            {user?.initials || 'VS'}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{user?.name || 'Vikram Singh'}</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>⭐ Heritage Explorer · {user?.trips || 4} trips</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700 }}>🪪 KYC ✓</span>
            <span style={{ background: 'rgba(245,158,11,0.9)', color: '#3D1F00', padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 800 }}>Gold Tier</span>
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content" style={{ marginTop: -22 }}>
          <div className="kpi-row">
            <div className="kpi"><div className="kl">Trips</div><div className="kv">{user?.trips || 4}</div><div className="kd" style={{ color: 'var(--ink-mute)' }}>Lifetime</div></div>
            <div className="kpi"><div className="kl">Reward Pts</div><div className="kv">{(user?.points || 2840).toLocaleString()}</div><div className="kd">+340 month</div></div>
          </div>

          {/* Account */}
          <div className="surface overflow-hidden">
            <div style={{ padding: '9px 12px', fontSize: 10.5, fontWeight: 800, color: 'var(--ink-mute)', letterSpacing: 0.5, textTransform: 'uppercase', background: 'var(--soft)' }}>Account & Privacy</div>
            {[
              { ico: '🪪', title: 'KYC & DigiLocker', sub: 'Aadhaar verified ✓' },
              { ico: '🛡', title: 'Privacy & Data', sub: 'DPDP Act 2023' },
              { ico: '🔔', title: 'Notifications', sub: 'Trips · Grievances · Offers' },
              { ico: '📋', title: 'Transaction History', sub: '3 bookings · ₹2.8L total' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: i < 3 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }} onClick={() => showToast('Coming soon')}>
                <span style={{ fontSize: 16 }}>{item.ico}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{item.title}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>{item.sub}</div>
                </div>
                <span style={{ color: 'var(--ink-mute)' }}>›</span>
              </div>
            ))}
          </div>

          {/* Help */}
          <div className="surface overflow-hidden">
            <div style={{ padding: '9px 12px', fontSize: 10.5, fontWeight: 800, color: 'var(--ink-mute)', letterSpacing: 0.5, textTransform: 'uppercase', background: 'var(--soft)' }}>Help & Support</div>
            <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => navigate('/grievances')}>
              <span style={{ fontSize: 16 }}>📢</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>My Grievances</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>3 filed · 1 active</div>
              </div>
              <span className="chip chip-warn">1 active</span>
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => showToast('Calling 1363...')}>
              <span style={{ fontSize: 16 }}>📞</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Helpline</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>1363 · 24×7</div>
              </div>
              <span style={{ color: 'var(--ink-mute)' }}>›</span>
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={handleLogout}>
              <span style={{ fontSize: 16 }}>🚪</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>Sign Out</div>
              </div>
            </div>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
