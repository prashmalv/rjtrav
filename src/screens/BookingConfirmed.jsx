import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function BookingConfirmed() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      {/* Success header */}
      <div style={{ background: 'linear-gradient(135deg,#10B981,#059669)', padding: '32px 20px 24px', textAlign: 'center', color: '#fff', flexShrink: 0 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 10px', border: '3px solid rgba(255,255,255,0.4)' }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Booking Confirmed!</div>
        <div style={{ fontSize: 12, opacity: 0.95, marginTop: 3 }}>Get ready for an unforgettable Rajasthan trip</div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Ticket */}
          <div style={{ background: 'var(--surface)', border: '2px dashed var(--primary)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase' }}>Booking ID</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: 1.5, margin: '4px 0', fontFamily: 'monospace' }}>RAJ-26-04812</div>
            <div className="qr-code" style={{ margin: '12px auto 8px' }} />
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>Scan at hotels & venues</div>
          </div>

          {/* Trip details */}
          <div className="surface" style={{ padding: 12 }}>
            <div className="bold" style={{ fontSize: 12, marginBottom: 8 }}>Trip Details</div>
            {[
              ['Package', 'Royal Rajasthan Trail'],
              ['Travelers', '2 Adults · 1 Child'],
              ['Check-in', '15 Nov 2026'],
              ['Hotel', 'Heritage Haveli, Jaipur'],
              ['Amount Paid', '₹1,27,362'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '3px 0' }}>
                <span style={{ color: 'var(--ink-mute)' }}>{label}</span>
                <span className="bold">{val}</span>
              </div>
            ))}
          </div>

          {/* What's next */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>📋 What's next?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                '✓ Confirmation sent to your email',
                '✓ Vouchers in "My Trips" tab',
                '✓ AI guide unlocked for destinations',
                '✓ 24×7 helpline: 1363',
              ].map(line => (
                <div key={line} style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{line}</div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <button className="btn-sec" style={{ fontSize: 12 }}>📄 Download Voucher</button>
            <button className="btn-pri" style={{ fontSize: 12 }} onClick={() => navigate('/my-trips')}>View My Trip →</button>
          </div>

          <button className="btn-flat" style={{ textAlign: 'center', fontSize: 12 }} onClick={() => navigate('/home')}>
            ← Back to Home
          </button>
          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
