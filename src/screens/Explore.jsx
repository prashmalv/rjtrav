import { useState, useEffect } from 'react'
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
  const [portalLive, setPortalLive] = useState(null)

  useEffect(() => {
    fetch('/api/official-data')
      .then(r => r.json())
      .then(d => setPortalLive(d.liveStatus === 'online'))
      .catch(() => setPortalLive(false))
  }, [])

  const filtered = cat === 'All' ? destinations : destinations.filter(d => d.category === cat)

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="Explore Rajasthan" back actions={[{ icon: '🔍', onClick: () => {} }]} />

      {/* Official Portal attribution banner */}
      <div
        style={{ background: '#F0FDF4', borderBottom: '1px solid #86EFAC', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, cursor: 'pointer' }}
        onClick={() => window.open('https://www.tourism.rajasthan.gov.in', '_blank')}
      >
        <span style={{ fontSize: 14 }}>🏛</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: '#14532D' }}>✓ Official Rajasthan Tourism Portal Data</span>
          <span style={{ fontSize: 9.5, color: '#166534', marginLeft: 6 }}>· tourism.rajasthan.gov.in</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: portalLive === null ? '#FCD34D' : portalLive ? '#16A34A' : '#EF4444', display: 'inline-block' }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: '#166534' }}>{portalLive === null ? '...' : portalLive ? 'Live' : 'Cached'}</span>
        </div>
        <span style={{ fontSize: 11, color: '#16A34A' }}>↗</span>
      </div>

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
                <div className="lc-thumb" style={{ overflow: 'hidden', padding: 0, flexShrink: 0, position: 'relative' }}>
                  <img src={d.imgUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display='none' }} />
                  {d.officialUrl && (
                    <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#16A34A', borderRadius: 4, padding: '2px 5px', fontSize: 8, fontWeight: 800, color: '#fff' }}>
                      ✓ Official
                    </div>
                  )}
                </div>
                <div className="lc-info">
                  <div className="lc-title">{d.name}</div>
                  <div className="lc-sub">
                    <span>📍 {d.city}</span>
                    <span>⭐ {d.rating}</span>
                    <span className="chip chip-neutral" style={{ fontSize: 9, padding: '1px 6px' }}>{d.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span className="text-xs muted">{d.badge}</span>
                    {d.officialUrl && (
                      <span
                        style={{ fontSize: 9, color: '#16A34A', fontWeight: 700, cursor: 'pointer' }}
                        onClick={e => { e.stopPropagation(); window.open(d.officialUrl, '_blank') }}
                      >
                        🔗 Govt. Portal ↗
                      </span>
                    )}
                  </div>
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
