import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

const QUICK_ACTIONS = [
  { ico: '📸', label: 'Identify Monument' },
  { ico: '🗺', label: 'Plan My Day' },
  { ico: '🍽', label: 'Local Food' },
  { ico: '🗣', label: 'Translate' },
  { ico: '🎤', label: 'Voice Mode' },
  { ico: '🔭', label: 'Visual AI', accent: true, link: '/visual-ai' },
]

const RECENT = [
  { ico: '🏰', title: 'History of Mehrangarh Fort', info: 'Yesterday · 14 messages' },
  { ico: '🐅', title: 'Best safari time at Ranthambore', info: '2 days ago · 8 messages' },
]

const SUGGESTIONS = [
  '"Padmavati ki kahani sunao"',
  '"Best vegetarian thali in Pushkar?"',
  '"Photography rules at Hawa Mahal?"',
]

const INITIAL_MSGS = [
  { from: 'bot', text: 'Namaste Vikram! 🙏 Welcome to Rajasthan. I\'m Padharo AI, your personal travel companion. How can I help today?' },
]

const AUTO_REPLIES = {
  default: 'मैं समझता हूँ! Rajasthan is a magical destination. Let me help you plan the perfect experience. Could you tell me more about what interests you — heritage forts, wildlife, desert adventures, or local cuisine?',
  hawa: 'Hawa Mahal entry fees:\n🏛 **Indian:** ₹50/adult\n🌍 **Foreign:** ₹200/adult\n⏰ **Open:** 9 AM – 4:30 PM\n\n💡 Tip: Visit at sunrise (6:30 AM) for the best golden light on the pink facade!',
  jaipur: '**Jaipur 1-Day Itinerary:**\n\n🌅 **Morning:** Amber Fort (9 AM–12 PM)\n🏰 **Noon:** City Palace & Jantar Mantar\n🌇 **Evening:** Hawa Mahal at sunset\n🍽 **Dinner:** Chokhi Dhani for Rajasthani thali\n\nTotal cost: ~₹500–800 per person',
  food: '**Top Rajasthani Food Picks:**\n\n🥘 Dal Baati Churma (must-try!)\n🍛 Laal Maas (spicy mutton)\n🥗 Ker Sangri (desert beans)\n🍬 Ghewar (sweet dessert)\n\n📍 Best place: Natraj Restaurant, MI Road, Jaipur',
  safari: '**Ranthambore Safari Tips:**\n\n🐅 Best time: October to June\n⏰ Zone 1-5: Dawn & dusk safaris\n💰 Cost: ₹500 (Gypsy) + ₹200 entry\n📱 Book 60 days in advance online\n\nProbability of tiger sighting: ~75% in peak season!',
}

function getReply(msg) {
  const m = msg.toLowerCase()
  if (m.includes('hawa') || m.includes('mahal')) return AUTO_REPLIES.hawa
  if (m.includes('jaipur') || m.includes('day') || m.includes('itinerary')) return AUTO_REPLIES.jaipur
  if (m.includes('food') || m.includes('thali') || m.includes('eat')) return AUTO_REPLIES.food
  if (m.includes('safari') || m.includes('tiger') || m.includes('ranthambore')) return AUTO_REPLIES.safari
  return AUTO_REPLIES.default
}

