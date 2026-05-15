import { useNavigate } from 'react-router-dom'
import { useApp, destinations, packages } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'
import { useT } from '../i18n'

export default function TouristHome() {
  const navigate = useNavigate()
  const { user, showToast, appLanguage } = useApp()
  const t = useT(appLanguage)

  return (
    <div className="app-shell">
      {/* Gradient header */}
      <div style={{ background: 'var(--grad-hero)', padding: '12px 16px 16px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.3 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <StatusBar light />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>{t.namaste}</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{user?.name || 'Vikram Singh'}</div>
              <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>📍 Jaipur · Heritage Explorer</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LanguageSelector light />
              <button onClick={() => navigate('/sos')} style={{ background: '#EF4444', border: 'none', width: 34, height: 34, borderRadius: '50%', color: '#fff', fontSize: 11, fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.5)', animation: 'fabPulse 3s ease-in-out infinite', flexShrink: 0 }}>
                SOS
              </button>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),#fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'var(--primary-darker)', cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/profile')}>
                {user?.initials || 'VS'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content" style={{ paddingTop: 14 }}>
          {/* Search */}
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search destinations, packages..." readOnly onClick={() => navigate('/explore')} />
            <span>🎤</span>
          </div>

          {/* KPI Row */}
          <div className="kpi-row">
            <div className="kpi">
              <div className="kl">{t.upcomingTrip}</div>
              <div className="kv" style={{ fontSize: 14, color: 'var(--primary-dark)' }}>Royal Trail</div>
              <div className="kd">⏱ in 12 days</div>
            </div>
            <div className="kpi">
              <div className="kl">{t.rewardPoints}</div>
              <div className="kv">2,840</div>
              <div className="kd">+340 this month</div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="sec-head"><h3>{t.quickActions}</h3></div>
          <div className="cat-grid">
            {[
              ['🗺', 'Explore', '/explore'],
              ['🎫', 'My Trips', '/my-trips'],
              ['🤖', 'AI Chat', '/ai-chat'],
              ['🗓', 'Itinerary', '/itinerary-builder'],
              ['📢', 'Grievance', '/grievances'],
              ['🏨', 'BSP List', '/bsp'],
              ['🆘', 'SOS', '/sos'],
              ['👤', 'Profile', '/profile'],
            ].map(([ico, nm, path]) => (
              <div key={nm} className="cat-tile" onClick={() => path ? navigate(path) : showToast('Coming soon')}>
                <div className="cat-ico">{ico}</div>
                <div className="cat-nm">{nm}</div>
              </div>
            ))}
          </div>

          {/* Upcoming trip */}
          <div className="sec-head"><h3>Upcoming Trip</h3><span className="more" onClick={() => navigate('/my-trips')}>View all →</span></div>
          <div className="booking-card" onClick={() => navigate('/my-trips')}>
            <div className="booking-card-img" style={{ background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
              🏯
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.6))', zIndex: 1 }} />
              <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                <span className="chip chip-accent">⏱ in 12 days</span>
              </div>
              <div style={{ position: 'absolute', bottom: 10, left: 10, color: '#fff', zIndex: 2 }}>
                <div style={{ fontSize: 15, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Royal Rajasthan Trail</div>
                <div style={{ fontSize: 10.5, opacity: 0.95 }}>Jaipur · Udaipur · Jaisalmer · 7N</div>
              </div>
            </div>
            <div className="booking-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 10 }}>
                <span style={{ color: 'var(--ink-mute)' }}>Booking ID</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>RAJ-26-04812</span>
              </div>
              <div className="timeline" style={{ paddingLeft: 4 }}>
                {[
                  { status: 'done', title: 'Booking Confirmed', time: 'Apr 18 · ✓ Paid ₹1.27L' },
                  { status: 'active', title: 'Pre-trip prep', time: 'Vouchers ready · AI guide unlocked' },
                  { status: '', title: 'Check-in · Heritage Haveli', time: 'Nov 15 · 2 PM' },
                ].map((item, i) => (
                  <div key={i} className={`tl-item ${item.status}`}>
                    <div className="tl-dot" />
                    <div className="tl-title">{item.title}</div>
                    <div className="tl-time">{item.time}</div>
                  </div>
                ))}
              </div>
              <div className="grid-2" style={{ marginTop: 10 }}>
                <button className="btn-flat" style={{ textAlign: 'center', fontSize: 11 }}>📄 Voucher</button>
                <button className="btn-pri btn-sm" style={{ display: 'block', textAlign: 'center' }} onClick={() => navigate('/my-trips')}>View Details</button>
              </div>
            </div>
          </div>

          {/* Recommended */}
          <div className="sec-head"><h3>{t.recommendedForYou}</h3><span className="more" onClick={() => navigate('/explore')}>{t.more}</span></div>
          {destinations.slice(0, 3).map(d => (
            <div key={d.id} className="list-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/destination/${d.id}`)}>
              <div className="lc-thumb" style={{ overflow: 'hidden', padding: 0, flexShrink: 0 }}>
                <img src={d.imgUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display='none' }} />
              </div>
              <div className="lc-info">
                <div className="lc-title">{d.name}</div>
                <div className="lc-sub"><span>📍 {d.city}</span><span>⭐ {d.rating}</span></div>
              </div>
              <div className="lc-arrow">›</div>
            </div>
          ))}

          {/* AI tip */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>💡 Rajwada AI tip for you</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 4 }}>
              Pre-book Jaisalmer camel safari now — 11 Nov is the Pushkar Camel Fair, prices spike 40%. <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/packages')}>Tap to book.</span>
            </div>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>

      {/* AI FAB */}
      <div className="chat-fab" onClick={() => navigate('/ai-chat')} title="Chat with Rajwada AI">
        💬
        <span className="fab-badge" />
      </div>

      <BottomNav />
    </div>
  )
}
