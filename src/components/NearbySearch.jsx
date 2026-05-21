import { useState } from 'react'

const CATEGORIES = [
  { ico: '🏨', label: 'Hotels',        query: 'hotels' },
  { ico: '🍽', label: 'Restaurants',   query: 'restaurants' },
  { ico: '🚻', label: 'Toilets',       query: 'public toilets restrooms' },
  { ico: '💧', label: 'Water',         query: 'drinking water' },
  { ico: '💊', label: 'Pharmacy',      query: 'pharmacy medical store' },
  { ico: '🏛', label: 'Heritage',      query: 'heritage monument tourist site' },
  { ico: '🛍', label: 'Shopping',      query: 'shopping market' },
  { ico: '🚌', label: 'Transport',     sub: 'transport' },
  { ico: '💱', label: 'Forex',         query: 'foreign exchange money changer' },
  { ico: '👮', label: 'Police',        query: 'tourist police station' },
  { ico: '📱', label: 'SIM Card',      query: 'airtel jio vi sim card store mobile shop' },
  { ico: '🆘', label: 'Tourist Help',  query: 'tourist information centre help desk' },
]

const TRANSPORT_SUB = [
  { ico: '🚕', label: 'Cab / Taxi',    query: 'taxi cab stand' },
  { ico: '🛺', label: 'Auto / Local',  query: 'auto rickshaw stand' },
  { ico: '🚌', label: 'Bus Stand',     query: 'bus station' },
  { ico: '🚂', label: 'Railway',       query: 'railway station' },
  { ico: '✈️', label: 'Airport',       query: 'airport' },
  { ico: '🚇', label: 'Metro',         query: 'metro station' },
  { ico: '⛽', label: 'Petrol Pump',   query: 'petrol pump fuel station' },
  { ico: '🔌', label: 'EV Charging',   query: 'ev charging station' },
]

export default function NearbySearch({ bottomOffset = 70 }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showTransport, setShowTransport] = useState(false)

  const openMaps = (cat) => {
    if (cat.sub === 'transport') {
      setShowTransport(true)
      return
    }
    setLoading(true)
    const doOpen = (lat, lng) => {
      const url = lat
        ? `https://www.google.com/maps/search/${encodeURIComponent(cat.query)}/@${lat},${lng},15z`
        : `https://www.google.com/maps/search/${encodeURIComponent(cat.query + ' near me')}`
      window.open(url, '_blank')
      setLoading(false)
      setOpen(false)
      setShowTransport(false)
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => doOpen(pos.coords.latitude, pos.coords.longitude),
        () => doOpen(null, null),
        { timeout: 5000, maximumAge: 60000 }
      )
    } else {
      doOpen(null, null)
    }
  }

  const close = () => {
    setOpen(false)
    setShowTransport(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Find Nearby"
        style={{
          position: 'fixed',
          bottom: bottomOffset,
          right: 'calc(max(16px, (100vw - 420px) / 2 + 16px))',
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: open ? 'var(--primary)' : '#fff',
          color: open ? '#fff' : 'var(--primary)',
          border: '2px solid var(--primary)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          transition: 'all 0.2s',
        }}
      >
        📍
      </button>

      {open && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 201 }}
        />
      )}

      {open && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: '14px 16px 32px',
          zIndex: 202,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 4, margin: '0 auto 14px' }} />

          {!showTransport && (
            <>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 3 }}>📍 Find Nearby</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 14 }}>
                {loading ? '📡 Getting your location...' : 'Select a category — opens in Google Maps'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.label}
                    onClick={() => openMaps(cat)}
                    disabled={loading}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      padding: '12px 4px', borderRadius: 12, border: '1.5px solid var(--border)',
                      background: '#fff', cursor: loading ? 'wait' : 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--primary-ghost)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                  >
                    <span style={{ fontSize: 22 }}>{cat.ico}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.2 }}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {showTransport && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <button
                  onClick={() => setShowTransport(false)}
                  style={{ background: 'var(--soft)', border: 'none', borderRadius: 8, padding: '4px 9px', fontSize: 12, color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                >← Back</button>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>🚌 Transport — pick mode</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 6, marginBottom: 14 }}>
                {loading ? '📡 Getting your location...' : 'Cab · auto · train · flight · metro · bus — opens in Google Maps'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {TRANSPORT_SUB.map(cat => (
                  <button
                    key={cat.label}
                    onClick={() => openMaps(cat)}
                    disabled={loading}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      padding: '14px 6px', borderRadius: 12, border: '1.5px solid var(--border)',
                      background: '#fff', cursor: loading ? 'wait' : 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--primary-ghost)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                  >
                    <span style={{ fontSize: 24 }}>{cat.ico}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.2 }}>{cat.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 12, lineHeight: 1.5, background: 'var(--primary-ghost)', padding: '8px 10px', borderRadius: 8 }}>
                💡 For booking: open Ola/Uber app for cabs, IRCTC for trains, MakeMyTrip for flights. Rajwada AI can help — ask "how do I book a train to Jaisalmer?"
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
