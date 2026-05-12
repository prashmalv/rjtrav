import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'

const TRIPS = [
  {
    id: 'RAJ-26-04812', name: 'Royal Rajasthan Trail', cities: 'Jaipur · Udaipur · Jaisalmer',
    nights: '7N', status: 'upcoming', days: 12, icon: '🏯',
    timeline: [
      { status: 'done', title: 'Booking Confirmed', time: 'Apr 18 · ✓ Paid ₹1.27L' },
      { status: 'active', title: 'Pre-trip prep', time: 'Vouchers ready · AI guide unlocked' },
      { status: '', title: 'Check-in · Heritage Haveli', time: 'Nov 15 · 2 PM' },
    ]
  },
  { id: 'RAJ-25-02341', name: 'Desert Safari Escape', cities: 'Jodhpur · Jaisalmer', nights: '3N', status: 'completed', days: -60, icon: '🐪', rating: 5 },
  { id: 'RAJ-25-01890', name: 'Lakes & Palaces Tour', cities: 'Udaipur · Pushkar', nights: '4N', status: 'completed', days: -90, icon: '⛵', rating: 4 },
]

const STATUS_COLOR = { upcoming: 'var(--accent)', completed: '#10B981', cancelled: '#EF4444' }

export default function MyTrips() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('upcoming')

  const filtered = TRIPS.filter(t => t.status === tab || (tab === 'all'))

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="My Trips" back actions={[{ icon: '⚙️', onClick: () => {} }]} />

      <div className="chip-scroll">
        {[['all', 'All (3)'], ['upcoming', 'Upcoming (1)'], ['completed', 'Completed (2)'], ['cancelled', 'Cancelled']].map(([val, lbl]) => (
          <span key={val} className={`chip ${tab === val ? 'chip-primary' : 'chip-neutral'}`} style={{ cursor: 'pointer' }} onClick={() => setTab(val)}>{lbl}</span>
        ))}
      </div>

      <div className="screen-scroll">
        <div className="content">
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-ico">🎫</div>
              <h3>No trips yet</h3>
              <p>Explore Rajasthan and book your first adventure!</p>
              <button className="btn-pri btn-sm" style={{ marginTop: 8 }} onClick={() => navigate('/packages')}>Explore Packages</button>
            </div>
          )}

          {filtered.map(trip => (
            <div key={trip.id} className="booking-card" style={{ cursor: 'pointer' }}>
              <div className="booking-card-img" style={{ background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, position: 'relative' }}>
                {trip.icon}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.55))', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                  <span className="chip" style={{ background: STATUS_COLOR[trip.status], color: trip.status === 'upcoming' ? '#3D1F00' : '#fff', fontSize: 9 }}>
                    {trip.status === 'upcoming' ? `⏱ in ${trip.days} days` : trip.status === 'completed' ? '✓ Completed' : 'Cancelled'}
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: 10, left: 10, color: '#fff', zIndex: 2 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{trip.name}</div>
                  <div style={{ fontSize: 10.5, opacity: 0.95 }}>{trip.cities} · {trip.nights}</div>
                </div>
              </div>

              <div className="booking-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 8 }}>
                  <span style={{ color: 'var(--ink-mute)' }}>Booking ID</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{trip.id}</span>
                </div>

                {trip.timeline && (
                  <div className="timeline" style={{ paddingLeft: 4 }}>
                    {trip.timeline.map((item, i) => (
                      <div key={i} className={`tl-item ${item.status}`}>
                        <div className="tl-dot" />
                        <div className="tl-title">{item.title}</div>
                        <div className="tl-time">{item.time}</div>
                      </div>
                    ))}
                  </div>
                )}

                {trip.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#F59E0B', marginBottom: 8, marginTop: 4 }}>
                    {'★'.repeat(trip.rating)}{'☆'.repeat(5 - trip.rating)}
                    <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 600 }}>{trip.rating}/5 · Your rating</span>
                  </div>
                )}

                <div className="grid-2" style={{ marginTop: 8 }}>
                  <button className="btn-flat" style={{ textAlign: 'center', fontSize: 11 }}>📄 Voucher</button>
                  {trip.status === 'upcoming'
                    ? <button className="btn-pri btn-sm" style={{ display: 'block', textAlign: 'center' }}>View Details</button>
                    : <button className="btn-sec btn-sm" style={{ display: 'block', textAlign: 'center' }}>Re-book</button>
                  }
                </div>
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
