import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp, packages } from '../context/AppContext'

const TESTIMONIALS = {
  1: [
    { name: 'Rahul M.', city: 'Delhi', rating: 5, text: 'Absolutely magical! The Royal Trail covered everything perfectly. Amber Fort at sunrise was breathtaking — worth every rupee.' },
    { name: 'Priya S.', city: 'Mumbai', rating: 5, text: 'Heritage hotels were stunning. Udaipur City Palace view from our room felt like a painting. Highly recommend for couples!' },
    { name: 'James W.', city: 'London', rating: 4, text: 'Well organised, great guide. Jaisalmer desert camp was the highlight — stars, folk music and bonfire unforgettable.' },
    { name: 'Kavita R.', city: 'Bangalore', rating: 5, text: 'Travelled as a family with elderly parents. The pace was perfect, every hotel was wheelchair accessible. Loved it!' },
  ],
  2: [
    { name: 'Ankit J.', city: 'Ahmedabad', rating: 5, text: 'Desert safari was out of this world! Luxury tent at Sam Dunes with stargazing — feels like glamping at its absolute best.' },
    { name: 'Sunita P.', city: 'Pune', rating: 4, text: 'Mehrangarh Fort in Jodhpur was incredibly majestic. The guide was very knowledgeable and the camel ride was thrilling!' },
    { name: 'Vikram T.', city: 'Delhi', rating: 5, text: 'Short but perfectly packed trip. Jodhpur Blue City walk was my favourite, and the rooftop dinner with fort view was memorable.' },
  ],
  3: [
    { name: 'Rohan D.', city: 'Hyderabad', rating: 5, text: 'Romantic trip with my wife — Udaipur exceeded all expectations. Pushkar was a spiritual and peaceful bonus we didn\'t expect!' },
    { name: 'Meera K.', city: 'Chennai', rating: 5, text: 'Lake Pichola at sunset is pure magic. The heritage hotel had stunning palace views. Perfect honeymoon package!' },
    { name: 'Amit G.', city: 'Kolkata', rating: 4, text: 'Pushkar was unexpectedly beautiful. The Brahma Temple at dawn and evening lake aarti were deeply moving experiences.' },
  ],
}

