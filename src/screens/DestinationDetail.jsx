import { useParams, useNavigate } from 'react-router-dom'
import { useApp, destinations } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

export default function DestinationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, showToast } = useApp()
  const dest = destinations.find(d => d.id === parseInt(id)) || destinations[0]

  return (
    <div className="app-shell">
      {/* Hero image */}
      <div style={{ height: 220, position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        <img src={dest.imgUrl} alt={dest.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} onError={e => { e.target.style.display='none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, zIndex: 0 }}>
          {dest.img}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.4) 0%,transparent 30%,transparent 60%,rgba(0,0,0,0.7))', zIndex: 2 }} />
        {/* Top controls */}
        <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', zIndex: 4 }}>
          <button style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }} onClick={() => navigate(-1)}>←</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#EF4444' }} onClick={() => showToast('Added to wishlist ❤️')}>♥</button>
            <button style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }} onClick={() => showToast('Share link copied!')}>⤴</button>
          </div>
        </div>
        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, color: '#fff', zIndex: 4 }}>
          <span className="chip" style={{ background: 'var(--accent)', color: '#3D1F00', marginBottom: 6, display: 'inline-block' }}>{dest.badge}</span>
          <div style={{ fontSize: 22, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{dest.name}</div>
          <div style={{ fontSize: 11, opacity: 0.95 }}>📍 {dest.city} · ⭐ {dest.rating} ({dest.reviews.toLocaleString()} reviews)</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Quick actions */}
          <div className="grid-4">
            {[['🧭', 'Map'], ['🎫', 'Tickets'], ['🤖', 'AI Guide'], ['📷', 'AR']].map(([ico, lbl]) => (
              <button key={lbl} className="btn-flat" style={{ textAlign: 'center', padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                onClick={() => lbl === 'AI Guide' ? navigate('/ai-chat') : showToast(`${lbl} coming soon`)}>
                <span style={{ fontSize: 16 }}>{ico}</span>
                <span style={{ fontSize: 10 }}>{lbl}</span>
              </button>
            ))}
          </div>

          {/* About */}
          <div>
            <div className="bold" style={{ fontSize: 13, marginBottom: 5 }}>About</div>
            <div className="text-sm muted" style={{ lineHeight: 1.6 }}>{dest.desc}</div>
          </div>

          {/* KPIs */}
          <div className="kpi-row">
            <div className="kpi"><div className="kl">Entry Fee</div><div className="kv" style={{ fontSize: 15 }}>{dest.price}</div><div className="kd" style={{ color: 'var(--ink-mute)' }}>Indian / Foreign</div></div>
            <div className="kpi"><div className="kl">Best Time</div><div className="kv" style={{ fontSize: 15 }}>{dest.bestTime}</div><div className="kd" style={{ color: 'var(--ink-mute)' }}>9:30 AM peak</div></div>
          </div>

          {/* AI tip */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 3 }}>💡 Personalized for you</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              Best visited in early morning for golden light and fewer crowds. Pair with nearby attractions for a full day experience.
            </div>
          </div>

          {/* Gate if not logged in */}
          {!isLoggedIn && (
            <div style={{ background: 'var(--grad-hero)', padding: 16, borderRadius: 14, color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div className="pattern-bg" style={{ opacity: 0.2 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>🔓</div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Sign in to unlock more</div>
                <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 10, lineHeight: 1.5 }}>
                  ✓ Book tickets & tours instantly<br />
                  ✓ Save to itinerary & trips<br />
                  ✓ Chat with Padharo AI guide<br />
                  ✓ File grievances if needed
                </div>
                <button style={{ background: '#F59E0B', color: '#3D1F00', padding: '9px 0', borderRadius: 8, fontWeight: 800, fontSize: 12, width: '100%' }} onClick={() => navigate('/signup')}>
                  Sign In / Sign Up Free →
                </button>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <button className="btn-pri" onClick={() => { showToast('Added to itinerary ✓'); navigate('/explore') }}>
              + Add to My Itinerary
            </button>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
