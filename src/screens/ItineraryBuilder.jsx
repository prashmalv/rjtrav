import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'

/* ── CROWD INTELLIGENCE ENGINE ──────────────────────────────────
   Real-world crowd data for Rajasthan destinations
   Used to auto-reroute itineraries around peak crowd days
──────────────────────────────────────────────────────────────── */
const CROWD_INTEL = {
  jaipur: {
    weekendCrowd: 'VERY HIGH',
    reason: 'Delhi-NCR day-trippers + Khatu Shyam pilgrims (Sikar side). Weekend footfall 3× weekday.',
    avoidDays: ['Saturday', 'Sunday'],
    alternativeFirst: 'pushkar',
    tip: 'Agar aap Delhi/NCR se aa rahe hain to Jaipur Saturday-Sunday avoid karein — Khatu Shyam Mandir (Sikar, 80km) ke visitors Jaipur hotels bhi fill kar dete hain. Pahle Pushkar visit karein (calm & beautiful), phir Jaipur weekday pe.',
  },
  pushkar: {
    weekendCrowd: 'MODERATE',
    reason: 'Religious town, manageable crowd. Special: Pushkar Camel Fair (Nov) — extreme rush.',
    avoidDays: [],
    tip: 'Pushkar weekdays pe bohot calm rehta hai. Brahma Mandir, Pushkar Lake, ghats — sab peaceful milega.',
  },
  udaipur: {
    weekendCrowd: 'HIGH',
    reason: 'Gujarat & Mumbai tourists. Weekend crowds at City Palace & Lake Pichola.',
    avoidDays: [],
    tip: 'Udaipur subah 7-9am pe visit karein — crowds dopahar baad zyada ho jaati hai.',
  },
  jaisalmer: {
    weekendCrowd: 'MODERATE',
    reason: 'Remote location keeps crowds low. Peak: Nov-Jan.',
    avoidDays: [],
    tip: 'Jaisalmer year-round accessible. Sam Sand Dunes sunset — must do!',
  },
  jodhpur: {
    weekendCrowd: 'MODERATE',
    reason: 'Manageable. Mehrangarh very busy 10am-3pm.',
    avoidDays: [],
    tip: 'Mehrangarh Fort ka best time — early morning 9am ya late evening 4pm ke baad.',
  },
  ranthambore: {
    weekendCrowd: 'VERY HIGH',
    reason: 'Safari slots book up months ahead on weekends.',
    avoidDays: ['Saturday', 'Sunday'],
    tip: 'Safari booking 60 days advance karein. Weekday safaris mein tiger sighting chance zyada hoti hai.',
  },
}

