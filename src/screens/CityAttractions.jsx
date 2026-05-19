import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

const CITIES = [
  { code: 'jaipur',    name: 'Jaipur',    emoji: '🏰', tagline: 'The Pink City' },
  { code: 'udaipur',   name: 'Udaipur',   emoji: '⛵', tagline: 'City of Lakes' },
  { code: 'jodhpur',   name: 'Jodhpur',   emoji: '🏯', tagline: 'The Blue City' },
  { code: 'jaisalmer', name: 'Jaisalmer', emoji: '🏜', tagline: 'The Golden City' },
  { code: 'pushkar',   name: 'Pushkar',   emoji: '🛕', tagline: 'Holy Lake Town' },
]

const DATA = {
  jaipur: {
    mustVisit: [
      { name: 'Amber Fort', fee: '₹100 / ₹500', hours: '8 AM – 5:30 PM', type: 'outdoor', tag: 'UNESCO',
        note: 'Elephant ride climb available 8–10 AM. Light & Sound show in evening (₹200).' },
      { name: 'Hawa Mahal', fee: '₹50 / ₹200', hours: '9 AM – 4:30 PM', type: 'outdoor', tag: 'Iconic',
        note: '953-window palace. Best photo from Wind View Café opposite.' },
      { name: 'City Palace Jaipur', fee: '₹200 / ₹700', hours: '9:30 AM – 5 PM', type: 'indoor', tag: 'Museum',
        note: 'Royal Mubarak Mahal museum, weapons gallery, Pritam Niwas Chowk.' },
      { name: 'Jantar Mantar', fee: '₹50 / ₹200', hours: '9 AM – 4:30 PM', type: 'outdoor', tag: 'UNESCO',
        note: 'World\'s largest stone astronomical observatory. 1-hour guided tour recommended.' },
      { name: 'Albert Hall Museum', fee: '₹40 / ₹300', hours: '9 AM – 5 PM', type: 'indoor', tag: 'Museum',
        note: 'Rajasthan\'s oldest museum. Free on Rajasthan Day (Mar 30).' },
    ],
    activities: [
      { name: 'Block printing workshop · Sanganer', type: 'indoor', price: '₹800/person', icon: '🎨' },
      { name: 'Royal high tea · Rambagh Palace', type: 'indoor', price: '₹2,200/person', icon: '🫖' },
      { name: 'Hot air balloon ride over Amber', type: 'outdoor', price: '₹12,500/person', icon: '🎈' },
      { name: 'Heritage walk · Walled Pink City', type: 'outdoor', price: '₹600/person', icon: '🚶' },
      { name: 'Cooking class · Rajasthani thali', type: 'indoor', price: '₹1,800/person', icon: '🍳' },
    ],
    events: [
      { name: 'IPL · Rajasthan Royals vs CSK', date: '24 May 2026', venue: 'Sawai Mansingh Stadium', price: '₹950–8,500', booking: 'https://in.bookmyshow.com/sports/ipl' },
      { name: 'Arijit Singh Live in Concert', date: '7 Jun 2026', venue: 'JECC Sitapura', price: '₹1,500–9,000', booking: 'https://in.bookmyshow.com/events' },
      { name: 'Jaipur Literature Festival (Spring)', date: '14–16 Jun 2026', venue: 'Diggi Palace', price: 'Free entry', booking: 'https://jaipurliteraturefestival.org' },
      { name: 'Now playing · Kalki 2 (Hindi)', date: 'Running', venue: 'INOX, PVR, Raj Mandir', price: '₹180–450', booking: 'https://in.bookmyshow.com/jaipur/movies' },
    ],
  },
  udaipur: {
    mustVisit: [
      { name: 'City Palace Udaipur', fee: '₹300 / ₹600', hours: '9:30 AM – 5:30 PM', type: 'indoor', tag: 'Royal',
        note: 'Mewar dynasty\'s grand palace on Lake Pichola. Crystal Gallery extra ₹500.' },
      { name: 'Lake Pichola boat ride', fee: '₹500 / ₹950', hours: 'Sunset slot 4–6 PM', type: 'outdoor', tag: 'Iconic',
        note: 'Sunset boat ride stops at Jagmandir Island Palace.' },
      { name: 'Sajjangarh (Monsoon Palace)', fee: '₹100 / ₹300', hours: '9 AM – 6 PM', type: 'outdoor', tag: 'Sunset',
        note: 'Best sunset view of Udaipur. 5 km hilltop drive.' },
      { name: 'Jagdish Temple', fee: 'Free', hours: '4:30 AM – 1 PM, 5–8 PM', type: 'indoor', tag: 'Spiritual',
        note: '17th-century Vishnu temple. Aarti at 7 PM is mesmerising.' },
    ],
    activities: [
      { name: 'Vintage car museum · City Palace', type: 'indoor', price: '₹250/person', icon: '🚗' },
      { name: 'Bagore-ki-Haveli Folk show', type: 'indoor', price: '₹150/person', icon: '🎭' },
      { name: 'Aravalli sunset trek · Bahubali Hills', type: 'outdoor', price: '₹0 (self) / ₹500 guided', icon: '🥾' },
      { name: 'Miniature painting class', type: 'indoor', price: '₹1,200/person', icon: '🖌' },
    ],
    events: [
      { name: 'Sufi Night · Manganiyar Seduction', date: '31 May 2026', venue: 'Shilpgram', price: '₹800–3,500', booking: 'https://in.bookmyshow.com/events' },
      { name: 'Mewar Festival 2026', date: '20–22 Apr 2026 (next: 2027)', venue: 'Gangaur Ghat', price: 'Free entry', booking: 'https://tourism.rajasthan.gov.in' },
      { name: 'Now playing · Dune: Part Three', date: 'Running', venue: 'INOX Celebration Mall', price: '₹220–500', booking: 'https://in.bookmyshow.com/udaipur/movies' },
    ],
  },
  jodhpur: {
    mustVisit: [
      { name: 'Mehrangarh Fort', fee: '₹100 / ₹600', hours: '9 AM – 5 PM', type: 'outdoor', tag: 'Iconic',
        note: 'Audio guide included. Zip-line ₹1,800 extra. Best views of Blue City.' },
      { name: 'Jaswant Thada', fee: '₹30 / ₹50', hours: '9 AM – 5 PM', type: 'outdoor', tag: 'Heritage',
        note: 'White marble cenotaph 1 km from Mehrangarh. Quick 30-min visit.' },
      { name: 'Umaid Bhawan Palace Museum', fee: '₹100 / ₹400', hours: '9 AM – 5 PM', type: 'indoor', tag: 'Royal',
        note: 'Still partly royal residence. Vintage car collection.' },
      { name: 'Old Blue City walk · Brahmpuri', fee: 'Free', hours: 'Anytime (morning best)', type: 'outdoor', tag: 'Photo',
        note: 'Get lost in indigo-painted lanes. Hire local guide ₹500.' },
    ],
    activities: [
      { name: 'Mehrangarh zip-line · Flying Fox', type: 'outdoor', price: '₹1,800/person', icon: '🪂' },
      { name: 'Spice market tour · Sardar Market', type: 'outdoor', price: '₹400/person', icon: '🌶' },
      { name: 'Mirchi bada cooking class', type: 'indoor', price: '₹900/person', icon: '🍳' },
    ],
    events: [
      { name: 'Rajasthan International Folk Fest', date: '15–19 Oct 2026', venue: 'Mehrangarh Fort', price: '₹2,500–9,000', booking: 'https://jodhpurriff.org' },
      { name: 'Marwar Festival 2026', date: '3–4 Oct 2026', venue: 'Umaid Bhawan grounds', price: 'Free', booking: 'https://tourism.rajasthan.gov.in' },
      { name: 'Now playing · Latest Bollywood', date: 'Running', venue: 'Ansal Plaza INOX', price: '₹180–400', booking: 'https://in.bookmyshow.com/jodhpur/movies' },
    ],
  },
  jaisalmer: {
    mustVisit: [
      { name: 'Jaisalmer Fort (Sonar Quila)', fee: 'Free entry', hours: 'Always open', type: 'outdoor', tag: 'UNESCO',
        note: 'Only living fort in India — 3,000 residents inside. Inside Jain temples ₹200.' },
      { name: 'Patwon-ki-Haveli', fee: '₹50 / ₹250', hours: '9 AM – 5 PM', type: 'indoor', tag: 'Heritage',
        note: 'Cluster of 5 ornate merchant havelis. Audio guide recommended.' },
      { name: 'Sam Sand Dunes (camel safari)', fee: '₹300/hr camel', hours: 'Sunset 4–7 PM', type: 'outdoor', tag: 'Bucket-list',
        note: 'Combine with desert camp overnight. Book 2 weeks ahead in peak season.' },
      { name: 'Gadisar Lake', fee: '₹20', hours: 'Sunrise & sunset', type: 'outdoor', tag: 'Photo',
        note: 'Migratory birds in winter. Boat ride ₹100.' },
    ],
    activities: [
      { name: 'Desert camp overnight + folk night', type: 'outdoor', price: '₹2,500–8,500/person', icon: '🏕' },
      { name: 'Stargazing in Thar Desert', type: 'outdoor', price: '₹600/person', icon: '🌌' },
      { name: 'Dune bashing · 4x4 jeep', type: 'outdoor', price: '₹1,200/jeep', icon: '🚙' },
      { name: 'Fort heritage walk with historian', type: 'outdoor', price: '₹800/person', icon: '🚶' },
    ],
    events: [
      { name: 'Desert Festival 2027', date: '31 Jan – 3 Feb 2027', venue: 'Sam Dunes & Poonam Stadium', price: 'Free entry', booking: 'https://tourism.rajasthan.gov.in' },
      { name: 'New Year Desert Gala', date: '31 Dec 2026', venue: 'Suryagarh Resort', price: '₹15,000+/couple', booking: 'https://in.bookmyshow.com/events' },
    ],
  },
  pushkar: {
    mustVisit: [
      { name: 'Brahma Temple', fee: 'Free', hours: '6:30 AM – 1:30 PM, 3–8:30 PM', type: 'indoor', tag: 'Spiritual',
        note: 'One of only Brahma temples in the world. Aarti at 6 AM & 7 PM.' },
      { name: 'Pushkar Lake (Sarovar)', fee: 'Free', hours: 'Anytime', type: 'outdoor', tag: 'Spiritual',
        note: '52 ghats around sacred lake. Sunset views are mesmerising.' },
      { name: 'Savitri Temple (ropeway)', fee: '₹150 ropeway', hours: '6 AM – 6 PM', type: 'outdoor', tag: 'Panoramic',
        note: 'Hilltop temple with 360° views. Sunrise visit recommended.' },
    ],
    activities: [
      { name: 'Camel safari in Aravallis', type: 'outdoor', price: '₹500/hr', icon: '🐪' },
      { name: 'Yoga & meditation retreat', type: 'indoor', price: '₹2,000/day', icon: '🧘' },
      { name: 'Hippie bazaar shopping', type: 'outdoor', price: 'Free entry', icon: '🛍' },
    ],
    events: [
      { name: 'Pushkar Camel Fair 2026', date: '1–11 Nov 2026', venue: 'Pushkar Mela Ground', price: 'Free entry · ticketed shows ₹500+', booking: 'https://tourism.rajasthan.gov.in' },
      { name: 'Holi celebration', date: 'Mar 2027', venue: 'Pushkar town', price: 'Free', booking: 'https://tourism.rajasthan.gov.in' },
    ],
  },
}

