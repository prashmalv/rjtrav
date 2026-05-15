import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function GrievanceSubmitted() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      {/* Success header */}
      <div style={{ background: 'linear-gradient(135deg,#10B981 0%,#059669 60%,var(--primary) 100%)', padding: '32px 20px 24px', textAlign: 'center', color: '#fff', flexShrink: 0 }}>
        <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, margin: '0 auto 12px', border: '3px solid rgba(255,255,255,0.4)' }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Grievance Filed!</div>
        <div style={{ fontSize: 12, opacity: 0.95, marginTop: 3 }}>Your voice matters · We're on it</div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Ticket */}
          <div style={{ background: 'var(--surface)', border: '2px dashed var(--primary)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase' }}>Grievance Ticket</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: 1.5, margin: '4px 0', fontFamily: 'monospace' }}>GRV-2026-04812</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              <span className="chip chip-warn">⚡ HIGH Priority</span>
              <span className="chip chip-primary">Auto-routed</span>
            </div>
          </div>

          {/* What's next */}
          <div className="surface" style={{ padding: 12 }}>
            <div className="bold" style={{ fontSize: 12, marginBottom: 8 }}>📍 What's next?</div>
            <div className="timeline" style={{ paddingLeft: 4 }}>
              {[
                { status: 'done', title: 'Filed & AI Categorized', time: 'Just now · 2:14 PM' },
                { status: 'active', title: 'Routing to DTO Pushkar', time: 'In progress · ETA 5 min' },
                { status: '', title: 'Officer Acknowledgement', time: 'Within 18h' },
                { status: '', title: 'Resolution', time: 'Est 4–7 days' },
              ].map((item, i) => (
                <div key={i} className={`tl-item ${item.status}`}>
                  <div className="tl-dot" />
                  <div className="tl-title">{item.title}</div>
                  <div className="tl-time">{item.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 5 }}>⏱ While you wait</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-soft)' }}>
                <span>📞</span> Helpline
                <strong style={{ color: 'var(--primary-dark)', marginLeft: 'auto' }}>1363</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-soft)', cursor: 'pointer' }} onClick={() => navigate('/ai-chat')}>
                <span>💬</span> Chat with Rajwada AI
                <strong style={{ color: 'var(--primary-dark)', marginLeft: 'auto' }}>→</strong>
              </div>
            </div>
          </div>

          <div className="grid-2">
            <button className="btn-sec" style={{ fontSize: 12 }}>📤 Share</button>
            <button className="btn-pri" style={{ fontSize: 12 }} onClick={() => navigate('/grievances')}>Track →</button>
          </div>

          <button className="btn-flat" style={{ textAlign: 'center', fontSize: 12 }} onClick={() => navigate('/home')}>← Back to Home</button>
          <div style={{ height: 8 }} />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
