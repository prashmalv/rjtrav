import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import { destinations } from '../context/AppContext'

const CATS = ['All', 'Heritage', 'Wildlife', 'Desert', 'Lakes', 'Culture']

export default function Explore() {
  const navigate = useNavigate()
  const [cat, setCat] = useState('All')

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
          {filtered.map(d => (
            <div key={d.id} className="list-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/destination/${d.id}`)}>
              <div className="lc-thumb" style={{ fontSize: 28, background: 'var(--grad-hero)', borderRadius: 8 }}>
                {d.img}
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
          ))}
          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
