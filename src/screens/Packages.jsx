import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import { packages } from '../context/AppContext'

export default function Packages() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="Packages & Tours" back />

      <div className="screen-scroll">
        <div className="content">
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>💡 AI Recommendation</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3 }}>
              Based on your interest in Heritage sites — Royal Rajasthan Trail is the #1 pick this season!
            </div>
          </div>

          {packages.map(pkg => (
            <div key={pkg.id} className="booking-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/package/${pkg.id}`)}>
              <div className="booking-card-img" style={{ position: 'relative', overflow: 'hidden', background: 'var(--grad-hero)' }}>
                <img src={pkg.imgUrl} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }} onError={e => { e.target.style.display = 'none' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.65))', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                  <span className="chip chip-accent">{pkg.badge}</span>
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '3px 7px' }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>🔥 {pkg.booked.toLocaleString()} booked</span>
                </div>
                <div style={{ position: 'absolute', bottom: 10, left: 10, color: '#fff', zIndex: 2 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{pkg.name}</div>
                  <div style={{ fontSize: 10.5, opacity: 0.95 }}>{pkg.cities}</div>
                </div>
              </div>
              <div className="booking-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{pkg.days} Days · {pkg.nights} Nights · From</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-dark)' }}>₹{pkg.price.toLocaleString()}<span style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 600 }}>/person</span></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: 'var(--accent-dark)', fontWeight: 700 }}>⭐ {pkg.rating}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>{pkg.reviews} reviews</div>
                  </div>
                </div>
                <div className="grid-4" style={{ marginTop: 10 }}>
                  {pkg.includes.map(inc => (
                    <div key={inc} style={{ padding: '6px 3px', background: 'var(--soft)', borderRadius: 7, textAlign: 'center' }}>
                      <div style={{ fontSize: 13 }}>{inc === '4★ Stay' ? '🏨' : inc === 'Transport' ? '🚐' : inc === 'Meals' ? '🍽' : inc === 'Entry' ? '🎫' : inc === 'Luxury Tent' ? '⛺' : inc === 'Camel Safari' ? '🐪' : inc === 'Breakfast' ? '☕' : inc === 'Heritage Hotel' ? '🏰' : inc === 'Boat Ride' ? '⛵' : inc === 'Guide' ? '👤' : '✓'}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, marginTop: 2 }}>{inc}</div>
                    </div>
                  ))}
                </div>
                <button className="btn-pri" style={{ marginTop: 10 }} onClick={e => { e.stopPropagation(); navigate(`/package/${pkg.id}`) }}>Book This Package →</button>
              </div>
            </div>
          ))}
          <div style={{ height: 8 }} />
        </div>
      </div>

      <div className="chat-fab" onClick={() => navigate('/ai-chat')}>💬<span className="fab-badge" /></div>
      <BottomNav />
    </div>
  )
}