const INCLUDE_INFO = {
  Transport: {
    icon: '🚐', title: 'Getting There',
    items: [
      { label: '✈️ By Air', detail: 'Jaipur International Airport (JAI) · Daily flights from Delhi (1.5h), Mumbai (2h), Bangalore (2.5h)' },
      { label: '🚂 By Train', detail: 'Shatabdi Express Delhi→Jaipur (5h, ₹720) · Pink City Express & Superfast trains available daily' },
      { label: '🚌 By Bus', detail: 'RSRTC Volvo Delhi→Jaipur (5-6h, ₹500) · AC sleeper buses overnight option available' },
      { label: '🚗 Self Drive', detail: 'NH-48 from Delhi · ~280km, 4-5h · Good road, toll approx ₹300. Car park available at all major forts.' },
    ],
  },
  Meals: {
    icon: '🍽', title: 'Cuisine Highlights',
    items: [
      { label: '🍛 Dal Baati Churma', detail: 'The iconic Rajasthani meal — baked wheat balls, lentil curry & sweet churma. Included at select dinners.' },
      { label: '🥩 Laal Maas', detail: 'Fiery red mutton curry with mathania chillies. Best in Jodhpur — included at heritage dinner night.' },
      { label: '🥐 Pyaaz Kachori', detail: 'Flaky pastry stuffed with spiced onions. Rawat Mishthan Bhandar, Jaipur — a local legend.' },
      { label: '🧋 Makhaniya Lassi', detail: 'Rich creamy saffron lassi, Jodhpur specialty. Served at Shri Mishrilal Hotel, Clock Tower.' },
    ],
  },
  Breakfast: {
    icon: '☕', title: 'Daily Breakfast',
    items: [
      { label: '🥐 Continental', detail: 'Eggs, toast, fresh fruit, juice, tea/coffee — served at hotel restaurant daily' },
      { label: '🍛 Indian Option', detail: 'Poha, idli, paratha, aloo sabzi — authentic Rajasthani morning fare available on request' },
      { label: '☕ Chai Experience', detail: 'Morning kadak chai with kachori — the Rajasthan breakfast ritual, served 7–9 AM' },
    ],
  },
  Entry: {
    icon: '🎫', title: 'Entry Fees Covered',
    items: [
      { label: '🏰 Amber Fort, Jaipur', detail: '₹100 (Indian) · ₹500 (Foreign) · Audio guide ₹150 · Elephant ride ₹900 extra' },
      { label: '🏛 City Palace, Udaipur', detail: '₹250 (Indian) · ₹500 (Foreign) · Museum ₹200 extra · Photography ₹50' },
      { label: '⛵ Lake Pichola Boat', detail: '₹450/person · Includes Jag Mandir island stop · 45-min guided ride' },
      { label: '🌟 Jaisalmer Fort', detail: 'Free entry · Jain Temple museum inside ₹50 · Guided walk recommended' },
    ],
  },
  '4★ Stay': {
    icon: '🏨', title: 'Stay Details',
    items: [
      { label: '🏨 Jaipur', detail: 'ITC Rajputana / Trident Jaipur · Heritage-style 4-star · City Palace views, pool, spa' },
      { label: '🏰 Udaipur', detail: 'Trident Udaipur / Amet Haveli · Lakeside property · Lake Pichola views from balcony' },
      { label: '⛺ Jaisalmer', detail: 'Hotel Nachana Haveli · Golden Fort views · Authentic haveli architecture & courtyard' },
    ],
  },
  'Luxury Tent': {
    icon: '⛺', title: 'Desert Camp Experience',
    items: [
      { label: '⛺ Swiss Tents', detail: 'Air-cooled luxury tents with real beds, attached washroom & electricity — glamping in the Thar Desert' },
      { label: '🔥 Bonfire Night', detail: 'Evening bonfire with Rajasthani folk music, puppet show & cultural dance performances' },
      { label: '🌌 Stargazing', detail: 'Zero light pollution at Sam Dunes — Milky Way clearly visible from Oct–Mar. Telescope available.' },
      { label: '🌅 Sunrise Safari', detail: 'Morning camel safari to watch sunrise over golden dunes — the most-photographed moment in Rajasthan' },
    ],
  },
  'Camel Safari': {
    icon: '🐪', title: 'Camel Safari Details',
    items: [
      { label: '🐪 Duration', detail: '1-2 hour rides included · Extended overnight safaris available at ₹1,500+ per person' },
      { label: '⏰ Best Time', detail: 'Sunset safari (4–6 PM) — golden light on dunes is spectacular for photos' },
      { label: '📍 Location', detail: 'Sam Sand Dunes, 42km from Jaisalmer · Hotel pickup and drop included in package' },
      { label: '💡 Tips', detail: 'Wear sunscreen & carry a scarf for dust. Nov–Jan best season; avoid Apr–Sep (extreme heat 45°C+)' },
    ],
  },
  'Heritage Hotel': {
    icon: '🏰', title: 'Heritage Hotel Stay',
    items: [
      { label: '🏰 Udaipur', detail: 'Amet Haveli or Jagat Niwas Palace · 300+ year old havelis · Lake Pichola views · Rooftop restaurant' },
      { label: '🕌 Pushkar', detail: 'Inn Seventh Heaven · Colonial-era boutique hotel in old town · Rooftop with Brahma Temple view' },
      { label: '📸 Photo Ops', detail: 'Arched corridors, painted ceilings, vintage furniture — every corner is a heritage photo waiting to happen' },
    ],
  },
  'Boat Ride': {
    icon: '⛵', title: 'Lake Pichola Boat Ride',
    items: [
      { label: '⛵ Duration', detail: '45-min guided boat ride · Sunrise & sunset time slots — sunset is most popular' },
      { label: '🏝 Jag Mandir', detail: 'Stop at Jag Mandir island palace — used as refuge by Mughal prince Shah Jahan in 1623' },
      { label: '📸 Best View', detail: 'City Palace & Lake Palace Hotel reflected in water — perfect golden hour photograph moment' },
      { label: '🎫 Included', detail: 'Boat ride (₹450 value) fully included in package · Private boat upgrade ₹1,200 extra' },
    ],
  },
  Guide: {
    icon: '👤', title: 'Guide Service',
    items: [
      { label: '👤 Certified', detail: 'Government-certified heritage guides · Fluent in English, Hindi, and select European languages' },
      { label: '⏰ Availability', detail: 'Full-day guide for all major heritage sites · Flexible pace suited to your group' },
      { label: '📚 Expert Knowledge', detail: 'Deep storytelling on Rajput history, architecture legends, Mughal era, and local secrets' },
      { label: '📞 Local Help', detail: 'Guide also assists with restaurant bookings, shopping advice, and local transport coordination' },
    ],
  },
}

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const pkg = packages.find(p => p.id === parseInt(id)) || packages[0]
  const [activeInclude, setActiveInclude] = useState(null)
  const [showReviews, setShowReviews] = useState(false)

  const reviews = TESTIMONIALS[pkg.id] || []

  const getIncludeIcon = (inc) => {
    if (inc.includes('Stay') || inc.includes('Hotel')) return '🏨'
    if (inc.includes('Transport')) return '🚐'
    if (inc.includes('Meal') || inc.includes('Breakfast')) return '🍽'
    if (inc.includes('Entry')) return '🎫'
    if (inc.includes('Tent')) return '⛺'
    if (inc.includes('Safari')) return '🐪'
    if (inc.includes('Boat')) return '⛵'
    if (inc.includes('Guide')) return '👤'
    return '✓'
  }

  return (
    <div className="app-shell">
      {/* Hero image */}
      <div style={{ height: 200, position: 'relative', flexShrink: 0, overflow: 'hidden', background: 'var(--grad-hero)' }}>
        <img
          src={pkg.imgUrl}
          alt={pkg.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.45) 0%,transparent 40%,rgba(0,0,0,0.72))', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: 14, left: 14, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, zIndex: 3, cursor: 'pointer' }} onClick={() => navigate(-1)}>←</div>
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, color: '#fff', zIndex: 3 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className="chip chip-accent">{pkg.badge}</span>
            <span style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '3px 8px', fontSize: 9.5, fontWeight: 700, color: '#fff' }}>🔥 {pkg.booked.toLocaleString()} booked</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{pkg.name}</div>
          <div style={{ fontSize: 11, opacity: 0.95 }}>{pkg.cities}</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Price & rating */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{pkg.days} Days · {pkg.nights} Nights · From</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary-dark)' }}>₹{pkg.price.toLocaleString()}<span style={{ fontSize: 12, color: 'var(--ink-mute)', fontWeight: 600 }}>/person</span></div>
            </div>
            <div
              style={{ textAlign: 'right', cursor: 'pointer' }}
              onClick={() => setShowReviews(v => !v)}
            >
              <div style={{ fontSize: 15, color: 'var(--accent-dark)', fontWeight: 700 }}>⭐ {pkg.rating}</div>
              <div style={{ fontSize: 10.5, color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>
                {pkg.reviews} reviews {showReviews ? '▲' : '▼'}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          {showReviews && reviews.length > 0 && (
            <div style={{ background: 'var(--soft)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>💬 Traveller Reviews</div>
              {reviews.map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>{r.name}</span>
                      <span style={{ fontSize: 10, color: 'var(--ink-mute)', marginLeft: 6 }}>📍 {r.city}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>{'⭐'.repeat(r.rating)}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.55, fontStyle: 'italic' }}>"{r.text}"</div>
                </div>
              ))}
            </div>
          )}

          {/* Includes — tappable */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-mute)', marginBottom: 6 }}>Tap to explore what's included:</div>
            <div className="grid-4">
              {pkg.includes.map(inc => {
                const isActive = activeInclude === inc
                return (
                  <div
                    key={inc}
                    onClick={() => setActiveInclude(isActive ? null : inc)}
                    style={{
                      padding: '8px 4px', background: isActive ? 'var(--primary-ghost)' : 'var(--soft)',
                      border: `${isActive ? 2 : 1}px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 8, textAlign: 'center', cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 16 }}>{getIncludeIcon(inc)}</div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, marginTop: 2, color: isActive ? 'var(--primary-dark)' : 'var(--ink)' }}>{inc}</div>
                  </div>
                )
              })}
            </div>

            {/* Include detail panel */}
            {activeInclude && INCLUDE_INFO[activeInclude] && (
              <div style={{ background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px', marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 10 }}>
                  {INCLUDE_INFO[activeInclude].icon} {INCLUDE_INFO[activeInclude].title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {INCLUDE_INFO[activeInclude].items.map((item, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Itinerary */}
          <div>
            <div className="bold" style={{ fontSize: 13, marginBottom: 8 }}>Itinerary</div>
            <div className="timeline">
              {pkg.itinerary.map((item, i) => (
                <div key={i} className={`tl-item ${i < pkg.itinerary.length - 1 ? 'done' : 'active'}`}>
                  <div className="tl-dot" />
                  <div className="tl-title">{item.day} — {item.title}</div>
                  <div className="tl-time">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI tip */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 3 }}>💡 Best time to book</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.55 }}>Book at least 30 days in advance for best prices. Festival season (Oct–Mar) fills up fast — especially desert camp and heritage hotels.</div>
          </div>

          <button className="btn-pri" onClick={() => navigate('/payment')}>Book This Package →</button>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
