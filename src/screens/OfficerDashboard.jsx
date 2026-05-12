import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const METRICS = [
  { label: 'Active Grievances', value: '23', delta: '+3 today', color: '#EF4444' },
  { label: 'Resolved This Week', value: '47', delta: '↑ 12%', color: '#10B981' },
  { label: 'BSP Inspections', value: '12', delta: '3 pending', color: '#F59E0B' },
  { label: 'Avg Resolution', value: '5.2d', delta: '-0.8d vs target', color: '#3B82F6' },
]

const GRIEVANCES = [
  { id: 'GRV-2026-04812', title: 'Overcharging at Camel Safari', location: 'Pushkar', priority: 'high', hours: 18, tourist: 'Vikram Singh', category: 'Overcharging' },
  { id: 'GRV-2026-04801', title: 'Unsafe road near Amber Fort', location: 'Jaipur', priority: 'high', hours: 6, tourist: 'Priya Sharma', category: 'Infrastructure' },
  { id: 'GRV-2026-04798', title: 'Guide gave wrong historical info', location: 'Udaipur', priority: 'medium', hours: 36, tourist: 'John Adams', category: 'BSP / Operator' },
]

const BSP = [
  { id: 'BSP-4521', name: 'Desert Rose Camel Safari', location: 'Pushkar', status: 'flagged', score: 62, complaints: 3 },
  { id: 'BSP-3891', name: 'Heritage Haveli Resort', location: 'Jaipur', status: 'verified', score: 94, complaints: 0 },
  { id: 'BSP-2211', name: 'Royal Guide Services', location: 'Udaipur', status: 'pending', score: 78, complaints: 1 },
]

export default function OfficerDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="app-shell" style={{ background: '#0F172A', color: '#E2E8F0' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0D1B2E,#1E3A5F)', padding: '14px 16px 14px', flexShrink: 0, borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#F59E0B,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛡️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800 }}>Officer Portal</div>
              <div style={{ fontSize: 9.5, color: '#94A3B8' }}>Anita Sharma · DTO Pushkar</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 9, background: '#10B981', color: '#fff', padding: '2px 7px', borderRadius: 8, fontWeight: 700 }}>● LIVE</span>
            <button style={{ fontSize: 16, color: '#94A3B8', background: 'none' }} onClick={() => navigate('/visitor')}>🚪</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, background: '#1E293B', borderBottom: '1px solid #334155', flexShrink: 0 }}>
        {[['dashboard', '📊 Dashboard'], ['grievances', '📢 Grievances'], ['bsp', '🏨 BSP']].map(([val, lbl]) => (
          <button key={val} onClick={() => setActiveTab(val)} style={{ flex: 1, padding: '10px 4px', fontSize: 11, fontWeight: 700, color: activeTab === val ? '#F59E0B' : '#64748B', background: 'none', borderBottom: activeTab === val ? '2px solid #F59E0B' : '2px solid transparent' }}>
            {lbl}
          </button>
        ))}
      </div>

      <div className="screen-scroll" style={{ background: '#0F172A' }}>
        <div className="content" style={{ background: '#0F172A', color: '#E2E8F0' }}>

          {activeTab === 'dashboard' && (
            <>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Today · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>

              <div className="grid-2">
                {METRICS.map(m => (
                  <div key={m.label} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 12, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: m.color, marginTop: 4, lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 700, marginTop: 2 }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              {/* AI insights */}
              <div style={{ background: 'linear-gradient(135deg,#1E2D1A,#1A2A14)', border: '1px solid #2D4A20', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>🤖</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#86EFAC' }}>AI Insights</span>
                </div>
                <div style={{ fontSize: 11, color: '#86EFAC', lineHeight: 1.6 }}>
                  🔴 <strong>Pushkar area</strong> has 5 overcharging complaints this week — <strong>+300%</strong> above normal. Consider preventive inspection.<br />
                  🟡 BSP <strong>Desert Rose Camel Safari</strong> has crossed complaint threshold (3 in 30 days) — action required.
                </div>
              </div>

              {/* Sentiment */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>Tourist Sentiment</span>
                  <span style={{ fontSize: 10.5, color: '#94A3B8' }}>Last 7 days</span>
                </div>
                {[['😊 Positive', 62, '#10B981'], ['😐 Neutral', 23, '#F59E0B'], ['😟 Negative', 15, '#EF4444']].map(([label, pct, color]) => (
                  <div key={label} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                      <span>{label}</span><span style={{ color, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: '#0F172A', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: color, width: `${pct}%`, borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'grievances' && (
            <>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>23 Active · Sorted by Priority</div>
              {GRIEVANCES.map(g => (
                <div key={g.id} style={{ background: '#1E293B', border: `1px solid ${g.priority === 'high' ? '#991B1B' : '#334155'}`, borderRadius: 12, padding: 12, borderLeft: `3px solid ${g.priority === 'high' ? '#EF4444' : '#F59E0B'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#E2E8F0' }}>{g.title}</div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>📍 {g.location} · {g.tourist} · {g.id}</div>
                    </div>
                    <span style={{ background: g.priority === 'high' ? '#7F1D1D' : '#78350F', color: g.priority === 'high' ? '#FCA5A5' : '#FDE68A', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, flexShrink: 0 }}>
                      {g.priority === 'high' ? '⚡ HIGH' : '⚠ MEDIUM'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10.5, color: '#64748B' }}>{g.category} · {g.hours}h response window</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ background: '#1E40AF', color: '#BFDBFE', padding: '5px 9px', borderRadius: 7, fontSize: 10.5, fontWeight: 700 }}>Assign</button>
                      <button style={{ background: '#065F46', color: '#A7F3D0', padding: '5px 9px', borderRadius: 7, fontSize: 10.5, fontWeight: 700 }}>Resolve</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'bsp' && (
            <>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Business Service Providers · Rajasthan</div>
              {BSP.map(b => (
                <div key={b.id} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#E2E8F0' }}>{b.name}</div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>📍 {b.location} · {b.id}</div>
                    </div>
                    <span style={{
                      background: b.status === 'verified' ? '#065F46' : b.status === 'flagged' ? '#7F1D1D' : '#78350F',
                      color: b.status === 'verified' ? '#A7F3D0' : b.status === 'flagged' ? '#FCA5A5' : '#FDE68A',
                      fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6,
                    }}>
                      {b.status === 'verified' ? '✓ VERIFIED' : b.status === 'flagged' ? '⚠ FLAGGED' : '⏳ PENDING'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', marginBottom: 3 }}>AI Risk Score · Complaints: {b.complaints}</div>
                      <div style={{ height: 5, background: '#0F172A', borderRadius: 3, width: 120, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: b.score > 80 ? '#10B981' : b.score > 60 ? '#F59E0B' : '#EF4444', width: `${b.score}%`, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: b.score > 80 ? '#10B981' : b.score > 60 ? '#F59E0B' : '#EF4444' }}>{b.score}</div>
                      <div style={{ fontSize: 9, color: '#64748B' }}>/ 100</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>

      {/* Dark bottom nav */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#1E293B', borderTop: '1px solid #334155', padding: '8px 4px 12px', flexShrink: 0 }}>
        {[['📊', 'Dashboard'], ['📢', 'Grievances'], ['🏨', 'BSP'], ['👤', 'Profile']].map(([ico, lbl]) => (
          <button key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, color: lbl === 'Dashboard' ? '#F59E0B' : '#64748B', fontWeight: 600, flex: 1, background: 'none' }}
            onClick={() => setActiveTab(lbl.toLowerCase())}>
            <span style={{ fontSize: 20 }}>{ico}</span>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  )
}
