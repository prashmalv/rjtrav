import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import { destinations } from '../context/AppContext'

const CATS = ['All', 'Heritage', 'Wildlife', 'Desert', 'Lakes']

export default function Explore() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialCat = CATS.includes(searchParams.get('cat')) ? searchParams.get('cat') : 'All'
  const [cat, setCat] = useState(initialCat)

  const filtered = cat === 'All' ? destinations : destinations.filter(d => d.category === cat)

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="Explore Rajasthan" back actions={[{ icon: '🔍', onClick: () => {} }]} />

      <div className="chip-scroll">
        {CATS.map(c => (
          <span key={c} className={`chip ${cat === c ? 'chip-primary' : 'chip-neutral'}`} onClick={() => setCat(c)} style={{ cursor: 'pointer' }}>
            {c}
          </span>
        ))}
      </div>

      <div className="screen-scroll">
        <div className="content">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-mute)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>No destinations found</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Try selecting a different category</div>
            </div>
          ) : (
            filtered.map(d => (
              <div key={d.id} className="list-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/destination/${d.id}`)}>
                <div className="lc-thumb" style={{ overflow: 'hidden', padding: 0, flexShrink: 0 }}>
                  <img src={d.imgUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display='none' }} />
                </div>
                <div className="lc-info">
                  <div className="lc-title">{d.name}</div>
                  <div className="lc-sub">
                    <span>📍 {d.city}</span>
                    <span>⭐ {d.rating}</span>
                    <span className="chip chip-neutral" style={{ fontSize: 9, padding: '1px 6px' }}>{d.category}</span>
                  </div>
                  <div className="text-xs muted" style={{ marginTop: 2 }}>{d.badge}</div>
                </div>
                <div className="lc-arrow">›</div>
              </div>
            ))
          )}
          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
