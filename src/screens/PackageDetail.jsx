import { useParams, useNavigate } from 'react-router-dom'
import { useApp, packages } from '../context/AppContext'
import AppBar from '../components/AppBar'

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const pkg = packages.find(p => p.id === parseInt(id)) || packages[0]

  return (
    <div className="app-shell">
      <div style={{ height: 200, position: 'relative', flexShrink: 0, overflow: 'hidden', background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70 }}>
        {pkg.img}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.4) 0%,transparent 40%,rgba(0,0,0,0.7))', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: 14, left: 14, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, zIndex: 3, cursor: 'pointer' }} onClick={() => navigate(-1)}>←</div>
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, color: '#fff', zIndex: 3 }}>
          <span className="chip chip-accent" style={{ marginBottom: 6, display: 'inline-block' }}>{pkg.badge} · {pkg.booked.toLocaleString()} booked</span>
          <div style={{ fontSize: 20, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{pkg.name}</div>
          <div style={{ fontSize: 11, opacity: 0.95 }}>{pkg.cities}</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{pkg.days} Days · {pkg.nights} Nights · From</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary-dark)' }}>₹{pkg.price.toLocaleString()}<span style={{ fontSize: 12, color: 'var(--ink-mute)', fontWeight: 600 }}>/person</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, color: 'var(--accent-dark)', fontWeight: 700 }}>⭐ {pkg.rating}</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>{pkg.reviews} reviews</div>
            </div>
          </div>

          {/* Includes */}
          <div className="grid-4">
            {pkg.includes.map(inc => (
              <div key={inc} style={{ padding: '8px 4px', background: 'var(--soft)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 16 }}>{inc.includes('Stay') ? '🏨' : inc.includes('Transport') ? '🚐' : inc.includes('Meal') || inc.includes('Break') ? '🍽' : inc.includes('Entry') || inc.includes('Ticket') ? '🎫' : inc.includes('Tent') ? '⛺' : inc.includes('Safari') ? '🐪' : inc.includes('Boat') ? '⛵' : '✓'}</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, marginTop: 2, color: 'var(--ink)' }}>{inc}</div>
              </div>
            ))}
          </div>

          {/* Itinerary */}
          <div>
            <div className="bold" style={{ fontSize: 13, marginBottom: 8 }}>Itinerary</div>
            <div className="timeline">
              {pkg.itinerary.map((item, i) => (
                <div key={i} className={`tl-item ${i < pkg.itinerary.length - 1 ? 'done' : 'active'}`}>
                  <div className="tl-dot" />
                  <div className="tl-title">{item.day} — {item.title}</div>
                  <div className="tl-time">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI tip */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 3 }}>💡 Best time to book</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.55 }}>Book at least 30 days in advance for best prices. Festival season (Oct–Mar) fills up fast!</div>
          </div>

          <button className="btn-pri" onClick={() => navigate('/payment')}>Book This Package →</button>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