export default function CityAttractions() {
  const navigate = useNavigate()
  const [activeCity, setActiveCity] = useState('jaipur')
  const [tab, setTab] = useState('attractions')

  const city = DATA[activeCity]
  const cityMeta = CITIES.find(c => c.code === activeCity)

  return (
    <div className="app-shell">
      <StatusBar light />

      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '12px 16px 14px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.3 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ fontSize: 18, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate(-1)}>←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>🎟 Things to Do</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>Attractions, activities & live events</div>
            </div>
          </div>

          {/* City selector */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 12, paddingBottom: 2 }} className="hide-scrollbar">
            {CITIES.map(c => (
              <button
                key={c.code}
                onClick={() => setActiveCity(c.code)}
                style={{
                  flexShrink: 0, padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: activeCity === c.code ? '#fff' : 'rgba(255,255,255,0.15)',
                  color: activeCity === c.code ? 'var(--primary-dark)' : '#fff',
                  border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <span>{c.emoji}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {[['attractions', '🏛 Must Visit'], ['activities', '🎨 Activities'], ['events', '🎤 Events']].map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            style={{
              flex: 1, padding: '10px 4px', fontSize: 11.5, fontWeight: 700,
              color: tab === val ? 'var(--primary)' : 'var(--ink-mute)',
              background: 'none', border: 'none',
              borderBottom: tab === val ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {lbl}
          </button>
        ))}
      </div>

      <div className="screen-scroll">
        <div className="content">
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 700 }}>
            {cityMeta.emoji} {cityMeta.name} · {cityMeta.tagline}
          </div>

          {tab === 'attractions' && city.mustVisit.map(a => (
            <div
              key={a.name}
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(a.name + ' ' + cityMeta.name + ' Rajasthan')}`, '_blank')}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>{a.name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>⏰ {a.hours}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: a.type === 'outdoor' ? '#FEF3C7' : '#DBEAFE', color: a.type === 'outdoor' ? '#92400E' : '#1E40AF' }}>
                  {a.type === 'outdoor' ? '☀️ Outdoor' : '🏛 Indoor'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <span className="chip chip-primary" style={{ fontSize: 10 }}>🎫 {a.fee}</span>
                <span className="chip chip-neutral" style={{ fontSize: 10 }}>{a.tag}</span>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>💡 {a.note}</div>
              <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700, marginTop: 6 }}>📍 Tap to open in Google Maps →</div>
            </div>
          ))}

          {tab === 'activities' && city.activities.map(a => (
            <div key={a.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{a.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 800, padding: '2px 6px', borderRadius: 5, background: a.type === 'outdoor' ? '#FEF3C7' : '#DBEAFE', color: a.type === 'outdoor' ? '#92400E' : '#1E40AF' }}>
                    {a.type === 'outdoor' ? '☀️ Outdoor' : '🏛 Indoor'}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>{a.price}</span>
                </div>
              </div>
            </div>
          ))}

          {tab === 'events' && (
            <>
              <div style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', border: '1px solid #F59E0B', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 22 }}>🎤</span>
                <div style={{ fontSize: 11, color: '#78350F', lineHeight: 1.5, fontWeight: 600 }}>
                  Live concerts, IPL matches, movies & festivals — booking via <strong>BookMyShow</strong> & official portals.
                </div>
              </div>

              {city.events.map(e => (
                <div key={e.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>{e.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>📅 {e.date}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 1 }}>📍 {e.venue}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: '#FEE2E2', color: '#991B1B', flexShrink: 0 }}>
                      {e.price}
                    </span>
                  </div>
                  <button
                    onClick={() => window.open(e.booking, '_blank')}
                    className="btn-pri btn-sm"
                    style={{ width: '100%', marginTop: 6, fontSize: 11.5, padding: '8px 0' }}
                  >
                    🎟 Book Tickets →
                  </button>
                </div>
              ))}

              <div style={{ background: 'var(--primary-ghost)', borderRadius: 10, padding: '10px 12px', fontSize: 10.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                💡 Disclaimer: Event dates & prices are illustrative. Final booking always via official partner. We do not handle payments — you are redirected to the operator.
              </div>
            </>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
