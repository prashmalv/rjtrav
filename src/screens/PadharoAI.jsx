import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'

const INTEREST_OPTIONS = [
  { ico: '🏰', label: 'Forts & Palaces' },
  { ico: '🐅', label: 'Wildlife' },
  { ico: '🏜', label: 'Desert & Dunes' },
  { ico: '🍽', label: 'Food & Cuisine' },
  { ico: '📸', label: 'Photography' },
  { ico: '🛍', label: 'Shopping' },
  { ico: '⛵', label: 'Lakes & Nature' },
  { ico: '🧘', label: 'Wellness & Culture' },
]

const FROM_CITIES = ['Delhi / NCR', 'Mumbai', 'Bengaluru', 'International']

const DAYS_OPTIONS = ['1–2 Days', '3–4 Days', '5–7 Days', '7+ Days']

const STYLE_OPTIONS = [
  { label: 'Solo', ico: '🧍' },
  { label: 'Couple', ico: '👫' },
  { label: 'Family', ico: '👨‍👩‍👧' },
  { label: 'Group', ico: '👥' },
]

async function callAI(messages, userProfile, language) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userProfile, language }),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'AI error')
  return data.reply
}

function isGrievanceIntent(msg) {
  const m = msg.toLowerCase()
  return m.includes('complaint') || m.includes('grievance') || m.includes('overcharg') ||
    m.includes('problem with') || m.includes('cheat') || m.includes('fraud') ||
    m.includes('scam') || m.includes('bad service') || m.includes('rude') ||
    m.includes('file a complaint') || m.includes('report')
}

