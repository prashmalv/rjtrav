import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'
import { destinations, useApp } from '../context/AppContext'
import { useT } from '../i18n'

const HERO_CITIES = [
  { name: 'Jaipur', tagline: 'The Pink City', emoji: '🌸', visitors: '8,247', color: '#BE185D', img: 'https://3.bp.blogspot.com/-gyrh_RuCV2E/U1YDxp9I4EI/AAAAAAAAE-g/E8JjPonHeco/s1600/Hawa-Mahal-Palace-Jaipur-Monuments-Of-India.jpg' },
  { name: 'Udaipur', tagline: 'City of Lakes', emoji: '⛵', visitors: '6,831', color: '#1D4ED8', img: 'https://plus.unsplash.com/premium_photo-1697729789803-48b0c82365ff?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2l0eSUyMHBhbGFjZSUyMHVkYWlwdXIlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D' },
  { name: 'Jodhpur', tagline: 'The Blue City', emoji: '💙', visitors: '4,156', color: '#4338CA', img: 'https://s7ap1.scene7.com/is/image/incredibleindia/mehrangarh-fort-jodhpur-rajasthan-hero?qlt=82&ts=1726660826646' },
  { name: 'Jaisalmer', tagline: 'The Golden City', emoji: '🌟', visitors: '3,240', color: '#B45309', img: 'https://t3.ftcdn.net/jpg/18/64/90/28/360_F_1864902844_6YAGMiY2NH5DrVTtDMk2BnMUL6CyOJoW.jpg' },
  { name: 'Pushkar', tagline: 'Sacred Land of Brahma', emoji: '🕍', visitors: '2,890', color: '#7C3AED', img: 'https://images.unsplash.com/photo-1519922639192-e73293ca430e?auto=format&fit=crop&w=600&q=82' },
]

const CITY_GRID = [
  { name: 'Jaipur', tagline: 'The Pink City', emoji: '🌸', bg: '#FDF2F8', color: '#BE185D', img: 'https://3.bp.blogspot.com/-gyrh_RuCV2E/U1YDxp9I4EI/AAAAAAAAE-g/E8JjPonHeco/s1600/Hawa-Mahal-Palace-Jaipur-Monuments-Of-India.jpg', dest: 1 },
  { name: 'Udaipur', tagline: 'City of Lakes', emoji: '⛵', bg: '#EFF6FF', color: '#1D4ED8', img: 'https://plus.unsplash.com/premium_photo-1697729789803-48b0c82365ff?fm=jpg&q=60&w=800', dest: 4 },
  { name: 'Jodhpur', tagline: 'The Blue City', emoji: '💙', bg: '#EEF2FF', color: '#4338CA', img: 'https://s7ap1.scene7.com/is/image/incredibleindia/mehrangarh-fort-jodhpur-rajasthan-hero?qlt=82&ts=1726660826646', dest: 3 },
  { name: 'Jaisalmer', tagline: 'The Golden City', emoji: '🌟', bg: '#FFFBEB', color: '#B45309', img: 'https://t3.ftcdn.net/jpg/18/64/90/28/360_F_1864902844_6YAGMiY2NH5DrVTtDMk2BnMUL6CyOJoW.jpg', dest: 5 },
  { name: 'Ranthambore', tagline: 'Land of Royal Tigers', emoji: '🐅', bg: '#ECFDF5', color: '#059669', img: 'https://thumbs.dreamstime.com/b/ranthambore-national-park-rajasthan-india-august-wild-royal-bengal-tiger-open-monsoon-season-wildlife-lovers-229783456.jpg', dest: 6 },
  { name: 'Pushkar', tagline: 'Sacred Land of Brahma', emoji: '🕍', bg: '#F5F3FF', color: '#7C3AED', img: 'https://images.unsplash.com/photo-1519922639192-e73293ca430e?auto=format&fit=crop&w=600&q=82', dest: null },
]


