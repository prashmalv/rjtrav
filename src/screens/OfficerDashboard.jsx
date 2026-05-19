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

const FOOTFALL = [
  { district: 'Jaipur', visitors: 18420, revenue: 24.2, change: '+12%', color: '#C2185B' },
  { district: 'Udaipur', visitors: 11300, revenue: 18.7, change: '+8%', color: '#3B82F6' },
  { district: 'Jodhpur', visitors: 9850, revenue: 14.1, change: '+15%', color: '#8B5CF6' },
  { district: 'Jaisalmer', visitors: 7620, revenue: 12.4, change: '+22%', color: '#F59E0B' },
  { district: 'Pushkar', visitors: 6410, revenue: 8.9, change: '+5%', color: '#10B981' },
  { district: 'Ranthambore', visitors: 4280, revenue: 7.3, change: '+18%', color: '#EF4444' },
]

const MONTHLY = [
  { month: 'Aug', val: 38 },
  { month: 'Sep', val: 52 },
  { month: 'Oct', val: 71 },
  { month: 'Nov', val: 94 },
  { month: 'Dec', val: 100 },
  { month: 'Jan', val: 88 },
  { month: 'Feb', val: 76 },
  { month: 'Mar', val: 65 },
]

const TOURIST_REGS = [
  { nationality: 'India (Domestic)', count: 42180, pct: 73, color: '#C2185B' },
  { nationality: 'United Kingdom', count: 3420, pct: 6, color: '#3B82F6' },
  { nationality: 'Germany', count: 2890, pct: 5, color: '#F59E0B' },
  { nationality: 'USA / Canada', count: 2450, pct: 4, color: '#8B5CF6' },
  { nationality: 'France', count: 1980, pct: 3, color: '#10B981' },
  { nationality: 'Japan / Korea', count: 1620, pct: 3, color: '#EF4444' },
  { nationality: 'Others', count: 3340, pct: 6, color: '#64748B' },
]

const ENTRY_POINTS = [
  { type: 'Jaipur Airport', count: 18420, ico: '✈️', color: '#3B82F6' },
  { type: 'Jaipur Railway', count: 14200, ico: '🚂', color: '#C2185B' },
  { type: 'Road (NH-48)', count: 12300, ico: '🚗', color: '#F59E0B' },
  { type: 'Udaipur Airport', count: 8960, ico: '✈️', color: '#8B5CF6' },
  { type: 'Jodhpur Airport', count: 4000, ico: '✈️', color: '#10B981' },
]

const maxEntryCount = Math.max(...ENTRY_POINTS.map(e => e.count))

const SOS_ALERTS = [
  { id: 'SOS-2026-001', tourist: 'Marco Weber', nationality: 'Germany', location: 'Sam Sand Dunes, Jaisalmer', time: '14 min ago', status: 'active', severity: 'high' },
  { id: 'SOS-2026-002', tourist: 'Priya Sharma', nationality: 'India', location: 'Ranthambore Zone 3', time: '52 min ago', status: 'responding', severity: 'medium' },
  { id: 'SOS-2026-003', tourist: 'Yuki Tanaka', nationality: 'Japan', location: 'Mehrangarh Fort, Jodhpur', time: '2h 14m ago', status: 'resolved', severity: 'low' },
]

const POLICE_POSTS = [
  { location: 'Amber Fort', district: 'Jaipur', officers: 8, status: 'optimal', tourists: 2400 },
  { location: 'Mehrangarh Fort', district: 'Jodhpur', officers: 6, status: 'optimal', tourists: 1850 },
  { location: 'Jaisalmer Fort', district: 'Jaisalmer', officers: 5, status: 'optimal', tourists: 1200 },
  { location: 'Sam Sand Dunes', district: 'Jaisalmer', officers: 4, status: 'low', tourists: 620 },
]

const CAPACITY_ALERTS = [
  { site: 'Ranthambore NP', current: 90, weekend: 100, trend: 'At capacity', trendColor: '#EF4444' },
  { site: 'Jaisalmer Fort', current: 78, weekend: 95, trend: 'Rising fast', trendColor: '#F59E0B' },
  { site: 'Sam Sand Dunes', current: 55, weekend: 88, trend: 'Rising', trendColor: '#F59E0B' },
  { site: 'Amber Fort', current: 65, weekend: 82, trend: 'Stable', trendColor: '#10B981' },
]

