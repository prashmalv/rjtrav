import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/visitor'), 2800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      style={{
        flex: 1,
        background: 'var(--grad-hero)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100%',
      }}
      onClick={() => navigate('/visitor')}
    >
      <div className="pattern-bg" />

      <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0 }}>
        <div style={{
          width: 100, height: 100, borderRadius: 26,
          background: 'linear-gradient(135deg,#F59E0B,#D97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, boxShadow: '0 14px 36px rgba(0,0,0,0.35)',
          marginBottom: 20, border: '3px solid rgba(255,255,255,0.2)',
        }}>🏰</div>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -0.5, marginBottom: 4 }}>
          Rajasthan Tourism
        </h1>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#F59E0B', marginBottom: 2, fontFamily: "'Noto Sans Devanagari', serif" }}>
          पधारो म्हारे देश
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', marginBottom: 32 }}>
          Land of Kings · Welcome to our Land
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <span key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: '#F59E0B',
              animation: `bounce 1.4s infinite ${delay}s`,
            }} />
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 40, fontSize: 10.5, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.7 }}>
          <strong>Government of Rajasthan</strong><br />
          Department of Tourism · v3.0<br />
          DPDP Act 2023 Compliant · MeitY Certified
        </div>
      </div>
    </div>
  )
}
