import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'
import { destinations, useApp } from '../context/AppContext'
import { useT } from '../i18n'

const AMBER_FORT = 'https://media-cdn.tripadvisor.com/media/photo-s/17/d3/a8/57/images-30-largejpg.jpg'

export default function VisitorHome() {
  const navigate = useNavigate()
  const { appLanguage } = useApp()
  const t = useT(appLanguage)

  const cats = [
    ['🏰', t.forts, '/explore?cat=Heritage'],
    ['🐅', t.wildlife, '/explore?cat=Wildlife'],
    ['🐪', t.desert, '/explore?cat=Desert'],
    ['⛵', t.lakes, '/explore?cat=Lakes'],
    ['🕌', t.temples, '/explore'],
    ['🛍', t.shopping, '/explore'],
    ['🍽', t.food, '/explore'],
    ['📦', t.packages, '/packages'],
  ]

  return (
    <div className="app-shell" style={{ background: 'var(--bg)' }}>
      <StatusBar />

      {/* Visitor Hero */}
      <div className="visitor-hero">
        <img
          src="/banner1.jpeg"
          alt="Rajasthan"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 1 }}
        />
        <div className="visitor-hero-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', padding: '6px 10px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#fff' }}>
              🏰 RJ Tourism
            </div>
            <LanguageSelector light />
          </div>
          <span style={{ background: 'rgba(245,158,11,0.95)', color: '#3D1F00', fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, padding: '3px 8px', borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6 }}>⭐ #1 HERITAGE STATE</span>
          <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.05, textShadow: '0 2px 6px rgba(0,0,0,0.6)', marginBottom: 4 }}>Discover the Land of Maharajas</h2>
          <div style={{ fontSize: 11, opacity: 0.95, fontWeight: 600 }}>पधारो म्हारे देश · Browse without signing in</div>
        </div>
      </div>

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
              <div style={{ fontSize: 12, fontWeight: 800 }}>{t.visitingAsGuest}</div>
              <div style={{ fontSize: 10, opacity: 0.9 }}>{t.signUpSubtext}</div>
            </div>
            <span style={{ fontSize: 16 }}>›</span>
          </div>

          {/* Categories */}
          <div className="sec-head">
            <h3>{t.exploreByCategory}</h3>
            <span className="more" onClick={() => navigate('/explore')}>{t.viewAll}</span>
          </div>
          <div className="cat-grid">
            {cats.map(([ico, nm, path]) => (
              <div key={nm} className="cat-tile" onClick={() => navigate(path)}>
                <div className="cat-ico">{ico}</div>
                <div className="cat-nm">{nm}</div>
              </div>
            ))}
          </div>

          {/* Featured destination */}
          <div className="hero-card tall" style={{ cursor: 'pointer' }} onClick={() => navigate('/destination/2')}>
            <img className="hero-img" src={AMBER_FORT} alt="Amber Fort" />
            <div className="hero-overlay" />
            <span className="hero-pill">⭐ UNESCO</span>
            <div className="hero-name">Amber Fort & Palace</div>
            <div className="hero-sub"><span>📍 Jaipur</span><span>👥 8K visiting today</span></div>
          </div>

          {/* Destination list */}
          {destinations.slice(0, 4).map(d => (
            <div key={d.id} className="list-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/destination/${d.id}`)}>
              <div className="lc-thumb" style={{ overflow: 'hidden', padding: 0, flexShrink: 0 }}>
                <img src={d.imgUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.cssText = 'display:flex;align-items:center;justify-content:center;font-size:26px' }} />
              </div>
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
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>{t.signInUnlock}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginBottom: 12, lineHeight: 1.5 }}>{t.signInSubtext}</div>
            <button className="btn-pri btn-sm" onClick={() => navigate('/signup')} style={{ width: '100%', display: 'block' }}>{t.signInBtn}</button>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
