import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OfficerLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => navigate('/officer-dashboard'), 1500)
  }

  return (
    <div className="app-shell" style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='0.8'><path d='M30 0 L60 30 L30 60 L0 30 Z'/><circle cx='30' cy='30' r='12'/></g></svg>\")", backgroundSize: '60px', opacity: 0.3 }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 24px', gap: 0, position: 'relative', zIndex: 2 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: '0 6px 20px rgba(245,158,11,0.4)', border: '3px solid rgba(255,255,255,0.2)', marginBottom: 20 }}>🛡️</div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 4 }}>Officer Portal</h1>
        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 30, textAlign: 'center' }}>Department of Tourism · Govt. of Rajasthan</div>

        <div style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Officer ID / SSOID</label>
            <div style={{ background: '#0F172A', border: '1.5px solid #334155', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>👤</span>
              <input style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#E2E8F0', fontWeight: 600 }} placeholder="officer@rajasthan.gov.in" defaultValue="officer.anita@rajasthan.gov.in" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
            <div style={{ background: '#0F172A', border: '1.5px solid #334155', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>🔑</span>
              <input type="password" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#E2E8F0', fontWeight: 600 }} placeholder="••••••••" defaultValue="securepass" />
            </div>
          </div>

          <button
            onClick={handleLogin}
            style={{ background: 'linear-gradient(135deg,#1E40AF,#0D1B5C)', color: '#fff', padding: '12px 0', borderRadius: 10, fontWeight: 700, fontSize: 14, textAlign: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,64,175,0.4)' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Authenticating...
              </span>
            ) : '🔐 Secure Login'}
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>🔒 MeitY certified · AES-256 encryption · 2FA enabled</div>
          <span style={{ fontSize: 11, color: '#94A3B8', cursor: 'pointer' }} onClick={() => navigate('/visitor')}>← Back to Tourist Portal</span>
        </div>
      </div>
    </div>
  )
}
