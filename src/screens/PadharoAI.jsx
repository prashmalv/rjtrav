import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'

const QUICK_ACTIONS = [
  { ico: '🗺', label: 'Plan My Day' },
  { ico: '🏰', label: 'Top Forts' },
  { ico: '🍽', label: 'Local Food' },
  { ico: '🐅', label: 'Wildlife' },
  { ico: '🛍', label: 'Shopping' },
  { ico: '🔭', label: 'Visual AI', link: '/visual-ai', accent: true },
]

const SUGGESTIONS = [
  '"Best 3-day itinerary from Delhi"',
  '"Photography spots in Jaipur"',
  '"Pushkar Camel Fair dates and tips"',
]

async function callAI(messages, userProfile, language) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userProfile, language }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'AI error')
  return data.reply
}

// Smart local fallback when API is not configured
function localFallback(msg, profile) {
  const m = msg.toLowerCase()
  const style = profile?.travelStyle || 'traveller'
  const interests = profile?.interests || []

  if (m.includes('itinerary') || m.includes('plan') || m.includes('days') || m.includes('trip')) {
    return `Here's a suggested Rajasthan itinerary for a ${style}:\n\n🗓 **Day 1–2 · Jaipur** — Amber Fort, Hawa Mahal, City Palace, Jantar Mantar. Stay in Pink City heritage hotel.\n🗓 **Day 3–4 · Udaipur** — City Palace, Lake Pichola boat ride, Sajjangarh at sunset.\n🗓 **Day 5–6 · Jodhpur** — Mehrangarh Fort, Blue City walk, Umaid Bhawan.\n🗓 **Day 7 · Jaisalmer** — Golden Fort, Sam Sand Dunes camel safari, desert camp night.\n\n💡 Best season: October–March. Book safari & camp 2 weeks ahead.`
  }
  if (m.includes('hawa') || m.includes('mahal') || m.includes('wind')) {
    return `🏰 **Hawa Mahal** (Palace of Winds)\n\n📍 Old City, Jaipur · ⭐ 4.7/5\n⏰ 9 AM – 4:30 PM · 🎫 ₹50 (Indian) / ₹200 (Foreign)\n\nBuilt in 1799 with 953 windows so royal women could observe street festivals. Best photographed from street level at sunrise — the pink sandstone glows golden. There are excellent chai stalls right outside!`
  }
  if (m.includes('jaipur') || m.includes('pink city')) {
    return `🌸 **Jaipur — The Pink City**\n\n**Must-visit:**\n• Amber Fort (8AM, book elephant ride ₹900)\n• Hawa Mahal (sunrise for best photos)\n• City Palace + Jantar Mantar (half day)\n• Nahargarh Fort for sunset panorama\n\n**Food:** Pyaaz kachori at Rawat Mishthan, thali at Chokhi Dhani\n\n💡 ${profile?.homeCity === 'Delhi' ? 'From Delhi, Jaipur is 5h by train (Shatabdi). Avoid Friday–Sunday — Khatu Shyam pilgrims make it very crowded.' : 'Avoid weekends — the city gets very crowded with pilgrims.'}`
  }
  if (m.includes('food') || m.includes('eat') || m.includes('thali') || m.includes('cuisine')) {
    return `🍽 **Rajasthani Food Guide**\n\n**Must-try dishes:**\n• Dal Baati Churma — the iconic Rajasthani meal\n• Laal Maas — fiery red mutton curry\n• Pyaaz Kachori — flaky onion pastry (Jaipur)\n• Ghewar — sweet milk-based dessert\n• Ker Sangri — dried desert beans\n\n**Best spots:** Natraj Restaurant (Jaipur), Janta Sweet Home (Jodhpur), Hotel Shahi Kila (Jaisalmer).`
  }
  if (m.includes('safari') || m.includes('tiger') || m.includes('ranthambore') || m.includes('wildlife')) {
    return `🐅 **Ranthambore National Park**\n\n⏰ Season: October to June (avoid monsoon)\n🎫 Zone 1–5 safaris: ₹700/person (jeep) or ₹500 (canter)\n📱 Book online at **rajasthanwildlife.in** — 60 days in advance\n\n🕕 **Timings:** Dawn (6:30–10 AM) and Dusk (2:30–6 PM)\n🐅 Tiger sighting probability: ~75% in peak season (Nov–Mar)\n\n💡 ${style === 'Family' ? 'Family tip: Canter (larger vehicle) is safer with kids. Zone 3 & 4 have best tiger sightings.' : 'Book Zone 1 or 3 for best tiger sighting chances.'}`
  }
  if (m.includes('desert') || m.includes('dune') || m.includes('camel') || m.includes('jaisalmer')) {
    return `🏜 **Jaisalmer & Sam Sand Dunes**\n\n🏰 Jaisalmer Fort — the only living fort in India, 3,000 residents inside\n🐪 Sam Sand Dunes — 42 km from city, camel safari at sunset (₹300/hour)\n🌌 Desert Camp — overnight tents with folk music & bonfire from ₹2,500\n\n**Best time:** November to February\n**Tip:** The fort glows golden at sunset — catch it from the Jain temples inside.`
  }
  if (m.includes('pushkar')) {
    return `🌸 **Pushkar**\n\n📍 250 km from Jaipur · World's only Brahma Temple\n🐪 **Camel Fair:** November (dates change yearly, check official calendar)\n\n**Must-do:**\n• Holy dip at Pushkar Lake (one of 5 sacred lakes in India)\n• Brahma Temple darshan (5AM–1:30PM, 3–9PM)\n• Sunset from Savitri Temple hilltop\n• Bazaar shopping — silver jewellery, leather goods\n\n💡 Pushkar is vegetarian & alcohol-free city — respect local rules.`
  }
  if (interests.includes('Photography') && (m.includes('photo') || m.includes('shot') || m.includes('instagram'))) {
    return `📸 **Top Photography Spots in Rajasthan**\n\n🌅 **Golden Hour shots:**\n• Hawa Mahal facade — MI Road, Jaipur (sunrise)\n• Mehrangarh Fort overview of blue city (sunset)\n• Sam Sand Dunes silhouettes (sunset)\n• Lake Pichola with City Palace reflection (dusk)\n\n🏯 **Architecture:**\n• Amber Fort mirror corridors (avoid 11AM–3PM harsh light)\n• Jaisalmer Fort from Vyas Chhatri at magic hour\n\n💡 Blue Hour in Jodhpur is extraordinary — climb Mehrangarh at 6PM.`
  }
  return `I'd love to help you explore Rajasthan! 🏰\n\nI can assist with:\n• **Itinerary planning** — personalised for ${style} travellers\n• **Heritage sites** — forts, palaces, havelis with entry details\n• **Wildlife** — Ranthambore safari bookings & tips\n• **Local food** — best dishes and restaurants\n• **Practical tips** — transport, safety, best seasons\n\nWhat would you like to explore?`
}

