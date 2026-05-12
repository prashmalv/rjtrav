import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import { grievances } from '../context/AppContext'

const STATUS_MAP = {
  open: { label: 'Open', cls: 'chip-primary' },
  in_progress: { label: 'In Progress', cls: 'chip-warn' },
  resolved: { label: '✓ Resolved', cls: 'chip-success' },
}
const PRIORITY_COLOR = { high: '#EF4444', medium: 'var(--accent-dark)', low: '#10B981' }

export default function Grievances() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')

  const filtered = tab === 'all' ? grievances : grievances.filter(g => g.status === tab)

  return (
    <div className="app-shell">
      <StatusBar light />
      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '12px 16px 16px', color: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button style={{ fontSize: 20, color: '#fff', background: 'none' }} onClick={() => navigate(-1)}>←</button>
          <span className="chip chip-white" style={{ fontSize: 9 }}>⚡ AI POWERED</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>My Grievances</div>
        <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>Tourist Helpline · 1363 · 24×7 support</div>
      </div>

      <div className="chip-scroll">
        {[['all', `All (${grievances.length})`], ['open', 'Open (1)'], ['in_progress', 'In Progress (1)'], ['resolved', 'Resolved (1)']].map(([val, lbl]) => (
          <span key={val} className={`chip ${tab === val ? 'chip-primary' : 'chip-neutral'}`} style={{ cursor: 'pointer' }} onClick={() => setTab(val)}>{lbl}</span>
        ))}
      </div>

      <div className="screen-scroll">
        <div className="content">
          {filtered.map(g => (
            <div key={g.id} className="list-card" style={{ cursor: 'pointer', borderLeft: `4px solid ${PRIORITY_COLOR[g.priority]}` }} onClick={() => navigate(`/grievance/${g.id}`)}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{g.icon}</div>
              <div className="lc-info">
                <div className="lc-title">{g.title}</div>
                <div className="lc-sub"><span>📍 {g.location}</span><span className={`chip ${STATUS_MAP[g.status].cls}`} style={{ fontSize: 9 }}>{STATUS_MAP[g.status].label}</span></div>
                <div className="text-xs muted" style={{ marginTop: 2 }}>{g.id} · {g.date} · <span style={{ color: PRIORITY_COLOR[g.priority], fontWeight: 700 }}>⚡ {g.priority.toUpperCase()}</span></div>
              </div>
              <div className="lc-arrow">›</div>
            </div>
          ))}

          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>🛡 We've got you covered</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 4 }}>
              All grievances auto-routed to right officer using AI. Avg resolution: <strong style={{ color: 'var(--accent-dark)' }}>5.2 days</strong>. Satisfaction: <strong style={{ color: '#10B981' }}>87%</strong>.
            </div>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>

      {/* FAB */}
      <div className="action-fab" onClick={() => navigate('/file-grievance')}>+</div>
      <BottomNav />
    </div>
  )
}
