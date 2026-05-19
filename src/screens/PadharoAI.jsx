import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'
import NearbySearch from '../components/NearbySearch'

const INTEREST_OPTIONS = [
  { ico: '🏰', label: 'Forts & Palaces' },
  { ico: '🐅', label: 'Wildlife' },
  { ico: '🏜', label: 'Desert & Dunes' },
  { ico: '🍽', label: 'Food & Cuisine' },
  { ico: '📸', label: 'Photography' },
  { ico: '🛍', label: 'Shopping' },
  { ico: '⛵', label: 'Lakes & Nature' },
  { ico: '🧘', label: 'Wellness & Culture' },
  { ico: '🛕', label: 'Religious Places' },
  { ico: '🏛', label: 'UNESCO Heritage' },
]

const FROM_CITIES = ['Delhi / NCR', 'Mumbai', 'Bengaluru', 'International']

const DAYS_OPTIONS = ['1–2 Days', '3–4 Days', '5–7 Days', '7+ Days']

const STYLE_OPTIONS = [
  { label: 'Solo', ico: '🧍' },
  { label: 'Couple', ico: '👫' },
  { label: 'Family', ico: '👨‍👩‍👧' },
  { label: 'Group', ico: '👥' },
]

const GEO_SITES = [
  { name: 'Amber Fort', city: 'Jaipur', emoji: '🏰' },
  { name: 'Hawa Mahal', city: 'Jaipur', emoji: '🏯' },
  { name: 'Jantar Mantar', city: 'Jaipur', emoji: '🔭' },
  { name: 'City Palace', city: 'Udaipur', emoji: '🏛' },
  { name: 'Lake Pichola', city: 'Udaipur', emoji: '⛵' },
  { name: 'Mehrangarh Fort', city: 'Jodhpur', emoji: '🏰' },
  { name: 'Jaisalmer Fort', city: 'Jaisalmer', emoji: '🏜' },
  { name: 'Sam Sand Dunes', city: 'Jaisalmer', emoji: '🐪' },
  { name: 'Ranthambore Fort', city: 'Sawai Madhopur', emoji: '🐅' },
  { name: 'Brahma Temple', city: 'Pushkar', emoji: '🛕' },
  { name: 'Dilwara Temples', city: 'Mount Abu', emoji: '🛕' },
  { name: 'Keoladeo Bird Sanctuary', city: 'Bharatpur', emoji: '🦅' },
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

function inline(text) {
  const regex = /(\*\*[^*]+\*\*|https?:\/\/[^\s\)\]>\"]+)/g
  const parts = []
  let last = 0, match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ t: 'text', v: text.slice(last, match.index) })
    const m = match[0]
    if (m.startsWith('**')) parts.push({ t: 'bold', v: m.slice(2, -2) })
    else parts.push({ t: 'link', v: m })
    last = match.index + m.length
  }
  if (last < text.length) parts.push({ t: 'text', v: text.slice(last) })
  return parts.map((p, i) => {
    if (p.t === 'bold') return <strong key={i}>{p.v}</strong>
    if (p.t === 'link') return (
      <a key={i} href={p.v} target="_blank" rel="noopener noreferrer"
        style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline', wordBreak: 'break-all' }}>
        {p.v}
      </a>
    )
    return <span key={i}>{p.v}</span>
  })
}