function localFallback(msg, profile) {
  const m = msg.toLowerCase()
  const style = profile?.travelStyle || 'traveller'
  const interests = profile?.interests || []

  if (m.includes('itinerary') || m.includes('plan') || m.includes('days') || m.includes('trip') || m.includes('day-by-day') || m.includes('day by day') || m.includes('journey') || m.includes('experience')) {
    const days = profile?.days || '5'
    return `Here's a suggested Rajasthan itinerary for a ${style}:\n\n🗓 **Day 1–2 · Jaipur** — Amber Fort, Hawa Mahal, City Palace, Jantar Mantar. Stay in Pink City heritage hotel.\n🗓 **Day 3–4 · Udaipur** — City Palace, Lake Pichola boat ride, Sajjangarh at sunset.\n🗓 **Day 5–6 · Jodhpur** — Mehrangarh Fort, Blue City walk, Umaid Bhawan.\n🗓 **Day 7 · Jaisalmer** — Golden Fort, Sam Sand Dunes camel safari, desert camp night.\n\n💡 Best season: October–March. Book safari & camp 2 weeks ahead.`
  }
  if (m.includes('fort') || m.includes('palace') || m.includes('heritage') || m.includes('top fort')) {
    return `🏰 **Top Heritage Forts & Palaces in Rajasthan**\n\n🥇 **Amber Fort, Jaipur** — ₹100 (Indian) / ₹500 (Foreign) · Visit 8–10 AM before crowds\n🥈 **Mehrangarh Fort, Jodhpur** — Free entry · Stunning views of Blue City\n🥉 **Jaisalmer Fort** — Free · Only living fort in India, 3,000 residents inside\n🏛 **City Palace, Udaipur** — ₹250 · Royal Mewar dynasty grandeur on Lake Pichola\n🏯 **Hawa Mahal, Jaipur** — ₹50 / ₹200 · 953 windows, iconic pink sandstone\n🏰 **Ranthambore Fort** — Free (inside national park) · 10th-century hill fort\n\n💡 Buy the ASI composite ticket at Amber Fort — saves ₹200 if visiting multiple UNESCO sites.`
  }
  if (m.includes('food') || m.includes('eat') || m.includes('thali') || m.includes('cuisine') || m.includes('dish') || m.includes('restaurant')) {
    return `🍽 **Rajasthani Food Guide**\n\n**Must-try dishes:**\n• **Dal Baati Churma** — the iconic Rajasthani meal\n• **Laal Maas** — fiery red mutton curry with mathania chillies\n• **Pyaaz Kachori** — flaky onion pastry (Jaipur specialty)\n• **Ghewar** — sweet milk-based festive dessert\n• **Makhaniya Lassi** — rich saffron lassi, Jodhpur specialty\n\n**Best spots:**\n• Natraj Restaurant, Jaipur — ₹180 unlimited thali\n• Janta Sweet Home, Jodhpur — kachori & mirchi bada\n• Trio Restaurant, Jaisalmer — fort view + Rajasthani thali`
  }
  if (m.includes('safari') || m.includes('tiger') || m.includes('ranthambore') || m.includes('wildlife')) {
    return `🐅 **Ranthambore National Park**\n\n⏰ Season: October to June\n🎫 Jeep safari: ₹700/person · Canter: ₹500/person\n📱 Book at **rajasthanwildlife.in** — up to 60 days advance\n\n🕕 **Timings:** Dawn (6:30–10 AM) and Dusk (2:30–6 PM)\n🐅 Tiger sighting chance: ~75% in peak season (Nov–Mar)\n\n💡 ${style === 'Family' ? 'Family tip: Canter (larger vehicle) is safer with kids. Book Zone 3 or 4.' : 'Book Zone 1 for highest tiger sighting probability.'}`
  }
  if (m.includes('shop') || m.includes('market') || m.includes('buy') || m.includes('bazaar') || m.includes('souvenir')) {
    return `🛍 **Rajasthan Shopping Guide**\n\n**Must-buy:**\n• **Blue Pottery** — Jaipur's signature turquoise craft\n• **Bandhani** (Tie-dye fabric) — Jodhpur & Jaipur\n• **Mojari** (embroidered shoes) — Jaipur & Jodhpur\n• **Silver jewellery** — Pushkar & Jaipur's Johari Bazaar\n\n**Best markets:**\n• Johari Bazaar, Jaipur — gems & jewellery 💎\n• Sardar Market, Jodhpur — spices & handicrafts\n• Sadar Bazaar, Jaisalmer — desert crafts & leather`
  }
  if (m.includes('desert') || m.includes('dune') || m.includes('camel') || m.includes('jaisalmer')) {
    return `🏜 **Jaisalmer & Sam Sand Dunes**\n\n🏰 Jaisalmer Fort — only living fort in India, 3,000 residents inside\n🐪 Sam Sand Dunes — 42 km from city, camel safari at sunset (₹300/hour)\n🌌 Desert Camp — overnight tents with folk music & bonfire from ₹2,500\n\n**Best time:** November to February\n**Tip:** The fort glows golden at sunset — catch it from the Jain temples inside.`
  }
  if (isGrievanceIntent(m)) {
    return `I'm sorry to hear you had an issue! 😟 I'll help you file an official grievance with Rajasthan Tourism Authority.\n\nPlease share:\n• **What happened?** (brief description)\n• **Location** (which city/attraction)\n• **Date** of the incident\n• **Operator/person involved** (if known)\n\nAll grievances get a **24-hour response guarantee** and a tracking ID. You can also call Tourist Helpline **1363** (free, 24×7, multilingual).`
  }
  if (interests.includes('Photography') && (m.includes('photo') || m.includes('instagram'))) {
    return `📸 **Top Photography Spots in Rajasthan**\n\n🌅 **Golden Hour:**\n• Hawa Mahal facade — MI Road, Jaipur (sunrise)\n• Mehrangarh Fort overview of blue city (sunset)\n• Sam Sand Dunes silhouettes (sunset)\n• Lake Pichola with City Palace reflection (dusk)\n\n💡 Blue Hour in Jodhpur is extraordinary — climb Mehrangarh at 6PM.`
  }
  return `I'd love to help you explore Rajasthan! 🏰\n\nI can assist with:\n• **Itinerary planning** — personalised for ${style} travellers\n• **Heritage sites** — forts, palaces, havelis with entry details\n• **Wildlife** — Ranthambore safari bookings & tips\n• **Local food** — must-try dishes and best restaurants\n• **Shopping** — best markets and what to buy\n\nWhat would you like to explore?`
}