export default function VisitorHome() {
  const navigate = useNavigate()
  const { appLanguage } = useApp()
  const t = useT(appLanguage)
  const [heroIdx, setHeroIdx] = useState(0)
  const [aiInput, setAiInput] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const [cityWeather, setCityWeather] = useState({})
  const inputRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % HERO_CITIES.length)
        setTransitioning(false)
      }, 300)
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.json())
      .then(d => {
        const map = {}
        d.cities?.forEach(c => { map[c.name] = c })
        setCityWeather(map)
      })
      .catch(() => {})
  }, [])

  const city = HERO_CITIES[heroIdx]

  const handleAsk = (q) => {
    const query = (q || aiInput).trim()
    // Guests go to login first; logged-in users go straight to chat
    navigate('/login', { state: { aiRedirect: true, initialMsg: query || undefined } })
  }

  return (
    <div className="app-shell" style={{ background: 'var(--bg)' }}>
      <StatusBar light />

      {/* ── HERO CAROUSEL ── */}
      <div style={{ height: 260, position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        {/* Background image */}
        <img
          key={city.name}
          src={city.img}
          alt={city.name}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.35s ease',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
        {/* Dark gradient for readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)' }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 10px', borderRadius: 14 }}>
            <span style={{ fontSize: 14 }}>🏰</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 0.3 }}>RAJASTHAN TOURISM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LanguageSelector light />
          </div>
        </div>

        {/* City info */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 3,
          opacity: transitioning ? 0 : 1, transition: 'opacity 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '3px 8px', borderRadius: 8, letterSpacing: 0.5 }}>
              👥 {city.visitors} visiting today
            </span>
            <span style={{ background: city.color, color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '3px 8px', borderRadius: 8, letterSpacing: 0.3 }}>
              LIVE
            </span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -0.5, textShadow: '0 2px 12px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>
            {city.emoji} {city.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              {city.tagline}
            </div>
            {cityWeather[city.name] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 8px' }}>
                <span style={{ fontSize: 13 }}>{cityWeather[city.name].emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{cityWeather[city.name].temp}°C</span>
                <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{cityWeather[city.name].condition}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ position: 'absolute', bottom: 10, right: 16, display: 'flex', gap: 5, zIndex: 4 }}>
          {HERO_CITIES.map((_, i) => (
            <div
              key={i}
              onClick={() => setHeroIdx(i)}
              style={{ width: i === heroIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === heroIdx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }}
            />
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="screen-scroll">
        <div className="content" style={{ paddingTop: 12 }}>

          {/* ── AI CHAT BAR ── */}
          <div style={{ background: 'linear-gradient(135deg, #7C3AED0A, #BE185D0A)', border: '1.5px solid var(--primary)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 24px rgba(124,58,237,0.12)' }}>

            {/* Bot header */}
            <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, position: 'relative' }}>
                🤖
                <span style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, background: '#10B981', border: '2px solid #fff', borderRadius: '50%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--primary-dark)' }}>Rajwada AI — आपका राजस्थान गाइड</div>
                <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>Multilingual · Personalised · Available 24×7</div>
              </div>
            </div>

            {/* Main invite */}
            <div style={{ margin: '0 14px', background: '#fff', border: '1px solid var(--primary-ghost)', borderRadius: 12, padding: '11px 13px' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--primary-dark)', marginBottom: 4 }}>
                🙏 पधारो म्हारे देश
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                Ask me anything about Rajasthan — trip plans, best forts, local food, wildlife safaris, travel tips, weather advisories — all in one place, in your language.
              </div>
            </div>

            {/* Sign-in benefits */}
            <div style={{ margin: '10px 14px 0', background: 'linear-gradient(135deg,#FDF4FF,#FFF7ED)', border: '1px solid #E9D5FF', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: '#6D28D9', marginBottom: 7 }}>📲 Sign in to unlock more:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  ['🗺', 'Personalised itinerary based on your travel style, city & interests'],
                  ['🌡️', 'Health & weather advisories — avoid heat-risk zones in real-time'],
                  ['🆘', 'SOS Emergency Button — instant help at any heritage site'],
                  ['📢', 'Grievance filing → goes directly to Govt. tourism officers'],
                ].map(([ico, txt]) => (
                  <div key={txt} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{ico}</span>
                    <span style={{ fontSize: 10.5, color: '#4C1D95', lineHeight: 1.5 }}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA button */}
            <div style={{ padding: '12px 14px 14px' }}>
              <button
                onClick={() => handleAsk()}
                style={{ width: '100%', background: 'var(--grad-hero)', border: 'none', borderRadius: 14, padding: '13px 0', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 3px 12px rgba(124,58,237,0.4)', letterSpacing: 0.2 }}
              >
                <span>🚀</span>
                <span>Start My Personalised Journey</span>
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            </div>
          </div>

          {/* ── STATS BAR ── */}
          <div style={{ background: 'linear-gradient(135deg, var(--primary-darker), #7C3AED)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 0 }}>
              {[['7', 'UNESCO Sites'], ['200+', 'Forts & Palaces'], ['50M+', 'Yearly Visitors'], ['33', 'Districts']].map(([val, label], i, arr) => (
                <div key={label} style={{ flex: 1, textAlign: 'center', padding: '10px 4px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: -0.3 }}>{val}</div>
                  <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginTop: 1 }}>{label}</div>
                </div>
              ))}
            </div>
            <div
              style={{ borderTop: '1px solid rgba(255,255,255,0.15)', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}
              onClick={() => window.open('https://www.tourism.rajasthan.gov.in', '_blank')}
            >
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>🏛 Data source: Official Rajasthan Tourism Portal · tourism.rajasthan.gov.in</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>↗</span>
            </div>
          </div>

          {/* ── CITY GRID WITH TAGLINES ── */}
          <div>
            <div className="sec-head" style={{ marginBottom: 10 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800 }}>Explore Royal Cities</h3>
              <span className="more" onClick={() => navigate('/explore')}>{t.viewAll}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {CITY_GRID.map(c => (
                <div
                  key={c.name}
                  onClick={() => c.dest ? navigate(`/destination/${c.dest}`) : navigate('/explore')}
                  style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', position: 'relative', height: 120, background: c.bg, border: `1.5px solid ${c.color}22`, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
                >
                  <img src={c.img} alt={c.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, zIndex: 2 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{c.emoji} {c.name}</div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginTop: 1 }}>{c.tagline}</div>
                  </div>
                  <div style={{ position: 'absolute', top: 8, right: 8, background: c.color, borderRadius: 6, padding: '2px 6px', fontSize: 8, fontWeight: 800, color: '#fff', zIndex: 2 }}>
                    EXPLORE
                  </div>
                  {cityWeather[c.name] && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(6px)', borderRadius: 6, padding: '2px 6px', fontSize: 9, fontWeight: 700, color: '#fff', zIndex: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span>{cityWeather[c.name].emoji}</span>
                      <span>{cityWeather[c.name].temp}°C</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── GUEST CTA ── */}
          <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '1.5px solid #86EFAC', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 30 }}>🔓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#14532D', marginBottom: 2 }}>{t.signInUnlock}</div>
                <div style={{ fontSize: 10.5, color: '#166534', lineHeight: 1.4 }}>Book tickets · Save trips · AI guide · File grievances</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
              <button className="btn-sec" style={{ fontSize: 11.5, padding: '8px 0' }} onClick={() => navigate('/login')}>
                📱 Mobile / Email
              </button>
              <button className="btn-pri" style={{ fontSize: 11.5, padding: '8px 0' }} onClick={() => navigate('/signup')}>
                ✨ Sign Up Free
              </button>
            </div>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
