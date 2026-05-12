import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'

export default function Payment() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('upi')
  const [paying, setPaying] = useState(false)

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => navigate('/booking-confirmed'), 2000)
  }

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="Secure Payment" back />

      <div className="screen-scroll">
        <div className="content">
          {/* Order summary */}
          <div style={{ background: 'var(--soft)', borderRadius: 12, padding: 12 }}>
            <div className="bold" style={{ fontSize: 12, marginBottom: 8 }}>Order Summary</div>
            {[
              ['Package · 3 pax', '₹1,15,497'],
              ['Camel Safari · 3 pax', '₹5,400'],
              ['Folk Dinner · 3 pax', '₹6,600'],
              ['Discount (RAJ-FEST26)', '−₹6,200', '#10B981'],
              ['GST (5%)', '₹6,065'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', color: color || 'var(--ink)' }}>
                <span style={{ color: color ? color : 'var(--ink-mute)' }}>{label}</span>
                <span className="bold">{val}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed var(--border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="bold" style={{ fontSize: 14 }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-dark)' }}>₹1,27,362</span>
            </div>
          </div>

          <div className="bold" style={{ fontSize: 13 }}>Payment Method</div>

          <div
            className={`payment-method${method === 'upi' ? ' selected' : ''}`}
            onClick={() => setMethod('upi')}
          >
            <div className="payment-method-radio" style={method === 'upi' ? { borderColor: 'var(--primary)' } : {}}>
              {method === 'upi' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
            </div>
            <div style={{ fontSize: 22 }}>📱</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>UPI · BHIM</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>vikram@axisbank</div>
            </div>
          </div>

          <div
            className={`payment-method${method === 'card' ? ' selected' : ''}`}
            onClick={() => setMethod('card')}
          >
            <div className="payment-method-radio" style={method === 'card' ? { borderColor: 'var(--primary)' } : {}}>
              {method === 'card' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
            </div>
            <div style={{ fontSize: 22 }}>💳</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Credit / Debit Card</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>Visa, Mastercard, RuPay</div>
            </div>
          </div>

          <div
            className={`payment-method${method === 'netbanking' ? ' selected' : ''}`}
            onClick={() => setMethod('netbanking')}
          >
            <div className="payment-method-radio" style={method === 'netbanking' ? { borderColor: 'var(--primary)' } : {}}>
              {method === 'netbanking' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
            </div>
            <div style={{ fontSize: 22 }}>🏦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Net Banking</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>SBI, HDFC, ICICI + more</div>
            </div>
          </div>

          <div className="safety-badge">🔒 256-bit SSL · PCI-DSS · DPDP 2023 compliant</div>

          <button className="btn-pri" onClick={handlePay} disabled={paying} style={{ opacity: paying ? 0.8 : 1 }}>
            {paying ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Processing...
              </span>
            ) : `🔒 Pay ₹1,27,362 via ${method === 'upi' ? 'UPI' : method === 'card' ? 'Card' : 'Net Banking'}`}
          </button>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