function RenderText({ text }) {
  return (
    <div style={{ lineHeight: 1.6, fontSize: 13 }}>
      {text.split('\n').map((line, li) => {
        const parts = line.split(/\*\*([^*]+)\*\*/g)
        return (
          <div key={li} style={{ minHeight: line.trim() === '' ? 6 : undefined }}>
            {parts.map((part, pi) =>
              pi % 2 === 1
                ? <strong key={pi}>{part}</strong>
                : <span key={pi}>{part}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ChipSelect({ options, selected, onToggle, multi = false }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : opt.label
        const ico = typeof opt === 'string' ? null : opt.ico
        const isSelected = multi ? (selected || []).includes(val) : selected === val
        return (
          <button
            key={val}
            onClick={() => onToggle(val)}
            style={{
              padding: '7px 12px',
              borderRadius: 20,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              border: isSelected ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
              background: isSelected ? 'var(--grad-hero)' : '#fff',
              color: isSelected ? '#fff' : 'var(--ink-soft)',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {ico && <span>{ico}</span>}
            {val}
          </button>
        )
      })}
    </div>
  )
}

export default function PadharoAI() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, appLanguage } = useApp()
  const [view, setView] = useState('home')
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [form, setForm] = useState({ name: '', style: '', interests: [], fromCity: '', days: '' })
  const guestProfileRef = useRef(null)
  const appLanguageRef = useRef(appLanguage)
  const initialMsgFired = useRef(false)
  useEffect(() => { appLanguageRef.current = appLanguage }, [appLanguage])

  const bottomRef = useRef(null)

  const getGreeting = (profile) => {
    const p = profile || guestProfileRef.current || user
    if (p?.name) {
      return `Hello ${p.name}! 👋 I'm Padharo AI, your personal Rajasthan guide.${p.interests?.length ? ` I see you're into **${p.interests.slice(0, 2).join('** & **')}** — I'll tailor every suggestion for you! 🎯` : ' How can I help plan your perfect trip?'}`
    }
    return "Namaste! 👋 I'm Padharo AI, your personal Rajasthan travel companion. Ask me anything — itineraries, forts, food, wildlife, or local tips."
  }

  // Handle initial message passed from home page quick chips
  useEffect(() => {
    const initialMsg = location.state?.initialMsg
    if (initialMsg && !initialMsgFired.current) {
      initialMsgFired.current = true
      const history = [{ from: 'bot', text: getGreeting(null) }]
      setMsgs(history)
      setView('chat')
      setTimeout(() => doSendMsg(initialMsg, history, null), 120)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  const doSendMsg = async (msg, history, profileOverride) => {
    const profile = profileOverride !== undefined ? profileOverride : (guestProfileRef.current || user)
    const newMsgs = [...history, { from: 'user', text: msg }]
    setMsgs(newMsgs)
    setTyping(true)
    try {
      const reply = await callAI(newMsgs, profile, appLanguageRef.current)
      setTyping(false)
      setMsgs(prev => [...prev, { from: 'bot', text: reply }])
    } catch (err) {
      setTyping(false)
      if (err.message === 'AI_NOT_CONFIGURED') {
        setMsgs(prev => [...prev, { from: 'bot', text: localFallback(msg, profile) }])
      } else {
        setMsgs(prev => [...prev, { from: 'bot', text: "I'm having trouble connecting right now. Please try again in a moment. 🔄" }])
      }
    }
  }

  const sendMsg = (text) => {
    const msg = (text || input).trim()
    if (!msg || typing) return
    setInput('')
    doSendMsg(msg, msgs, undefined)
  }

  const resetChat = () => {
    setMsgs([{ from: 'bot', text: getGreeting(null) }])
    setInput('')
  }

  const buildPersonalisedQuery = (f) => {
    const parts = []
    if (f.name) parts.push(`My name is ${f.name}.`)
    if (f.style) parts.push(`I'm travelling as a ${f.style}.`)
    if (f.fromCity) parts.push(`I'm coming from ${f.fromCity}.`)
    if (f.days) parts.push(`I have ${f.days} available.`)
    if (f.interests.length) parts.push(`My interests are: ${f.interests.join(', ')}.`)
    parts.push(`Based on my profile, give me a personalised Rajasthan experience — what to prioritise, best cities for me, local tips, and an ideal itinerary. Make it feel tailor-made!`)
    return parts.join(' ')
  }

  const startJourney = () => {
    const tempProfile = {
      name: form.name || undefined,
      travelStyle: form.style || undefined,
      interests: form.interests.length ? form.interests : undefined,
      homeCity: form.fromCity || undefined,
      days: form.days || undefined,
    }
    guestProfileRef.current = tempProfile
    const greeting = getGreeting(tempProfile)
    const history = [{ from: 'bot', text: greeting }]
    setMsgs(history)
    setView('chat')
    const query = buildPersonalisedQuery(form)
    setTimeout(() => doSendMsg(query, history, tempProfile), 120)
  }

  const skipToChat = () => {
    const history = [{ from: 'bot', text: getGreeting(null) }]
    setMsgs(history)
    setView('chat')
  }

  const toggleInterest = (label) => {
    setForm(p => ({
      ...p,
      interests: p.interests.includes(label)
        ? p.interests.filter(i => i !== label)
        : [...p.interests, label],
    }))
  }

  // ── ONBOARDING FORM view ──────────────────────────────────────────────────
  if (view === 'home') {
    const hasAnyInput = form.name || form.style || form.interests.length || form.fromCity || form.days

    return (
      <div className="app-shell">
        <StatusBar light />

        {/* Header */}
        <div style={{ background: 'var(--grad-hero)', padding: '14px 16px 20px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <div className="pattern-bg" style={{ opacity: 0.3 }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <button style={{ fontSize: 16, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate(-1)}>←</button>
              <LanguageSelector light />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '2px solid rgba(255,255,255,0.35)', position: 'relative', flexShrink: 0 }}>
                🤖
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 13, height: 13, background: '#10B981', border: '2px solid var(--primary)', borderRadius: '50%' }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>Padharo AI</div>
                <div style={{ fontSize: 10.5, opacity: 0.9, marginTop: 1 }}>Tell me about yourself — I'll personalise everything ✨</div>
              </div>
            </div>
          </div>
        </div>

        <div className="screen-scroll">
          <div className="content" style={{ paddingTop: 14 }}>

            {/* Intro note */}
            <div style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border: '1px solid #86EFAC', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <div style={{ fontSize: 11, color: '#14532D', lineHeight: 1.5, fontWeight: 600 }}>
                Takes just 20 seconds — your answers help me give you an <strong>instant personalised plan</strong> for Rajasthan, not a generic one.
              </div>
            </div>

            {/* Name */}
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 7 }}>👤 What should I call you? <span style={{ fontWeight: 500, color: 'var(--ink-mute)' }}>(optional)</span></div>
              <div className="input focused" style={{ gap: 8 }}>
                <span className="ic">🙏</span>
                <input
                  placeholder="e.g. Prashant"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  style={{ flex: 1 }}
                />
                {form.name && <span style={{ fontSize: 14, color: '#10B981' }}>✓</span>}
              </div>
            </div>

            {/* Travel style */}
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 7 }}>🧳 Travelling as...</div>
              <ChipSelect
                options={STYLE_OPTIONS}
                selected={form.style}
                onToggle={v => setForm(p => ({ ...p, style: p.style === v ? '' : v }))}
              />
            </div>

            {/* Interests */}
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 7 }}>
                ✨ I'm interested in... <span style={{ fontWeight: 500, color: 'var(--ink-mute)' }}>(pick any)</span>
              </div>
              <ChipSelect
                options={INTEREST_OPTIONS}
                selected={form.interests}
                onToggle={toggleInterest}
                multi
              />
            </div>

            {/* From city */}
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 7 }}>✈️ Coming from...</div>
              <ChipSelect
                options={FROM_CITIES}
                selected={form.fromCity}
                onToggle={v => setForm(p => ({ ...p, fromCity: p.fromCity === v ? '' : v }))}
              />
              <input
                placeholder="Or type your city..."
                value={FROM_CITIES.includes(form.fromCity) ? '' : form.fromCity}
                onChange={e => setForm(p => ({ ...p, fromCity: e.target.value }))}
                style={{ marginTop: 8, width: '100%', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: 'var(--ink)', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Days */}
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 7 }}>📅 How many days in Rajasthan?</div>
              <ChipSelect
                options={DAYS_OPTIONS}
                selected={form.days}
                onToggle={v => setForm(p => ({ ...p, days: p.days === v ? '' : v }))}
              />
            </div>

            {/* Profile summary preview */}
            {hasAnyInput && (
              <div style={{ background: 'linear-gradient(135deg,var(--primary-ghost),var(--soft))', border: '1px solid var(--primary-ghost)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 5 }}>🎯 Your profile so far:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {form.name && <span className="chip chip-primary" style={{ fontSize: 10 }}>👤 {form.name}</span>}
                  {form.style && <span className="chip chip-primary" style={{ fontSize: 10 }}>{STYLE_OPTIONS.find(s=>s.label===form.style)?.ico} {form.style}</span>}
                  {form.fromCity && <span className="chip chip-primary" style={{ fontSize: 10 }}>✈️ {form.fromCity}</span>}
                  {form.days && <span className="chip chip-primary" style={{ fontSize: 10 }}>📅 {form.days}</span>}
                  {form.interests.map(i => <span key={i} className="chip chip-neutral" style={{ fontSize: 10 }}>{INTEREST_OPTIONS.find(o=>o.label===i)?.ico} {i}</span>)}
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              className="btn-pri"
              onClick={startJourney}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, padding: '14px 0' }}
            >
              <span>🚀</span>
              <span>{hasAnyInput ? 'Start My Personalised Journey →' : 'Start My Rajasthan Journey →'}</span>
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={skipToChat}
                style={{ background: 'none', border: 'none', fontSize: 11.5, color: 'var(--ink-mute)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}
              >
                Skip & chat freely →
              </button>
            </div>

            <div style={{ height: 8 }} />
          </div>
        </div>
      </div>
    )
  }

  // ── CHAT view ─────────────────────────────────────────────────────────────
  const activeProfile = guestProfileRef.current || user
  return (
    <div className="app-shell">
      <StatusBar light />

      {/* Chat header */}
      <div style={{ background: 'var(--grad-hero)', padding: '10px 14px', color: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button style={{ fontSize: 18, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setView('home')}>←</button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, position: 'relative', flexShrink: 0 }}>
          🤖
          <span style={{ position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, background: '#10B981', border: '2px solid var(--primary)', borderRadius: '50%' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800 }}>Padharo AI</div>
          <div style={{ fontSize: 9.5, opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {typing ? '⚡ Thinking...' : activeProfile?.name ? `Personalised for ${activeProfile.name} · ${appLanguage}` : `● Online · ${appLanguage}`}
          </div>
        </div>
        <LanguageSelector light />
        <button
          onClick={resetChat}
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '5px 8px', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
        >↺ Reset</button>
      </div>

      {/* Profile bar — show if we have profile data */}
      {activeProfile && (activeProfile.travelStyle || activeProfile.interests?.length) && (
        <div style={{ background: 'var(--primary-ghost)', borderBottom: '1px solid var(--primary-ghost)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary-dark)', flexShrink: 0 }}>🎯</span>
          {activeProfile.travelStyle && (
            <span className="chip chip-primary" style={{ fontSize: 9.5, padding: '2px 7px', flexShrink: 0 }}>
              {STYLE_OPTIONS.find(s => s.label === activeProfile.travelStyle)?.ico || ''} {activeProfile.travelStyle}
            </span>
          )}
          {activeProfile.interests?.slice(0, 4).map(i => (
            <span key={i} className="chip chip-neutral" style={{ fontSize: 9.5, padding: '2px 7px', flexShrink: 0 }}>{i}</span>
          ))}
          {activeProfile.days && <span className="chip chip-neutral" style={{ fontSize: 9.5, padding: '2px 7px', flexShrink: 0 }}>📅 {activeProfile.days}</span>}
          <button onClick={() => setView('home')} style={{ marginLeft: 'auto', fontSize: 9.5, color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>Edit →</button>
        </div>
      )}

      <div className="screen-scroll" style={{ background: 'linear-gradient(180deg,var(--soft) 0%,var(--bg) 100%)', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-mute)', fontWeight: 600 }}>Today · Responding in {appLanguage}</div>

        {msgs.map((m, i) =>
          m.from === 'bot' ? (
            <div key={i} className="chat-msg-bot">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble-bot">
                <RenderText text={m.text} />
              </div>
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
