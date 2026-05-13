import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BG = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=85'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/visitor'), 3200)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      onClick={() => navigate('/visitor')}
      style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '100%', background: '#B8720A', cursor: 'pointer' }}
    >
      {/* Background photo */}
      <img
        src={BG}
        alt="Rajasthan"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', zIndex: 1 }}
      />

      {/* Warm gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(80,35,5,0.45) 0%,rgba(160,85,10,0.15) 30%,rgba(160,85,10,0.2) 55%,rgba(140,70,5,0.82) 100%)', zIndex: 2 }} />

      {/* Top arch decoration */}
      <svg viewBox="0 0 420 100" width="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }} preserveAspectRatio="none">
        <path d="M0,0 L0,70 Q60,20 120,55 Q175,80 210,45 Q245,15 300,55 Q360,85 420,65 L420,0 Z" fill="rgba(160,90,15,0.55)" />
        <path d="M0,0 L0,45 Q60,5 120,32 Q175,52 210,22 Q245,0 300,32 Q360,58 420,40 L420,0 Z" fill="rgba(210,140,35,0.35)" />
        {/* Keystone gem */}
        <ellipse cx="210" cy="22" rx="6" ry="5" fill="rgba(245,185,50,0.75)" />
        <ellipse cx="210" cy="22" rx="3" ry="2.5" fill="rgba(255,215,90,0.9)" />
        {/* Side flourishes */}
        <circle cx="60" cy="50" r="3" fill="rgba(245,185,50,0.5)" />
        <circle cx="360" cy="50" r="3" fill="rgba(245,185,50,0.5)" />
        <circle cx="120" cy="35" r="2" fill="rgba(245,185,50,0.4)" />
        <circle cx="300" cy="35" r="2" fill="rgba(245,185,50,0.4)" />
      </svg>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: '80px 24px 100px', textAlign: 'center' }}>

        {/* App icon */}
        <div style={{
          width: 88, height: 88, borderRadius: 22,
          background: 'linear-gradient(135deg,#F59E0B,#D97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, marginBottom: 18,
          boxShadow: '0 12px 36px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,255,255,0.25)',
          border: '2px solid rgba(255,255,255,0.3)',
        }}>🏰</div>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: -0.5, marginBottom: 6, textShadow: '0 3px 12px rgba(0,0,0,0.55)', lineHeight: 1.1 }}>
          Rajasthan Tourism
        </h1>

        <div style={{ fontSize: 26, fontWeight: 700, color: '#F9C740', marginBottom: 4, fontFamily: "'Noto Sans Devanagari', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          पधारो म्हारे देश
        </div>

        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.88)', fontStyle: 'italic', letterSpacing: 0.8, marginBottom: 36 }}>
          Land of Kings · Welcome to our Land
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 0.22, 0.44].map((delay, i) => (
            <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: '#F59E0B', animation: `bounce 1.4s infinite ${delay}s`, boxShadow: '0 2px 6px rgba(0,0,0,0.3)', display: 'block' }} />
          ))}
        </div>
      </div>

      {/* Bottom sand-dune waves */}
      <svg viewBox="0 0 420 90" width="100%" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 4 }} preserveAspectRatio="none">
        <path d="M0,45 Q55,15 110,40 Q165,65 220,35 Q275,8 330,38 Q375,60 420,42 L420,90 L0,90 Z" fill="rgba(185,115,20,0.72)" />
        <path d="M0,58 Q70,32 140,55 Q210,76 280,50 Q340,28 420,56 L420,90 L0,90 Z" fill="rgba(210,140,30,0.65)" />
        <path d="M0,70 Q90,54 180,67 Q270,80 360,63 Q395,55 420,70 L420,90 L0,90 Z" fill="rgba(235,165,40,0.55)" />
      </svg>

      {/* Govt branding */}
      <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, zIndex: 6, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, letterSpacing: 0.3 }}>
          <strong>Government of Rajasthan</strong> · Department of Tourism<br />
          DPDP Act 2023 Compliant · MeitY Certified · v3.0
        </div>
      </div>
    </div>
  )
}