const maxMonthly = Math.max(...MONTHLY.map(m => m.val))
const maxFootfall = Math.max(...FOOTFALL.map(f => f.visitors))

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

      {/* Tabs — scrollable row */}
      <div style={{ display: 'flex', gap: 0, background: '#1E293B', borderBottom: '1px solid #334155', flexShrink: 0, overflowX: 'auto' }} className="hide-scrollbar">
        {[['dashboard', '📊 Dashboard'], ['grievances', '📢 Grievances'], ['bsp', '🏨 BSP'], ['tourists', '👥 Tourists'], ['safety', '🛡 Safety'], ['analytics', '📈 Analytics']].map(([val, lbl]) => (
          <button key={val} onClick={() => setActiveTab(val)} style={{ flexShrink: 0, padding: '10px 10px', fontSize: 10.5, fontWeight: 700, color: activeTab === val ? '#F59E0B' : '#64748B', background: 'none', borderBottom: activeTab === val ? '2px solid #F59E0B' : '2px solid transparent', whiteSpace: 'nowrap' }}>
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

          {activeTab === 'tourists' && (
            <>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tourist Registrations · May 2026</div>

              {/* Summary KPIs */}
              <div className="grid-2">
                {[
                  { label: 'Registered Today', value: '1,842', delta: '↑ 8% vs yesterday', color: '#C2185B' },
                  { label: 'This Week', value: '11,240', delta: '↑ 12% vs last week', color: '#3B82F6' },
                  { label: 'This Month', value: '57,880', delta: '↑ 14% vs Apr', color: '#10B981' },
                  { label: 'Foreign Tourists', value: '15,700', delta: '27% of total · ↑ 6%', color: '#F59E0B' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 12, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: m.color, marginTop: 4, lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 700, marginTop: 2 }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              {/* Nationality breakdown */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>Nationality Breakdown</span>
                  <span style={{ fontSize: 10, color: '#64748B' }}>This Month</span>
                </div>
                {TOURIST_REGS.map(r => (
                  <div key={r.nationality} style={{ marginBottom: 9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{r.nationality}</span>
                      <span style={{ color: r.color, fontWeight: 700 }}>{r.count.toLocaleString()} · {r.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: '#0F172A', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: r.color, width: `${r.pct}%`, borderRadius: 3, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Entry points */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>Entry Points (Air · Rail · Road)</span>
                  <span style={{ fontSize: 10, color: '#64748B' }}>This Month</span>
                </div>
                {ENTRY_POINTS.map(e => (
                  <div key={e.type} style={{ marginBottom: 9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: '#E2E8F0' }}>{e.ico} {e.type}</span>
                      <span style={{ color: e.color, fontWeight: 700 }}>{e.count.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 6, background: '#0F172A', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: `linear-gradient(90deg,${e.color},${e.color}88)`, width: `${(e.count / maxEntryCount) * 100}%`, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI insight */}
              <div style={{ background: 'linear-gradient(135deg,#1E2D1A,#1A2A14)', border: '1px solid #2D4A20', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>🤖</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#86EFAC' }}>AI Registration Insights</span>
                </div>
                <div style={{ fontSize: 11, color: '#86EFAC', lineHeight: 1.7 }}>
                  🇩🇪 <strong>German tourist registrations</strong> up 28% YoY — top interest: Jaisalmer Fort & Thar Desert. Prioritise German language BSP certification.<br />
                  ✈️ <strong>Jaipur Airport</strong> handles 32% of all tourist arrivals — crowding expected during Nov–Dec peak. Pre-position welcome desks.
                </div>
              </div>
            </>
          )}

          {activeTab === 'safety' && (
            <>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Law Enforcement &amp; Safety · Live</div>

              {/* SOS KPIs */}
              <div className="grid-2">
                {[
                  { label: 'Active SOS Alerts', value: '1', delta: '1 team responding', color: '#EF4444' },
                  { label: 'Resolved Today', value: '3', delta: 'Avg response: 8 min', color: '#10B981' },
                  { label: 'Blue Beret Posts', value: '28', delta: '14 heritage sites covered', color: '#3B82F6' },
                  { label: 'Helpline 1363', value: '47', delta: 'calls today · 4.8/5 rating', color: '#F59E0B' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 12, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: m.color, marginTop: 4, lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 700, marginTop: 2 }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              {/* Active SOS alerts */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>🆘 SOS Incidents · Last 24h</div>
                {SOS_ALERTS.map(s => (
                  <div key={s.id} style={{ marginBottom: 10, padding: '10px 12px', borderRadius: 10, background: s.status === 'active' ? '#7F1D1D' : s.status === 'responding' ? '#1C3A5E' : '#1E293B', border: `1px solid ${s.status === 'active' ? '#991B1B' : s.status === 'responding' ? '#2D4A7E' : '#334155'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>{s.tourist} <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>· {s.nationality}</span></div>
                        <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>📍 {s.location}</div>
                        <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{s.id} · {s.time}</div>
                      </div>
                      <span style={{
                        background: s.status === 'active' ? '#EF4444' : s.status === 'responding' ? '#3B82F6' : '#10B981',
                        color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, flexShrink: 0,
                      }}>
                        {s.status === 'active' ? '🔴 ACTIVE' : s.status === 'responding' ? '🔵 RESPONDING' : '✓ RESOLVED'}
                      </span>
                    </div>
                    {s.status === 'active' && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button style={{ background: '#1E40AF', color: '#BFDBFE', padding: '5px 10px', borderRadius: 7, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Dispatch Unit</button>
                        <button style={{ background: '#065F46', color: '#A7F3D0', padding: '5px 10px', borderRadius: 7, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Call Tourist</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Police post deployment */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>👮 Blue Beret Deployment Status</div>
                {POLICE_POSTS.map(p => (
                  <div key={p.location} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '8px 0', borderBottom: '1px solid #0F172A' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>{p.location}</div>
                      <div style={{ fontSize: 10, color: '#64748B', marginTop: 1 }}>📍 {p.district} · {p.tourists.toLocaleString()} tourists today</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: p.status === 'optimal' ? '#10B981' : '#F59E0B' }}>{p.officers} officers</div>
                      <div style={{ fontSize: 9, color: p.status === 'optimal' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{p.status === 'optimal' ? '✓ Optimal' : '⚠ Needs reinforcement'}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI safety insight */}
              <div style={{ background: 'linear-gradient(135deg,#1E2D1A,#1A2A14)', border: '1px solid #2D4A20', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>🤖</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#86EFAC' }}>AI Safety Insights</span>
                </div>
                <div style={{ fontSize: 11, color: '#86EFAC', lineHeight: 1.7 }}>
                  🏜 <strong>Sam Sand Dunes</strong> has only 4 officers for 620 tourists — ratio below threshold. Request 2 additional personnel before weekend.<br />
                  📞 <strong>Tourist Helpline 1363</strong> peak load: 6–8 PM (sunset at dunes). Consider shift extension for evening coverage.
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tourist Analytics · May 2026</div>

              {/* KPI row */}
              <div className="grid-2">
                {[
                  { label: 'Total Visitors (MTD)', value: '57,880', delta: '↑ 14% vs Apr', color: '#C2185B' },
                  { label: 'Revenue (₹ Cr)', value: '₹85.6', delta: '↑ 18% vs Apr', color: '#10B981' },
                  { label: 'Avg Stay (days)', value: '4.2', delta: '+0.3 vs last month', color: '#F59E0B' },
                  { label: 'Satisfaction Score', value: '4.6/5', delta: '↑ 0.2 vs Apr', color: '#3B82F6' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 12, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: m.color, marginTop: 4, lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 700, marginTop: 2 }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              {/* District-wise footfall heatmap */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>District Footfall Heatmap</span>
                  <span style={{ fontSize: 10, color: '#64748B' }}>This Month</span>
                </div>
                {FOOTFALL.map(f => (
                  <div key={f.district} style={{ marginBottom: 9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, color: '#E2E8F0' }}>{f.district}</span>
                      <span style={{ color: f.color, fontWeight: 700 }}>{f.visitors.toLocaleString()} · {f.change}</span>
                    </div>
                    <div style={{ height: 8, background: '#0F172A', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: `linear-gradient(90deg,${f.color},${f.color}88)`, width: `${(f.visitors / maxFootfall) * 100}%`, borderRadius: 4, transition: 'width 0.8s ease' }} />
                    </div>
                    <div style={{ fontSize: 9.5, color: '#64748B', marginTop: 1 }}>Revenue: ₹{f.revenue} Cr</div>
                  </div>
                ))}
              </div>

              {/* Monthly trend chart */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>Monthly Tourist Trend</span>
                  <span style={{ fontSize: 10, color: '#64748B' }}>Season 2025–26</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
                  {MONTHLY.map(m => (
                    <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ width: '100%', background: m.month === 'Dec' ? '#C2185B' : '#334155', borderRadius: '3px 3px 0 0', height: `${(m.val / maxMonthly) * 70}px`, minHeight: 4, transition: 'height 0.5s ease', position: 'relative' }}>
                        {m.month === 'Dec' && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: '#C2185B', fontWeight: 800, whiteSpace: 'nowrap' }}>PEAK</div>}
                      </div>
                      <div style={{ fontSize: 8.5, color: '#64748B', fontWeight: 600 }}>{m.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity forecasting */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>📊 Capacity Forecast · This Weekend</span>
                  <span style={{ fontSize: 10, color: '#64748B' }}>AI Predicted</span>
                </div>
                {CAPACITY_ALERTS.map(c => {
                  const weekendColor = c.weekend >= 90 ? '#EF4444' : c.weekend >= 75 ? '#F59E0B' : '#10B981'
                  return (
                    <div key={c.site} style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 10, background: '#0F172A', border: `1px solid ${weekendColor}33` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>{c.site}</span>
                        <span style={{ background: weekendColor + '22', color: weekendColor, fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                          {c.weekend >= 90 ? '⚠ Near Capacity' : c.weekend >= 75 ? '↑ High Demand' : '✓ Normal'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 10.5, marginBottom: 6 }}>
                        <span style={{ color: '#94A3B8' }}>Now: <strong style={{ color: '#E2E8F0' }}>{c.current}%</strong></span>
                        <span style={{ color: '#94A3B8' }}>Weekend forecast: <strong style={{ color: weekendColor }}>{c.weekend}%</strong></span>
                        <span style={{ color: c.trendColor, fontWeight: 700 }}>{c.trend}</span>
                      </div>
                      <div style={{ height: 5, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: `linear-gradient(90deg,${weekendColor}88,${weekendColor})`, width: `${c.weekend}%`, borderRadius: 3, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* AI insights for analytics */}
              <div style={{ background: 'linear-gradient(135deg,#1E2D1A,#1A2A14)', border: '1px solid #2D4A20', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>🤖</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#86EFAC' }}>AI Analytics Insights</span>
                </div>
                <div style={{ fontSize: 11, color: '#86EFAC', lineHeight: 1.7 }}>
                  🚨 <strong>Ranthambore NP</strong> predicted at 100% capacity this weekend — consider diverting bookings to Sariska or Keoladeo.<br />
                  📈 <strong>Jaisalmer</strong> shows +22% growth — highest in the state. Expand infrastructure before next season.<br />
                  🎪 <strong>Pushkar Camel Fair</strong> (Nov) generated ₹18.2 Cr in 10 days — consider dedicated pre-booking portal.<br />
                  🌍 <strong>Foreign tourist share</strong> at 34% (+6% YoY) — strengthen multilingual BSP certification.
                </div>
              </div>
            </>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>

      {/* Dark bottom nav */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#1E293B', borderTop: '1px solid #334155', padding: '8px 2px 12px', flexShrink: 0 }}>
        {[['📊', 'Data', 'dashboard'], ['📢', 'Cases', 'grievances'], ['🏨', 'BSP', 'bsp'], ['👥', 'Tourists', 'tourists'], ['🛡', 'Safety', 'safety'], ['📈', 'Stats', 'analytics']].map(([ico, lbl, val]) => (
          <button key={val} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 9, color: activeTab === val ? '#F59E0B' : '#64748B', fontWeight: 600, flex: 1, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab(val)}>
            <span style={{ fontSize: 18 }}>{ico}</span>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  )
}