export default function PadharoAI() {
  const navigate = useNavigate()
  const { user, appLanguage } = useApp()
  const [view, setView] = useState('home')
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [aiError, setAiError] = useState(false)
  const bottomRef = useRef(null)

  const greeting = user?.name
    ? `Hello ${user.name}! 👋 I'm Padharo AI, your personal Rajasthan guide.${user.interests?.length ? ` I see you're interested in ${user.interests.slice(0, 2).join(' & ')} — I'll tailor my suggestions for you.` : ' How can I help plan your perfect trip?'}`
    : "Welcome to Padharo AI! 👋 I'm your personal Rajasthan travel companion. Ask me anything — itineraries, forts, food, wildlife, or local tips."

  useEffect(() => {
    if (view === 'chat' && msgs.length === 0) {
      setMsgs([{ from: 'bot', text: greeting }])
    }
  }, [view])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  const sendMsg = async (text) => {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    setAiError(false)
    const newMsgs = [...msgs, { from: 'user', text: msg }]
    setMsgs(newMsgs)
    setTyping(true)

    try {
      const reply = await callAI(newMsgs, user, appLanguage)
      setTyping(false)
      setMsgs(prev => [...prev, { from: 'bot', text: reply }])
    } catch (err) {
      setTyping(false)
      if (err.message === 'AI_NOT_CONFIGURED') {
        const fallback = localFallback(msg, user)
        setMsgs(prev => [...prev, { from: 'bot', text: fallback }])
      } else {
        setAiError(true)
        setMsgs(prev => [...prev, { from: 'bot', text: "I'm having trouble connecting right now. Please try again in a moment. 🔄" }])
      }
    }
  }

  // ── Chat view ─────────────────────────────────────────────────────────────
  if (view === 'chat') {
    return (
      <div className="app-shell">
        <StatusBar light />
        <div style={{ background: 'var(--grad-hero)', padding: '10px 14px', color: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button style={{ fontSize: 18, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setView('home')}>←</button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, position: 'relative', flexShrink: 0 }}>
            🤖
            <span style={{ position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, background: '#10B981', border: '2px solid var(--primary)', borderRadius: '50%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>Padharo AI</div>
            <div style={{ fontSize: 10, opacity: 0.85 }}>{typing ? '⚡ Thinking...' : '● Online · AI-powered'}</div>
          </div>
          <LanguageSelector light />
        </div>

        <div className="screen-scroll" style={{ background: 'linear-gradient(180deg,var(--soft) 0%,var(--bg) 100%)', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-mute)', fontWeight: 600 }}>Today · {appLanguage}</div>

          {msgs.map((m, i) =>
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
          )}

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

          {msgs.length === 1 && !typing && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: 34 }}>
              {['🗺 Plan 3-day Jaipur trip', '🐅 Ranthambore safari tips', '🍽 Best food in Rajasthan'].map(s => (
                <button key={s} className="chip chip-neutral" style={{ cursor: 'pointer', padding: '6px 10px' }} onClick={() => sendMsg(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {user?.interests?.length > 0 && msgs.length === 1 && !typing && (
            <div style={{ marginLeft: 34, background: 'var(--primary-ghost)', border: '1px solid var(--primary-ghost)', borderRadius: 10, padding: '8px 10px', fontSize: 11 }}>
              <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>Your interests: </span>
              <span style={{ color: 'var(--ink-soft)' }}>{user.interests.join(' · ')}</span>
              <span style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: 6, fontWeight: 700 }} onClick={() => navigate('/profile-setup')}>Edit →</span>
            </div>
          )}

          <div ref={bottomRef} style={{ height: 4 }} />
        </div>

        <div className="chat-input-bar">
          <input
            className="chat-input"
            placeholder={`Ask in ${appLanguage}...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
          />
          <button
            style={{ width: 36, height: 36, borderRadius: '50%', background: input ? 'var(--primary)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: input ? '#fff' : 'var(--ink-mute)', flexShrink: 0, border: 'none', cursor: 'pointer' }}
            onClick={() => sendMsg()}
          >→</button>
        </div>
      </div>
    )
  }

  // ── Home view ─────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <StatusBar light />
      <div style={{ background: 'var(--grad-hero)', padding: '16px 16px 20px', color: '#fff', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.3 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button style={{ fontSize: 16, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate(-1)}>←</button>
            <LanguageSelector light />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '2px solid rgba(255,255,255,0.35)', position: 'relative', flexShrink: 0 }}>
              🤖
              <span style={{ position: 'absolute', bottom: 0, right: 0, width: 13, height: 13, background: '#10B981', border: '2px solid var(--primary)', borderRadius: '50%' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Padharo AI</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>AI-powered · Rajasthan Tourism · {appLanguage}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content" style={{ marginTop: -10 }}>

          {/* Profile personalisation card */}
          {user && (
            <div style={{ background: 'linear-gradient(135deg,var(--primary-ghost),var(--soft))', border: '1px solid var(--primary-ghost)', borderRadius: 14, padding: '11px 13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary-dark)', marginBottom: 5 }}>
                    🎯 Personalised for {user.name || 'You'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                    {user.travelStyle && (
                      <span className="chip chip-primary" style={{ fontSize: 10, padding: '2px 8px' }}>
                        {user.travelStyle === 'Solo' ? '🧍' : user.travelStyle === 'Couple' ? '👫' : user.travelStyle === 'Family' ? '👨‍👩‍👧' : '👥'} {user.travelStyle}
                      </span>
                    )}
                    {user.interests?.slice(0, 3).map(i => (
                      <span key={i} className="chip chip-neutral" style={{ fontSize: 10, padding: '2px 8px' }}>{i}</span>
                    ))}
                    {user.interests?.length > 3 && <span style={{ fontSize: 10, color: 'var(--ink-mute)', padding: '2px 0' }}>+{user.interests.length - 3} more</span>}
                  </div>
                </div>
                <button onClick={() => navigate('/profile-setup')} style={{ fontSize: 10.5, color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', paddingLeft: 8 }}>
                  Edit →
                </button>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="surface" style={{ padding: 12 }}>
            <div className="bold" style={{ fontSize: 13, marginBottom: 8 }}>Quick Actions</div>
            <div className="grid-2">
              {QUICK_ACTIONS.map(a => (
                <button
                  key={a.label}
                  onClick={() => {
                    if (a.link) { navigate(a.link); return }
                    setView('chat')
                    setTimeout(() => sendMsg(`${a.ico} ${a.label}`), 300)
                  }}
                  style={{
                    padding: '10px 6px', textAlign: 'center',
                    background: a.accent ? 'var(--accent-light)' : 'linear-gradient(135deg,var(--primary-ghost),var(--soft))',
                    borderRadius: 10, fontSize: 11, fontWeight: 700,
                    color: a.accent ? 'var(--accent-dark)' : 'var(--ink)',
                    border: a.accent ? '1px solid var(--accent)' : '1px solid var(--primary-ghost)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{a.ico}</div>
                  {a.label}
                  {a.accent && <div style={{ background: 'var(--accent)', color: '#3D1F00', fontSize: 8, padding: '1px 5px', borderRadius: 4, marginTop: 3, display: 'inline-block' }}>NEW</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Try asking */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>💡 Try asking</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {SUGGESTIONS.map(s => (
                <div key={s} style={{ fontSize: 11, color: 'var(--ink-soft)', fontStyle: 'italic', cursor: 'pointer' }}
                  onClick={() => { setView('chat'); setTimeout(() => sendMsg(s.replace(/"/g, '')), 300) }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <button className="btn-pri" onClick={() => setView('chat')}>💬 Start Conversation</button>
          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