/* ── SMART ITINERARY GENERATOR ─────────────────────────────────*/
function generateItinerary({ fromCity, destinations, startDate, days, travelers, travelStyle }) {
  const date = new Date(startDate)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const startDay = dayNames[date.getDay()]
  const isWeekendStart = startDay === 'Saturday' || startDay === 'Sunday'

  const alerts = []
  const optimized = [...destinations]

  // SMART RULE 1: Delhi/NCR to Jaipur on weekend → suggest Pushkar first
  const fromNorth = ['Delhi', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad', 'Agra', 'Jaipur'].includes(fromCity)
  const hasJaipur = destinations.some(d => d.toLowerCase().includes('jaipur'))
  const hasPushkar = destinations.some(d => d.toLowerCase().includes('pushkar'))

  if (isWeekendStart && hasJaipur && fromNorth && !hasPushkar) {
    alerts.push({
      type: 'CROWD_REROUTE',
      icon: '🚦',
      color: '#EF4444',
      title: 'Weekend Rush Alert — Jaipur!',
      message: `${startDay} ko ${fromCity} se Jaipur directly jaana avoid karein! Khatu Shyam Mandir (Sikar, Jaipur se 80km) ki wajah se weekend pe Jaipur mein Delhi-NCR se bohot saare pilgrims & tourists aate hain — hotels full, traffic jam, attractions mein long queues.`,
      suggestion: '✅ AI Suggestion: Pahle din Pushkar jaiye (${fromCity} se ~4h, Jaipur se 145km). Pushkar weekend pe calm rehta hai — Brahma Mandir, sacred lake, camel fair market sab peaceful milega. Phir Monday ko Jaipur — weekday crowd 3× kam hoti hai, sab aaram se enjoy hoga!',
      saving: 'Expected wait time saving: 2-3 hours at Amber Fort & City Palace'
    })
    // Auto-insert Pushkar before Jaipur
    const jIdx = optimized.findIndex(d => d.toLowerCase().includes('jaipur'))
    optimized.splice(jIdx, 0, 'Pushkar')
  }

  // SMART RULE 2: Ranthambore weekend safari
  const hasRanthambore = destinations.some(d => d.toLowerCase().includes('ranthambore') || d.toLowerCase().includes('safari'))
  if (isWeekendStart && hasRanthambore) {
    alerts.push({
      type: 'BOOKING_ALERT',
      icon: '🐅',
      color: '#F59E0B',
      title: 'Safari Slot Alert!',
      message: 'Weekend safari slots Ranthambore mein typically 2-3 months pehle se book ho jaate hain.',
      suggestion: '✅ Hum abhi se booking request bhej sakte hain aapki dates ke liye.',
    })
  }

  // SMART RULE 3: November — Pushkar Camel Fair warning
  const isNovember = date.getMonth() === 10
  if (isNovember && hasPushkar) {
    alerts.push({
      type: 'FESTIVAL_ALERT',
      icon: '🐪',
      color: '#10B981',
      title: 'Pushkar Camel Fair — November!',
      message: 'November mein Pushkar Camel Fair hota hai — world-famous! Hotels 4-5× mehenge ho jaate hain.',
      suggestion: '✅ 3 months pehle book karein. Yeh experience lifetime mein ek baar dekhne wala hai!',
    })
  }

  // Generate day-by-day plan
  const itinerary = []
  let currentDate = new Date(date)
  let destIdx = 0
  const destList = optimized.length > 0 ? optimized : ['Jaipur']
  const daysPerDest = Math.max(1, Math.floor(parseInt(days) / destList.length))

  destList.forEach((dest, i) => {
    const daysHere = i === destList.length - 1 ? parseInt(days) - itinerary.length : daysPerDest
    const plan = CITY_PLANS[dest.toLowerCase()] || CITY_PLANS['jaipur']

    for (let d = 0; d < daysHere && itinerary.length < parseInt(days); d++) {
      const dayLabel = dayNames[currentDate.getDay()]
      const isCrowded = CROWD_INTEL[dest.toLowerCase()]?.avoidDays?.includes(dayLabel)
      itinerary.push({
        day: itinerary.length + 1,
        date: currentDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        city: dest,
        dayLabel,
        isCrowded,
        morning: plan.days[d % plan.days.length]?.morning || `Explore ${dest}`,
        afternoon: plan.days[d % plan.days.length]?.afternoon || `Local market & food`,
        evening: plan.days[d % plan.days.length]?.evening || `Cultural show`,
        stay: plan.hotels[travelStyle] || plan.hotels['Family'],
        tips: plan.days[d % plan.days.length]?.tip || '',
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return { itinerary, alerts, optimizedRoute: optimized }
}

const CITY_PLANS = {
  pushkar: {
    hotels: { Solo: 'Pink Floyd Hostel', Couple: 'Hotel Brahma Horizon', Family: 'Inn Seventh Heaven', Group: 'Pushkar Bagh Resort' },
    days: [
      { morning: '🌅 Pushkar Lake sunrise puja (5:30 AM) → Brahma Mandir darshan', afternoon: '🐪 Camel Safari at sunset point + local market', evening: '🌙 Ghat evening aarti + rooftop dinner', tip: 'Leather shoes mandir ke baas utaar dein — sacred area.' },
      { morning: '🏔 Savitri Temple trek (sunrise) → panoramic views', afternoon: '🛍 Pushkar bazaar — handmade jewellery, tie-dye fabric', evening: '🍽 Traditional Rajasthani thali at Raju Terrace Restaurant', tip: 'Non-veg & alcohol allowed nahi hai Pushkar mein.' },
    ]
  },
  jaipur: {
    hotels: { Solo: 'Zostel Jaipur', Couple: 'Treehouse Resort', Family: 'ITC Rajputana', Group: 'Jaipur Inn' },
    days: [
      { morning: '🏰 Amber Fort (9 AM sharp — queues kam) → Jal Mahal view', afternoon: '🏛 City Palace + Jantar Mantar', evening: '🌆 Hawa Mahal sunset + MI Road dinner', tip: 'Amber Fort: online tickets booking saves 30 min queue.' },
      { morning: '🎨 Albert Hall Museum + Rose Garden', afternoon: '🛍 Johari Bazaar — gems, Rajasthani jewellery', evening: '🎭 Chokhi Dhani — folk show + traditional dinner', tip: 'Ola/Uber instead of autos — prices fixed.' },
    ]
  },
  udaipur: {
    hotels: { Solo: 'Zostel Udaipur', Couple: 'Amet Haveli', Family: 'Trident Udaipur', Group: 'Moustache Hostel' },
    days: [
      { morning: '🏛 City Palace (7:30 AM — before tourist rush)', afternoon: '⛵ Lake Pichola boat ride → Jag Mandir island', evening: '🌅 Sajjangarh (Monsoon Palace) sunset', tip: 'Vintage Car Museum — worth 1 hour detour.' },
      { morning: '🎨 Jagdish Temple + local market', afternoon: '🏊 Saheliyon ki Bari + Fateh Sagar Lake', evening: '🎭 Dharohar Folk Dance Show at Bagore ki Haveli', tip: 'Rickshaw wale negotiate karte hain — auto better.' },
    ]
  },
  jaisalmer: {
    hotels: { Solo: 'Moustache Jaisalmer', Couple: 'Suryagarh Palace', Family: 'Hotel Nachana Haveli', Group: 'The Silk Route' },
    days: [
      { morning: '🌟 Golden Fort walk (7 AM — golden light best)', afternoon: '🕌 Patwon ki Haveli + Jain temples', evening: '🛍 Sadar Bazaar — mirror work, camel leather goods', tip: 'Fort mein rehna unique experience — local families ke guesthouses available.' },
      { morning: '🐪 Sam Sand Dunes — camel safari (sunrise best)', afternoon: '🏕 Desert camp lunch', evening: '🌌 Desert night — campfire + folk music + stargazing', tip: 'Nov-Jan best season. April-Aug extreme heat.' },
    ]
  },
  jodhpur: {
    hotels: { Solo: 'Krishna Prakash Heritage', Couple: 'Raas Jodhpur', Family: 'Vivanta Jodhpur', Group: 'Moustache Hostel' },
    days: [
      { morning: '🗼 Mehrangarh Fort (9 AM — before tour groups)', afternoon: '💙 Blue City walk — Clock Tower bazaar', evening: '🍽 Indique rooftop dinner — fort view + makhaniya lassi!', tip: 'Blue houses wale mohalle mein guide lena — stories amazing hain.' },
      { morning: '⛪ Jaswant Thada + Umaid Bhawan', afternoon: '🛍 Sardar Market — spices, handicrafts', evening: '🎵 Bishnoi village safari — sunset at local village', tip: 'Sardar Market evening ke baad band — dopahar jaiye.' },
    ]
  },
  ranthambore: {
    hotels: { Solo: 'Ranthambore Forest Resort', Couple: 'Ranthambore Regency', Family: 'Oberoi Vanyavilas', Group: 'Tiger Safari Resort' },
    days: [
      { morning: '🐅 Zone 1-3 dawn safari (6 AM sharp)', afternoon: '🏰 Ranthambore Fort (inside national park!)', evening: '📸 Wildlife photography at watering holes', tip: 'Zone 1,2,3 best for tiger sighting. Gypsy > Canter for experience.' },
    ]
  },
}

const RJ_CITIES = ['Jaipur', 'Pushkar', 'Udaipur', 'Jaisalmer', 'Jodhpur', 'Ranthambore', 'Ajmer', 'Bundi', 'Bikaner', 'Mount Abu']
const FROM_CITIES = ['Delhi', 'Gurugram', 'Noida', 'Mumbai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Kolkata', 'Pune', 'Agra', 'Chennai']

export default function ItineraryBuilder() {
  const navigate = useNavigate()
  const { user, showToast } = useApp()
  const [step, setStep] = useState(1) // 1=form, 2=generating, 3=result
  const [form, setForm] = useState({
    fromCity: user?.homeCity || 'Delhi',
    destinations: ['Jaipur'],
    startDate: '',
    days: '5',
    travelers: '2',
    travelStyle: user?.travelStyle || 'Family',
    budget: 'moderate',
  })
  const [result, setResult] = useState(null)
  const [expandedDay, setExpandedDay] = useState(null)

  const toggleDest = (city) => {
    setForm(f => ({
      ...f,
      destinations: f.destinations.includes(city)
        ? f.destinations.filter(d => d !== city)
        : [...f.destinations, city]
    }))
  }

  const handleGenerate = () => {
    if (!form.startDate) { showToast('Please select travel date'); return }
    if (form.destinations.length === 0) { showToast('Select at least one destination'); return }
    setStep(2)
    setTimeout(() => {
      const res = generateItinerary(form)
      setResult(res)
      setStep(3)
    }, 2200)
  }

  return (
    <div className="app-shell">
      <StatusBar light />
      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '12px 16px 16px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.25 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <button style={{ fontSize: 20, color: '#fff', background: 'none' }} onClick={() => step === 3 ? setStep(1) : navigate(-1)}>←</button>
            <span className="chip chip-white">🤖 AI Crowd Intelligence</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 800 }}>AI Itinerary Builder</div>
          <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>Smart planning — crowds avoid karke best experience!</div>
        </div>
      </div>

      {/* STEP 1 — Input Form */}
      {step === 1 && (
        <div className="screen-scroll">
          <div className="content">
            <div className="grid-2">
              <div className="fld">
                <label>Travelling From</label>
                <div className="input">
                  <span className="ic">🏙️</span>
                  <select style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }}
                    value={form.fromCity} onChange={e => setForm(f => ({ ...f, fromCity: e.target.value }))}>
                    {FROM_CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="fld">
                <label>Trip Days</label>
                <div className="input">
                  <span className="ic">📅</span>
                  <select style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }}
                    value={form.days} onChange={e => setForm(f => ({ ...f, days: e.target.value }))}>
                    {['3', '4', '5', '6', '7', '8', '10', '14'].map(d => <option key={d}>{d} Days</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="fld">
                <label>Start Date</label>
                <div className="input focused">
                  <span className="ic">📆</span>
                  <input type="date" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }}
                    value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="fld">
                <label>Travelers</label>
                <div className="input">
                  <span className="ic">👥</span>
                  <select style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }}
                    value={form.travelers} onChange={e => setForm(f => ({ ...f, travelers: e.target.value }))}>
                    {['1', '2', '3', '4', '5', '6+'].map(t => <option key={t}>{t} {t === '1' ? 'Person' : 'People'}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Destination picker */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Destinations <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 500 }}>(select all you want)</span></div>
              <div className="grid-2">
                {RJ_CITIES.map(city => {
                  const intel = CROWD_INTEL[city.toLowerCase()]
                  const sel = form.destinations.includes(city)
                  return (
                    <div key={city} onClick={() => toggleDest(city)} style={{
                      background: sel ? 'linear-gradient(135deg,var(--primary-ghost),var(--soft))' : 'var(--surface)',
                      border: `${sel ? 2 : 1}px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ fontSize: 14 }}>
                        {city === 'Jaipur' ? '🏰' : city === 'Pushkar' ? '🕍' : city === 'Udaipur' ? '⛵' : city === 'Jaisalmer' ? '🌟' : city === 'Jodhpur' ? '💙' : city === 'Ranthambore' ? '🐅' : city === 'Ajmer' ? '🕌' : '🏙️'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: sel ? 'var(--primary-dark)' : 'var(--ink)' }}>{city}</div>
                        {intel && <div style={{ fontSize: 9, color: intel.weekendCrowd === 'VERY HIGH' ? '#EF4444' : intel.weekendCrowd === 'HIGH' ? '#F59E0B' : '#10B981', fontWeight: 700 }}>
                          Weekend: {intel.weekendCrowd}
                        </div>}
                      </div>
                      {sel && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="fld">
              <label>Budget Preference</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['budget', '💰 Budget', '< ₹2K/day'], ['moderate', '✨ Moderate', '₹2–5K/day'], ['luxury', '👑 Luxury', '₹5K+/day']].map(([val, lbl, sub]) => (
                  <div key={val} onClick={() => setForm(f => ({ ...f, budget: val }))} style={{
                    flex: 1, padding: '10px 8px', textAlign: 'center', borderRadius: 10, cursor: 'pointer',
                    background: form.budget === val ? 'linear-gradient(135deg,var(--primary-ghost),var(--soft))' : 'var(--surface)',
                    border: `${form.budget === val ? 2 : 1}px solid ${form.budget === val ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
                    <div style={{ fontSize: 13 }}>{lbl}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--ink-mute)', marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekend warning preview */}
            {form.startDate && (() => {
              const d = new Date(form.startDate)
              const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]
              const isWeekend = day === 'Saturday' || day === 'Sunday'
              const hasJaipur = form.destinations.includes('Jaipur')
              if (isWeekend && hasJaipur && ['Delhi', 'Gurugram', 'Noida'].includes(form.fromCity)) {
                return (
                  <div style={{ background: '#FEF2F2', border: '1.5px solid #EF4444', borderRadius: 12, padding: 12, display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#991B1B' }}>Weekend Rush Detected!</div>
                      <div style={{ fontSize: 11, color: '#7F1D1D', lineHeight: 1.5, marginTop: 2 }}>
                        {day} ko Jaipur mein Khatu Shyam pilgrims ki wajah se bohot rush hoga. AI best route suggest karega!
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })()}

            <button className="btn-pri" onClick={handleGenerate} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              🤖 Generate Smart Itinerary
            </button>
            <div style={{ height: 8 }} />
          </div>
        </div>
      )}

      {/* STEP 2 — Generating */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: 'var(--shadow-2)', animation: 'fabPulse 1.5s infinite' }}>🤖</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>AI Planning Your Trip...</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>Checking crowd data, events & best routes</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {['Analysing crowd data for selected dates...', 'Checking festivals & events...', 'Optimising route for best experience...', 'Building day-by-day plan...'].map((msg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', animation: `fadeIn 0.3s ease ${i * 0.4}s both` }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 — Result */}
      {step === 3 && result && (
        <div className="screen-scroll">
          <div className="content">
            {/* Summary */}
            <div style={{ background: 'var(--grad-hero)', borderRadius: 14, padding: 14, color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div className="pattern-bg" style={{ opacity: 0.2 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 4 }}>AI Generated Itinerary</div>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{form.days} Days · {result.optimizedRoute.join(' → ')}</div>
                <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>From {form.fromCity} · {form.travelers} traveler{form.travelers > 1 ? 's' : ''} · Starting {new Date(form.startDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
              </div>
            </div>

            {/* AI ALERTS */}
            {result.alerts.length > 0 && result.alerts.map((alert, i) => (
              <div key={i} style={{ background: alert.type === 'CROWD_REROUTE' ? '#FEF2F2' : alert.type === 'FESTIVAL_ALERT' ? '#F0FDF4' : '#FFFBEB', border: `1.5px solid ${alert.color}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{alert.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: alert.type === 'CROWD_REROUTE' ? '#991B1B' : '#065F46', marginBottom: 5 }}>{alert.title}</div>
                    <div style={{ fontSize: 11.5, lineHeight: 1.6, color: '#374151', marginBottom: 8 }}>{alert.message}</div>
                    <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '8px 10px', fontSize: 11.5, lineHeight: 1.6, fontWeight: 600, color: '#065F46', borderLeft: `3px solid ${alert.color}` }}>
                      {alert.suggestion.replace('${fromCity}', form.fromCity)}
                    </div>
                    {alert.saving && <div style={{ fontSize: 10.5, color: '#10B981', fontWeight: 700, marginTop: 6 }}>⏱ {alert.saving}</div>}
                  </div>
                </div>
              </div>
            ))}

            {/* Optimised route */}
            {result.alerts.some(a => a.type === 'CROWD_REROUTE') && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                <div className="bold" style={{ fontSize: 12, marginBottom: 8 }}>🗺 AI Optimised Route</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11.5, color: 'var(--ink-mute)', fontWeight: 600 }}>{form.fromCity}</span>
                  {result.optimizedRoute.map((city, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>→</span>
                      <span style={{ background: 'var(--primary-ghost)', color: 'var(--primary-dark)', padding: '3px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 700 }}>{city}</span>
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 6 }}>vs original: {form.fromCity} → {form.destinations.join(' → ')}</div>
              </div>
            )}

            {/* Day-by-day plan */}
            <div>
              <div className="bold" style={{ fontSize: 13, marginBottom: 8 }}>📅 Day-by-Day Plan</div>
              {result.itinerary.map((day, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${day.isCrowded ? '#EF4444' : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: day.isCrowded ? '#FEF2F2' : 'var(--soft)', cursor: 'pointer' }} onClick={() => setExpandedDay(expandedDay === i ? null : i)}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: day.isCrowded ? '#EF4444' : 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                      {day.day}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)' }}>{day.date} · {day.city}</div>
                      <div style={{ fontSize: 10.5, color: day.isCrowded ? '#EF4444' : 'var(--ink-mute)', fontWeight: 600 }}>{day.isCrowded ? '⚠️ High crowd expected' : `${day.dayLabel} · ${day.stay}`}</div>
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--ink-mute)' }}>{expandedDay === i ? '▲' : '▼'}</span>
                  </div>

                  {expandedDay === i && (
                    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[['🌅 Morning', day.morning], ['☀️ Afternoon', day.afternoon], ['🌙 Evening', day.evening]].map(([label, plan]) => (
                        <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)', width: 70, flexShrink: 0 }}>{label}</span>
                          <span style={{ fontSize: 11.5, color: 'var(--ink)', lineHeight: 1.5 }}>{plan}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)', width: 70, flexShrink: 0 }}>🏨 Stay</span>
                          <span style={{ fontSize: 11.5, color: 'var(--ink)' }}>{day.stay}</span>
                        </div>
                      </div>
                      {day.tips && (
                        <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--accent-dark)', lineHeight: 1.5 }}>
                          💡 {day.tips}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Cost estimate */}
            <div className="surface" style={{ padding: 12 }}>
              <div className="bold" style={{ fontSize: 12, marginBottom: 8 }}>💰 Estimated Budget ({form.budget})</div>
              {[
                ['Hotels', form.budget === 'budget' ? '₹800–1,200/night' : form.budget === 'moderate' ? '₹2,500–4,000/night' : '₹8,000+/night'],
                ['Transport', form.budget === 'budget' ? '₹300–500/day' : form.budget === 'moderate' ? '₹800–1,200/day' : '₹2,000+/day'],
                ['Food', form.budget === 'budget' ? '₹300–500/day' : form.budget === 'moderate' ? '₹600–1,000/day' : '₹1,500+/day'],
                ['Entry & Activities', '₹200–800/day'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '3px 0' }}>
                  <span style={{ color: 'var(--ink-mute)' }}>{label}</span>
                  <span className="bold">{val}</span>
                </div>
              ))}
            </div>

            <div className="grid-2">
              <button className="btn-sec" style={{ fontSize: 12 }} onClick={() => setStep(1)}>← Modify</button>
              <button className="btn-pri" style={{ fontSize: 12 }} onClick={() => showToast('Itinerary saved! ✓ Check My Trips')}>💾 Save Itinerary</button>
            </div>
            <button className="btn-gold" style={{ display: 'block', textAlign: 'center', fontSize: 13 }} onClick={() => navigate('/packages')}>
              📦 Book This as Package →
            </button>
            <div style={{ height: 8 }} />
          </div>
        </div>
      )}

      {step !== 2 && <BottomNav />}
    </div>
  )
}