function TableBlock({ lines }) {
  const dataLines = lines.filter(l => !/^\|[\s\-:|]+\|/.test(l))
  if (!dataLines.length) return null
  const parse = l => l.split('|').slice(1, -1).map(c => c.trim())
  const [head, ...rows] = dataLines
  const headers = parse(head)
  return (
    <div style={{ overflowX: 'auto', margin: '8px 0', borderRadius: 10, border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
        <thead>
          <tr style={{ background: 'var(--primary-ghost)' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '7px 10px', textAlign: 'left', fontWeight: 800, color: 'var(--primary-dark)', borderBottom: '1.5px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : 'var(--soft)', borderBottom: '1px solid var(--soft)' }}>
              {parse(row).map((cell, ci) => (
                <td key={ci} style={{ padding: '6px 10px', color: 'var(--ink-soft)', verticalAlign: 'top' }}>{inline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RenderText({ text }) {
  const lines = text.split('\n')
  const elements = []
  let tableLines = []

  const flushTable = (key) => {
    if (tableLines.length) {
      elements.push(<TableBlock key={`tbl-${key}`} lines={tableLines} />)
      tableLines = []
    }
  }

  lines.forEach((line, li) => {
    if (/^\|/.test(line.trim())) {
      tableLines.push(line)
      return
    }
    flushTable(li)

    if (/^### /.test(line)) {
      elements.push(<div key={li} style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary-dark)', marginTop: 10, marginBottom: 2 }}>{inline(line.slice(4))}</div>)
    } else if (/^## /.test(line)) {
      elements.push(<div key={li} style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--ink)', marginTop: 12, marginBottom: 3, borderBottom: '1.5px solid var(--soft)', paddingBottom: 3 }}>{inline(line.slice(3))}</div>)
    } else if (/^# /.test(line)) {
      elements.push(<div key={li} style={{ fontSize: 15, fontWeight: 900, color: 'var(--primary)', marginTop: 14, marginBottom: 4 }}>{inline(line.slice(2))}</div>)
    } else if (/^[•\-\*] /.test(line)) {
      elements.push(
        <div key={li} style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--primary)', fontSize: 9, marginTop: 4, flexShrink: 0 }}>●</span>
          <span style={{ flex: 1 }}>{inline(line.slice(2))}</span>
        </div>
      )
    } else if (/^\d+\. /.test(line)) {
      const dot = line.indexOf('. ')
      const num = line.slice(0, dot)
      const rest = line.slice(dot + 2)
      elements.push(
        <div key={li} style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 11, flexShrink: 0, minWidth: 16 }}>{num}.</span>
          <span style={{ flex: 1 }}>{inline(rest)}</span>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={li} style={{ height: 6 }} />)
    } else {
      elements.push(<div key={li}>{inline(line)}</div>)
    }
  })

  flushTable('end')

  return <div style={{ lineHeight: 1.65, fontSize: 13 }}>{elements}</div>
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
  const [isListening, setIsListening] = useState(false)
  const [geoSite, setGeoSite] = useState(null)
  const [showGeoSheet, setShowGeoSheet] = useState(false)
  const guestProfileRef = useRef(null)
  const appLanguageRef = useRef(appLanguage)
  const initialMsgFired = useRef(false)
  const recognitionRef = useRef(null)
  useEffect(() => { appLanguageRef.current = appLanguage }, [appLanguage])

  const VOICE_LANG_MAP = {
    Hindi: 'hi-IN', German: 'de-DE', French: 'fr-FR',
    Japanese: 'ja-JP', Spanish: 'es-ES', English: 'en-IN',
  }

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Voice input is not supported in this browser. Try Chrome on Android/desktop.')
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const rec = new SR()
    rec.lang = VOICE_LANG_MAP[appLanguage] || 'en-IN'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(prev => (prev ? prev + ' ' : '') + transcript)
      setIsListening(false)
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    recognitionRef.current = rec
    rec.start()
    setIsListening(true)
  }

  const bottomRef = useRef(null)

  const getGreeting = (profile) => {
    const p = profile || guestProfileRef.current || user
    if (p?.name) {
      return `Hello ${p.name}! 👋 I'm Rajwada AI, your personal Rajasthan guide.${p.interests?.length ? ` I see you're into **${p.interests.slice(0, 2).join('** & **')}** — I'll tailor every suggestion for you! 🎯` : ' How can I help plan your perfect trip?'}`
    }
    return "Khamma Ghani! 🙏 I'm Rajwada AI, your personal Rajasthan travel companion. Ask me anything — itineraries, forts, food, wildlife, or local tips."
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

  const handleGeoSelect = (site) => {
    setGeoSite(site)
    setShowGeoSheet(false)
    const profile = guestProfileRef.current || user
    const profileCtx = profile ? [
      profile.travelStyle && `I'm a ${profile.travelStyle} traveller.`,
      profile.interests?.length && `My interests are: ${profile.interests.join(', ')}.`,
      profile.homeCity && `I've travelled here from ${profile.homeCity}.`,
    ].filter(Boolean).join(' ') : ''
    const prompt = `I'm currently standing at ${site.name} in ${site.city}, Rajasthan. ${profileCtx} Act as my personal audio guide — tell me the fascinating history, legends, must-see highlights, and practical visitor tips for right now.`
    doSendMsg(prompt, msgs, undefined)
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
                <div style={{ fontSize: 16, fontWeight: 800 }}>Rajwada AI</div>
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
          <div style={{ fontSize: 13.5, fontWeight: 800 }}>Rajwada AI</div>
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

      {/* Geo storytelling banner — manual site picker, no GPS required */}
      <div
        onClick={() => setShowGeoSheet(true)}
        style={{ background: 'linear-gradient(90deg,#0D1B2E,#1E3A5F)', borderBottom: '1px solid #2D4A6E', padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', flexShrink: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 13 }}>📍</span>
          <span style={{ fontSize: 10.5, color: geoSite ? '#93C5FD' : '#64748B', fontWeight: 700 }}>
            {geoSite ? `${geoSite.emoji} ${geoSite.name}, ${geoSite.city}` : 'Select your current heritage site for audio guide'}
          </span>
        </div>
        <span style={{ fontSize: 10, color: '#3B82F6', fontWeight: 700, flexShrink: 0 }}>
          {geoSite ? 'Change →' : 'Tap →'}
        </span>
      </div>

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

      <NearbySearch bottomOffset={72} />

      <div className="chat-input-bar">
        <button
          onClick={toggleVoice}
          title={isListening ? 'Stop listening' : 'Speak your question'}
          style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0, border: 'none', cursor: 'pointer',
            background: isListening ? '#EF4444' : 'var(--soft)',
            color: isListening ? '#fff' : 'var(--ink-mute)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            animation: isListening ? 'pulse 1s ease-in-out infinite' : 'none',
            transition: 'background 0.2s',
          }}
        >🎤</button>
        <input
          className="chat-input"
          placeholder={isListening ? '🎤 Listening...' : `Ask in ${appLanguage}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
        />
        <button
          style={{ width: 36, height: 36, borderRadius: '50%', background: input ? 'var(--primary)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: input ? '#fff' : 'var(--ink-mute)', flexShrink: 0, border: 'none', cursor: 'pointer' }}
          onClick={() => sendMsg()}
        >→</button>
      </div>

      {/* Geo site selection sheet — manual picker, no GPS required */}
      {showGeoSheet && (
        <div
          style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 420, background: 'rgba(0,0,0,0.65)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          onClick={() => setShowGeoSheet(false)}
        >
          <div
            style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '18px 18px 0 0', padding: '16px 16px 28px', maxHeight: '68vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#E2E8F0' }}>📍 Where are you right now?</div>
              <button onClick={() => setShowGeoSheet(false)} style={{ background: '#334155', border: 'none', borderRadius: 6, padding: '4px 9px', color: '#94A3B8', fontSize: 11, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ fontSize: 10.5, color: '#64748B', marginBottom: 14, lineHeight: 1.5 }}>
              Select your current site — Rajwada AI will narrate its history, legends &amp; tips for you. No GPS needed.
              {(guestProfileRef.current?.homeCity || user?.homeCity) && (
                <span style={{ color: '#93C5FD' }}> Your profile ({guestProfileRef.current?.homeCity || user?.homeCity}) will be included in the context.</span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GEO_SITES.map(site => (
                <button
                  key={site.name}
                  onClick={() => handleGeoSelect(site)}
                  style={{
                    padding: '8px 12px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                    border: geoSite?.name === site.name ? '1.5px solid #3B82F6' : '1.5px solid #334155',
                    background: geoSite?.name === site.name ? '#1E3A5F' : '#1E293B',
                    color: geoSite?.name === site.name ? '#93C5FD' : '#94A3B8',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <span>{site.emoji}</span>
                  <span>{site.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
