import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'

const QUICK_DIAL = [
  { name: 'Tourist Helpline', number: '1363', icon: '🏛️', color: '#1E40AF', textColor: '#BFDBFE' },
  { name: 'Police', number: '100', icon: '👮', color: '#7F1D1D', textColor: '#FCA5A5' },
  { name: 'Ambulance', number: '108', icon: '🚑', color: '#065F46', textColor: '#A7F3D0' },
  { name: 'Women Helpline', number: '1091', icon: '👩‍⚕️', color: '#5B21B6', textColor: '#DDD6FE' },
]

const NEARBY = [
  { name: 'Jaipur Walled City Police Station', dist: '1.2 km', phone: '0141-2600700' },
  { name: 'Pushkar Tourist Police Post', dist: '0.4 km', phone: '0145-2772040' },
  { name: 'Udaipur Central Police Station', dist: '0.8 km', phone: '0294-2411000' },
]

export default function EmergencySOS() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(null)
  const [sosSent, setSosSent] = useState(false)
  const [sosId] = useState('SOS-' + (Math.floor(Math.random() * 90000) + 10000))

  useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) { setSosSent(true); setCountdown(null); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  if (sosSent) {
    return (
      <div className="app-shell" style={{ background: '#0F172A', color: '#E2E8F0' }}>
        <StatusBar light />
        <div style={{ background: 'linear-gradient(135deg,#7F1D1D,#991B1B)', padding: '22px 18px 26px', color: '#fff', flexShrink: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 50, marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite' }}>🚨</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>SOS Alert Sent!</div>
          <div style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>Help has been notified · Stay calm</div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '6px 18px', display: 'inline-block', marginTop: 10, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{sosId}</div>
        </div>
        <div className="screen-scroll" style={{ background: '#0F172A' }}>
          <div className="content" style={{ background: '#0F172A', color: '#E2E8F0' }}>
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#86EFAC', marginBottom: 10 }}>✓ Alert Sent To</div>
              {[
                { label: 'Tourist Police Control Room', status: '🟢 Dispatching unit to your location', icon: '👮' },
                { label: 'Your Emergency Contact', status: '🟢 SMS + Call sent', icon: '📞' },
                { label: 'District Collector Office', status: '🟡 Logged · Tracking active', icon: '🏛️' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid #334155' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8 }}>📍 Location Shared</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>GPS: 26.9124° N, 75.7873° E</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Near Hawa Mahal, Jaipur · Accuracy: ±8m</div>
              <div style={{ background: '#0F172A', borderRadius: 10, height: 90, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🗺️</div>
              <div style={{ textAlign: 'center', fontSize: 10, color: '#64748B', marginTop: 5 }}>Live location shared with responders</div>
            </div>
            <a href="tel:1363" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{ background: '#10B981', color: '#fff', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 800, width: '100%', cursor: 'pointer', border: 'none' }}>
                📞 Call Tourist Helpline · 1363
              </button>
            </a>
            <button onClick={() => { setSosSent(false); navigate('/home') }} style={{ background: '#1E293B', color: '#94A3B8', borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 700, width: '100%', cursor: 'pointer', border: '1px solid #334155' }}>
              ✓ I'm Safe Now — Cancel Alert
            </button>
            <div style={{ height: 8 }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell" style={{ background: '#0F172A', color: '#E2E8F0' }}>
      <StatusBar light />
      <div style={{ background: 'linear-gradient(135deg,#1E293B,#0F172A)', padding: '12px 16px', flexShrink: 0, borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ fontSize: 18, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate(-1)}>←</button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Emergency SOS</div>
            <div style={{ fontSize: 10.5, color: '#94A3B8' }}>Tourist Safety · Rajasthan Tourism Dept.</div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 9, background: '#10B981', color: '#fff', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>● ACTIVE</span>
        </div>
      </div>

      <div className="screen-scroll" style={{ background: '#0F172A' }}>
        <div className="content" style={{ background: '#0F172A', color: '#E2E8F0' }}>

          {/* Big SOS button */}
          <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
            {countdown !== null ? (
              <>
                <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 700, marginBottom: 12, letterSpacing: 0.5 }}>SENDING SOS ALERT IN...</div>
                <button
                  style={{ width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,#7F1D1D,#991B1B)', border: '5px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', animation: 'pulse 0.7s ease-in-out infinite', boxShadow: '0 0 40px rgba(239,68,68,0.6)', cursor: 'pointer' }}
                  onClick={() => setCountdown(null)}
                >
                  <div>
                    <div style={{ fontSize: 58, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{countdown}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>TAP TO CANCEL</div>
                  </div>
                </button>
                <div style={{ marginTop: 16, fontSize: 11, color: '#64748B' }}>Your location will be shared automatically</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>Tap for emergency help — 5 second countdown</div>
                <button
                  onClick={() => setCountdown(5)}
                  style={{ width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,#DC2626,#EF4444)', border: '5px solid rgba(252,165,165,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', cursor: 'pointer', boxShadow: '0 6px 28px rgba(239,68,68,0.45)', animation: 'fabPulse 2s ease-in-out infinite' }}
                >
                  <div style={{ fontSize: 38 }}>🆘</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: 1 }}>SOS</div>
                </button>
                <div style={{ marginTop: 14, fontSize: 11, color: '#475569', lineHeight: 1.6 }}>
                  GPS location shared automatically<br />Police + Tourist Helpline notified
                </div>
              </>
            )}
          </div>

          {/* Quick dial */}
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Quick Dial</div>
            <div className="grid-2">
              {QUICK_DIAL.map(c => (
                <a key={c.number} href={`tel:${c.number}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#0F172A', border: `1px solid ${c.color}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: 24 }}>{c.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#E2E8F0', marginTop: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: c.textColor, marginTop: 2 }}>{c.number}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Nearest stations */}
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>📍 Nearest Police Stations</div>
            {NEARBY.map(s => (
              <div key={s.name} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #334155' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👮</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>{s.name}</div>
                  <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 1 }}>📍 {s.dist}</div>
                </div>
                <a href={`tel:${s.phone}`} style={{ textDecoration: 'none' }}>
                  <button style={{ background: '#1E3A5F', color: '#BFDBFE', padding: '6px 10px', borderRadius: 8, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>📞 Call</button>
                </a>
              </div>
            ))}
          </div>

          {/* Safety tips */}
          <div style={{ background: 'linear-gradient(135deg,#1E2D1A,#1A2A14)', border: '1px solid #2D4A20', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#86EFAC', marginBottom: 8 }}>🛡️ Tourist Safety Tips</div>
            {[
              'Tourist Police (Blue Beret) patrol all major heritage sites',
              'Keep local emergency numbers saved offline on your phone',
              'Share your daily itinerary with a family member',
              'Carry a hotel address card in local language for taxi drivers',
              'Rajasthan Tourist Helpline 1363 is free · Available 24×7',
            ].map(tip => (
              <div key={tip} style={{ fontSize: 11.5, color: '#94A3B8', padding: '4px 0', lineHeight: 1.5 }}>• {tip}</div>
            ))}
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