export default function PadharoAI() {
  const navigate = useNavigate()
  const [view, setView] = useState('home') // home | chat
  const [msgs, setMsgs] = useState(INITIAL_MSGS)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  const sendMsg = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMsgs(prev => [...prev, { from: 'user', text: msg }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(prev => [...prev, { from: 'bot', text: getReply(msg) }])
    }, 1200)
  }

  if (view === 'chat') {
    return (
      <div className="app-shell">
        <StatusBar light />
        {/* Chat header */}
        <div style={{ background: 'var(--grad-hero)', padding: '10px 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button style={{ fontSize: 18, color: '#fff', background: 'none' }} onClick={() => setView('home')}>←</button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, position: 'relative' }}>
            🤖
            <span style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, background: '#10B981', border: '2px solid var(--primary)', borderRadius: '50%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>Padharo AI</div>
            <div style={{ fontSize: 10, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 4 }}>
              {typing ? '⚡ Typing...' : '● Online · हिंदी · English · मारवाड़ी'}
            </div>
          </div>
          <span style={{ fontSize: 16 }}>⋮</span>
        </div>

        {/* Messages */}
        <div className="screen-scroll" style={{ background: 'linear-gradient(180deg,var(--soft) 0%,var(--bg) 100%)', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-mute)', fontWeight: 600 }}>Today</div>

          {msgs.map((m, i) => (
            m.from === 'bot' ? (
              <div key={i} className="chat-msg-bot">
                <div className="chat-avatar">🤖</div>
                <div className="chat-bubble-bot" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
              </div>
            ) : (
              <div key={i} className="chat-msg-user">
                <div className="chat-bubble-user">{m.text}</div>
              </div>
            )
          ))}

          {typing && (
            <div className="chat-msg-bot">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble-bot" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 14px' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{ width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%', animation: `typing 1s infinite ${d}s`, display: 'inline-block' }} />
                ))}
              </div>
            </div>
          )}

          {/* Quick chips after last bot message */}
          {msgs.length === 1 && !typing && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: 34 }}>
              {['🏰 Plan day in Jaipur', '🍽 Best vegetarian thali', '🛍 Bazaar shopping tips'].map(s => (
                <button key={s} className="chip chip-neutral" style={{ cursor: 'pointer', padding: '6px 10px' }} onClick={() => sendMsg(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} style={{ height: 4 }} />
        </div>

        {/* Input bar */}
        <div className="chat-input-bar">
          <span style={{ fontSize: 18 }}>📎</span>
          <input
            className="chat-input"
            placeholder="Type in Hindi or English..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
          />
          <button style={{ fontSize: 18 }} onClick={() => sendMsg()}>🎤</button>
          <button
            style={{ width: 36, height: 36, borderRadius: '50%', background: input ? 'var(--primary)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: input ? '#fff' : 'var(--ink-mute)', flexShrink: 0 }}
            onClick={() => sendMsg()}
          >→</button>
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="app-shell">
      <StatusBar light />
      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '18px 16px 22px', color: '#fff', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.3 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button style={{ fontSize: 16, color: '#fff', background: 'none' }} onClick={() => navigate(-1)}>←</button>
            <span className="chip chip-white">⚡ Multilingual AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: '2px solid rgba(255,255,255,0.4)', position: 'relative' }}>
              🤖
              <span style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, background: '#10B981', border: '2px solid var(--primary)', borderRadius: '50%' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Padharo AI</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>Your Rajasthan companion · हिंदी · English · मारवाड़ी</div>
            </div>
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content" style={{ marginTop: -12 }}>
          {/* Quick actions */}
          <div className="surface" style={{ padding: 12 }}>
            <div className="bold" style={{ fontSize: 13, marginBottom: 8 }}>Smart Quick Actions</div>
            <div className="grid-2">
              {QUICK_ACTIONS.map(a => (
                <button
                  key={a.label}
                  onClick={() => { if (a.link) { navigate(a.link); return; } setView('chat'); setTimeout(() => sendMsg(`${a.ico} ${a.label}`), 300) }}
                  style={{
                    padding: '10px 6px',
                    background: a.accent ? 'var(--accent-light)' : 'linear-gradient(135deg,var(--primary-ghost),var(--soft))',
                    borderRadius: 10, fontSize: 11, fontWeight: 700,
                    color: a.accent ? 'var(--accent-dark)' : 'var(--ink)',
                    textAlign: 'center',
                    border: a.accent ? '1px solid var(--accent)' : '1px solid var(--primary-ghost)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{a.ico}</div>
                  {a.label}
                  {a.accent && <div style={{ background: 'var(--accent)', color: '#3D1F00', fontSize: 8, padding: '1px 4px', borderRadius: 4, marginTop: 2 }}>NEW</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Recent conversations */}
          <div className="bold" style={{ fontSize: 13 }}>Recent Conversations</div>
          {RECENT.map(r => (
            <div key={r.title} className="list-card" style={{ padding: '9px 11px', cursor: 'pointer' }} onClick={() => { setView('chat'); }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--primary-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{r.ico}</div>
              <div className="lc-info"><div className="lc-title">{r.title}</div><div className="text-xs muted">{r.info}</div></div>
              <div className="lc-arrow">›</div>
            </div>
          ))}

          {/* Try asking */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>💡 Try asking</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {SUGGESTIONS.map(s => (
                <div key={s} style={{ fontSize: 11, color: 'var(--ink-soft)', fontStyle: 'italic', cursor: 'pointer' }} onClick={() => { setView('chat'); setTimeout(() => sendMsg(s.replace(/"/g, '')), 300) }}>{s}</div>
              ))}
            </div>
          </div>

          <button className="btn-pri" onClick={() => setView('chat')}>💬 Start New Conversation</button>
          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
