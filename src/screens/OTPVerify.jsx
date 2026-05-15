import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'

export default function OTPVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useApp()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [verified, setVerified] = useState(false)

  const isAiRedirect = location.state?.aiRedirect === true

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(t => t - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [timer])

  const handleDigit = (idx, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus()
  }

  const handleVerify = () => {
    login()
    setVerified(true)
    setTimeout(() => {
      if (isAiRedirect) {
        navigate('/ai-chat', { replace: true })
      } else {
        navigate('/profile-setup', { replace: true })
      }
    }, 1200)
  }

  const demoFill = () => {
    setOtp(['8', '2', '4', '5', '6', '1'])
  }

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="Verify OTP" back />

      <div className="screen-scroll">
        <div className="content">
          <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
            <div style={{ fontSize: 38, marginBottom: 8 }}>📱</div>
            {verified ? (
              <>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>✓ Verified!</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>{isAiRedirect ? '🤖 Starting Rajwada AI for you...' : 'Setting up your profile...'}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>OTP Sent!</div>
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>6-digit code sent to <strong style={{ color: 'var(--ink)' }}>+91 98290•••345</strong></div>
                <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/login')}>Change number</span>
              </>
            )}
          </div>

          {!verified && (
            <>
              <div className="otp-grid">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="tel"
                    maxLength={1}
                    value={d}
                    onChange={e => handleDigit(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus()
                    }}
                    className={`otp-cell${!d ? ' empty' : ''}`}
                    style={{ outline: 'none', width: 44, height: 52, border: '2px solid', borderColor: d ? 'var(--primary)' : 'var(--border)', borderRadius: 10, textAlign: 'center', fontSize: 22, fontWeight: 800, color: 'var(--primary-dark)', background: d ? 'var(--primary-ghost)' : 'var(--surface)', cursor: 'text' }}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-mute)', marginTop: -4 }}>
                {timer > 0 ? `Resend OTP in ${timer}s` : (
                  <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setTimer(30)}>Resend OTP</span>
                )}
              </div>

              <div className="safety-badge">
                🔒 OTP auto-detection enabled · Expires in 10 minutes
              </div>

              <button className="btn-flat" style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-mute)' }} onClick={demoFill}>
                Demo: Fill OTP automatically
              </button>

              <button
                className="btn-pri"
                onClick={handleVerify}
                style={{ opacity: otp.every(d => d) ? 1 : 0.6 }}
              >
                Verify & Continue →
              </button>
            </>
          )}

          {verified && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #10B981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            </div>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
