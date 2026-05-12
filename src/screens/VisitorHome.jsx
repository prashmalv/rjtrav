import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import { destinations } from '../context/AppContext'

const HERO_IMGS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-Jaipur%2C_Hawa_Mahal.jpg/320px-24701-Jaipur%2C_Hawa_Mahal.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Amber_Fort-Jaipur.jpg/320px-Amber_Fort-Jaipur.jpg',
]

export default function VisitorHome() {
  const navigate = useNavigate()

  return (
    <div className="app-shell" style={{ background: 'var(--bg)' }}>
      <StatusBar />

      {/* Visitor Hero */}
      <div className="visitor-hero">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-Jaipur%2C_Hawa_Mahal.jpg/640px-24701-Jaipur%2C_Hawa_Mahal.jpg"
          alt="Hawa Mahal"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', opacity: 0.6, zIndex: 1 }} />
        <div className="visitor-hero-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', padding: '6px 10px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#fff' }}>
              🏰 RJ Tourism
            </div>
            <button
              onClick={() => navigate('/login')}
              style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#3D1F00', padding: '7px 16px', borderRadius: 14, fontSize: 12, fontWeight: 800 }}
            >
              Sign In →
            </button>
          </div>
          <span style={{ background: 'rgba(245,158,11,0.95)', color: '#3D1F00', fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, padding: '3px 8px', borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6 }}>⭐ #1 HERITAGE STATE</span>
          <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.05, textShadow: '0 2px 6px rgba(0,0,0,0.6)', marginBottom: 4 }}>Discover the Land of Kings</h2>
          <div style={{ fontSize: 11, opacity: 0.95, fontWeight: 600 }}>पधारो म्हारे देश · Browse without signing in</div>
        </div>
      </div>

      {/* Content */}
      <div className="screen-scroll">
        <div className="content">

          {/* Search */}
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search Hawa Mahal, packages, experiences..." readOnly onClick={() => navigate('/explore')} />
            <span>🎤</span>
          </div>

          {/* Guest Banner */}
          <div onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg,#10B981,#059669)', borderRadius: 12, padding: '11px 14px', color: '#fff', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{ fontSize: 22 }}>👋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Visiting as guest</div>
              <div style={{ fontSize: 10, opacity: 0.9 }}>Sign up to book, save trips & get AI guide</div>
            </div>
            <span style={{ fontSize: 16 }}>›</span>
          </div>

          {/* Categories */}
          <div className="sec-head"><h3>Featured Heritage</h3><span className="more" onClick={() => navigate('/explore')}>View all 42 →</span></div>
          <div className="cat-grid">
            {[['🏰', 'Forts'], ['🐅', 'Wildlife'], ['🐪', 'Desert'], ['🎭', 'Culture'], ['⛵', 'Lakes'], ['🕌', 'Temples'], ['🛍', 'Shopping'], ['🍽', 'Food']].map(([ico, nm]) => (
              <div key={nm} className="cat-tile" onClick={() => navigate('/explore')}>
                <div className="cat-ico">{ico}</div>
                <div className="cat-nm">{nm}</div>
              </div>
            ))}
          </div>

          {/* Featured destination */}
          <div className="hero-card tall" style={{ cursor: 'pointer' }} onClick={() => navigate('/destination/2')}>
            <img className="hero-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Amber_Fort-Jaipur.jpg/640px-Amber_Fort-Jaipur.jpg" alt="Amber Fort" onError={e => e.target.style.display = 'none'} />
            <div className="hero-overlay" />
            <span className="hero-pill">⭐ UNESCO</span>
            <div className="hero-name">Amber Fort & Palace</div>
            <div className="hero-sub"><span>📍 Jaipur</span><span>👥 8K visiting today</span></div>
          </div>

          {/* Destination list */}
          {destinations.slice(0, 4).map(d => (
            <div key={d.id} className="list-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/destination/${d.id}`)}>
              <div className="lc-thumb" style={{ fontSize: 26 }}>{d.img}</div>
              <div className="lc-info">
                <div className="lc-title">{d.name}</div>
                <div className="lc-sub"><span>📍 {d.city}</span><span>⭐ {d.rating}</span></div>
              </div>
              <div className="lc-price">{d.price}</div>
            </div>
          ))}

          {/* Sign-up CTA */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔓</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>Sign in to unlock more</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginBottom: 12, lineHeight: 1.5 }}>Book tickets · AI guide · Save trips · File grievances</div>
            <button className="btn-pri btn-sm" onClick={() => navigate('/signup')} style={{ width: '100%', display: 'block' }}>Sign In / Sign Up Free →</button>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
