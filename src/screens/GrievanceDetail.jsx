import { useParams, useNavigate } from 'react-router-dom'
import { grievances } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'

const STATUS_COLORS = { open: 'var(--primary)', in_progress: 'var(--accent-dark)', resolved: '#10B981' }
const PRIORITY_COLORS = { high: '#EF4444', medium: 'var(--accent-dark)', low: '#10B981' }

export default function GrievanceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const grv = grievances.find(g => g.id === id) || grievances[0]

  const timeline = [
    { status: 'done', title: 'Grievance Filed', time: `${grv.date}, 2:14 PM` },
    { status: 'done', title: 'AI Auto-Categorized', time: '96% confidence', note: `Category: ${grv.category} · Priority: ${grv.priority.toUpperCase()}` },
    ...(grv.status !== 'open' ? [{ status: 'done', title: `Routed to DTO ${grv.location}`, time: `Auto-assigned to ${grv.officer || 'Officer'}` }] : []),
    { status: grv.status === 'resolved' ? 'done' : 'active', title: grv.status === 'resolved' ? 'Resolved' : 'Under Investigation', time: grv.officer ? `Officer: Contacted BSP. Awaiting receipts.` : 'Pending assignment' },
    ...(grv.status !== 'resolved' ? [{ status: '', title: 'Resolution Proposal', time: 'Estimated in 3–5 days' }, { status: '', title: 'Closure & Feedback', time: 'Est 7 days' }] : []),
  ]

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title={grv.id} back actions={[{ icon: '⋮', onClick: () => {} }]} />

      <div className="screen-scroll">
        <div className="content">
          {/* Summary card */}
          <div style={{ background: 'linear-gradient(135deg,var(--accent-light),var(--soft))', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>{grv.title}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>📍 {grv.location} · Filed {grv.date}</div>
              </div>
              {grv.days && <span className="chip chip-warn">⏱ Day {grv.days} of 7</span>}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <span className="chip chip-danger">⚡ {grv.priority.toUpperCase()}</span>
              <span className="chip chip-primary">{grv.category}</span>
              {grv.rating && <span className="chip chip-success">⭐ {grv.rating}/5 Resolved</span>}
            </div>
          </div>

          {/* Timeline */}
          <div className="bold" style={{ fontSize: 13 }}>Status Timeline</div>
          <div className="timeline">
            {timeline.map((item, i) => (
              <div key={i} className={`tl-item ${item.status}`}>
                <div className="tl-dot" />
                <div className="tl-title">{item.title}</div>
                <div className="tl-time">{item.time}</div>
                {item.note && <div className="tl-note">{item.note}</div>}
              </div>
            ))}
          </div>

          {/* AI insights */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>📊 Similar cases</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              3 similar in {grv.location} this month. Avg resolution: <strong>4.8 days</strong>. Refund success: <strong style={{ color: '#10B981' }}>82%</strong>.
            </div>
          </div>

          {grv.comments && grv.comments.length > 0 && (
            <div className="surface" style={{ padding: 12 }}>
              <div className="bold" style={{ fontSize: 12, marginBottom: 8 }}>💬 Comments</div>
              {grv.comments.map((c, i) => (
                <div key={i} style={{ marginBottom: i < grv.comments.length - 1 ? 10 : 0, paddingBottom: i < grv.comments.length - 1 ? 10 : 0, borderBottom: i < grv.comments.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{c.who}</span>
                    <span style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{c.msg}</div>
                </div>
              ))}
            </div>
          )}

          <div className="grid-2">
            <button className="btn-sec" style={{ fontSize: 12 }}>💬 Add Comment</button>
            <button className="btn-pri" style={{ fontSize: 12 }}>📞 Call Officer</button>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
