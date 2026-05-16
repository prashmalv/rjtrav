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
          {/* RTDC Official packages banner */}
          <div
            onClick={() => window.open('https://rtdc.tourism.rajasthan.gov.in/Client/PackageTour.aspx', '_blank')}
            style={{ background: 'linear-gradient(135deg,#1E3A8A,#1D4ED8)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 2 }}
          >
            <div style={{ fontSize: 28, flexShrink: 0 }}>🏛</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 2 }}>RTDC Official Tour Packages</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>Book directly from Rajasthan Tourism Development Corporation · Govt. of Rajasthan</div>
            </div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }}>↗</div>
          </div>

          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>💡 Rajwada AI Recommendation</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3 }}>
              Royal Rajasthan Trail is the #1 pick this season! For ultimate luxury, try the iconic Palace on Wheels luxury train.
            </div>
          </div>

          {packages.map(pkg => (
            <div
              key={pkg.id}
              className="booking-card"
              style={{ cursor: 'pointer' }}
              onClick={() => pkg.bookingUrl ? window.open(pkg.bookingUrl, '_blank') : navigate(`/package/${pkg.id}`)}
            >
              <div className="booking-card-img" style={{ position: 'relative', overflow: 'hidden', background: 'var(--grad-hero)' }}>
                <img src={pkg.imgUrl} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }} onError={e => { e.target.style.display = 'none' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.65))', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                  <span className="chip chip-accent">{pkg.badge}</span>
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '3px 7px' }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>🔥 {pkg.booked.toLocaleString()} booked</span>
                </div>
                {pkg.bookingUrl && (
                  <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 2, background: '#16A34A', borderRadius: 7, padding: '2px 8px' }}>
                    <span style={{ fontSize: 8.5, fontWeight: 800, color: '#fff' }}>✓ Official RTDC</span>
                  </div>
                )}
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
                      <div style={{ fontSize: 13 }}>{inc === '4★ Stay' ? '🏨' : inc === 'Transport' ? '🚐' : inc === 'Meals' ? '🍽' : inc === 'Entry' ? '🎫' : inc === 'Luxury Tent' ? '⛺' : inc === 'Camel Safari' ? '🐪' : inc === 'Breakfast' ? '☕' : inc === 'Heritage Hotel' ? '🏰' : inc === 'Boat Ride' ? '⛵' : inc === 'Guide' ? '👤' : inc === 'Luxury Cabin' ? '🚂' : inc === 'All Meals' ? '🍽' : inc === 'Entry Fees' ? '🎫' : inc === 'All Transfers' ? '🚐' : '✓'}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, marginTop: 2 }}>{inc}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="btn-pri"
                  style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onClick={e => { e.stopPropagation(); pkg.bookingUrl ? window.open(pkg.bookingUrl, '_blank') : navigate(`/package/${pkg.id}`) }}
                >
                  {pkg.bookingUrl ? '🏛 Book on RTDC Official Portal ↗' : 'Book This Package →'}
                </button>
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
