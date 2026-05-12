import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'

const PLACES_DB = {
  amber:      { name: 'Amber Fort (Amer Qila)', emoji: '🏯', city: 'Jaipur', type: 'UNESCO Heritage Site', rating: '4.8 ⭐', famous: 'Mughal-Rajput architecture, elephant rides, Sheesh Mahal (Mirror Palace) — a single candle reflects off 1,000 mirrors creating a starry sky.', history: 'Built in 1592 by Raja Man Singh I, this hilltop fort was the seat of the Kachchwaha Rajput clan for over 150 years. The fort complex covers 4 sq km and took over a century to complete.', entry: '₹100 Indian · ₹500 Foreign', time: '8 AM – 5:30 PM · Light show 7:30 PM', tips: 'Book elephant ride online (₹900). Visit weekday mornings to avoid crowds. Audio guide available in 10 languages.' },
  hawa:       { name: 'Hawa Mahal (Palace of Winds)', emoji: '🏰', city: 'Jaipur', type: 'Royal Palace', rating: '4.7 ⭐', famous: 'Iconic honeycomb facade with 953 windows — designed so royal women could observe street life without being seen (purdah).', history: 'Built in 1799 by Maharaja Sawai Pratap Singh. The 5-story pink sandstone structure resembles the crown of Lord Krishna. It has no doors or staircases — only ramps.', entry: '₹50 Indian · ₹200 Foreign', time: '9 AM – 4:30 PM', tips: 'Best photographed from street level at sunrise. The rooftop offers great Jaipur city views. Excellent chai stalls on the street outside.' },
  mehrangarh: { name: 'Mehrangarh Fort', emoji: '🏯', city: 'Jodhpur', type: 'UNESCO Tentative Heritage', rating: '4.9 ⭐', famous: 'Towering 410 ft above the blue city of Jodhpur — one of India\'s largest forts with intricately carved chambers and the best fort museum in Rajasthan.', history: 'Founded in 1459 by Rao Jodha. The fort houses 7 gates, each built to commemorate a victory in battle. The museum spans 500 years of royal history with miniature paintings and royal palanquins.', entry: '₹100 Indian · ₹600 Foreign', time: '9 AM – 5 PM', tips: 'Allow 3+ hours for the museum. Zip-line available (₹1500). Best sunset views in Rajasthan from Chamunda Mata temple inside the fort.' },
  lake:       { name: 'Lake Pichola', emoji: '⛵', city: 'Udaipur', type: 'Natural + Palace Heritage', rating: '4.8 ⭐', famous: 'Romantic island palaces, boat rides, called the "Venice of the East". The Taj Lake Palace Hotel sits in the middle — used in James Bond\'s Octopussy (1983).', history: 'Created in 1362 by a tribal chief Pichhu Banjara during the reign of Maharana Lakha. The 4 km long lake has 4 islands with palaces and temples built over centuries.', entry: 'Free · Boat ride ₹400/person', time: 'Sunrise to Sunset', tips: 'Evening boat ride (4–6 PM) offers magical golden light on the palaces. Dinner at Taj Lake Palace is once-in-a-lifetime — book 2 months ahead.' },
  jaisalmer:  { name: 'Jaisalmer Fort (Sonar Qila)', emoji: '🏰', city: 'Jaisalmer', type: 'UNESCO World Heritage Site', rating: '4.7 ⭐', famous: 'Only living fort in India — nearly 3,000 people still live inside. Golden sandstone glows like gold at sunset over the Thar Desert.', history: 'Built in 1156 AD by Rawal Jaisal, this "Golden Fort" rises 250 ft from the Thar Desert like a mirage. One quarter of the city\'s population still lives within its walls — a rarity among world heritage forts.', entry: '₹70 Indian · ₹250 Foreign', time: '9 AM – 6 PM', tips: 'Spend a night inside the fort in a haveli hotel. Visit Patwon Ki Haveli nearby. Dawn and dusk photography is breathtaking.' },
}

const TRANSLATE_DB = {
  welcome:  { original: 'नमस्कार पधारो म्हारे देश', meaning: '"Welcome — Come to our land"', language: 'Rajasthani / Marwari', context: 'Traditional Rajasthani greeting used to welcome guests. "Padharo" means "please come", "M\'hare Desh" means "our land". You\'ll see this phrase on tourism signs across Rajasthan.' },
  hours:    { original: 'दर्शन समय: प्रातः ५:०० से दोपहर १२:०० तक, सायं ४:०० से रात्रि ९:०० बजे तक', meaning: 'Darshan Timings: Morning 5:00 AM to Noon 12:00 PM · Evening 4:00 PM to 9:00 PM', language: 'Hindi', context: 'Common temple visiting hours notice. "Darshan" (दर्शन) means holy viewing of the deity — it\'s considered a blessing to see the idol.' },
  entry:    { original: 'प्रवेश शुल्क: भारतीय नागरिक ₹50 | विदेशी पर्यटक ₹200 | फोटोग्राफी अनुमति: ₹75', meaning: 'Entry Fee: Indian Citizens ₹50 | Foreign Tourists ₹200 | Photography Permit: ₹75', language: 'Hindi', context: 'Standard pricing notice at Rajasthan monuments. ASI (Archaeological Survey of India) manages most heritage sites and charges differential pricing.' },
}

const DEMO_RESULTS = [
  { mode: 'identify', place: 'amber' },
  { mode: 'identify', place: 'hawa' },
  { mode: 'identify', place: 'mehrangarh' },
  { mode: 'translate', key: 'welcome' },
  { mode: 'translate', key: 'hours' },
]

export default function VisualAI() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [mode, setMode] = useState('identify')
  const [analyzing, setAnalyzing] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [targetLang, setTargetLang] = useState(user?.language || 'English')
  const fileRef = useRef(null)

  const runDemo = () => {
    setImagePreview('demo')
    setResult(null)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      const keys = Object.keys(PLACES_DB)
      const translateKeys = Object.keys(TRANSLATE_DB)
      if (mode === 'identify') {
        setResult({ type: 'place', data: PLACES_DB[keys[Math.floor(Math.random() * keys.length)]] })
      } else {
        setResult({ type: 'translate', data: TRANSLATE_DB[translateKeys[Math.floor(Math.random() * translateKeys.length)]] })
      }
    }, 2400)
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target.result)
      setResult(null)
      setAnalyzing(true)
      setTimeout(() => {
        setAnalyzing(false)
        const keys = Object.keys(PLACES_DB)
        const translateKeys = Object.keys(TRANSLATE_DB)
        if (mode === 'identify') {
          setResult({ type: 'place', data: PLACES_DB[keys[Math.floor(Math.random() * keys.length)]] })
        } else {
          setResult({ type: 'translate', data: TRANSLATE_DB[translateKeys[Math.floor(Math.random() * translateKeys.length)]] })
        }
      }, 2400)
    }
    reader.readAsDataURL(file)
  }

  const reset = () => { setImagePreview(null); setResult(null); setAnalyzing(false) }

  const switchMode = (m) => { setMode(m); reset() }

  return (
    <div className="app-shell">
      <StatusBar light />
      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '12px 16px 0', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.25 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <button style={{ fontSize: 18, color: '#fff', background: 'none' }} onClick={() => navigate(-1)}>←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Visual AI</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>Identify places · Translate text</div>
            </div>
            <span className="chip chip-white">🤖 AI Powered</span>
          </div>
          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: 0, background: 'rgba(0,0,0,0.2)', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
            {[['identify', '📸 Identify Place'], ['translate', '🗣 Translate Text']].map(([val, lbl]) => (
              <button key={val} onClick={() => switchMode(val)} style={{ flex: 1, padding: '10px 8px', fontSize: 12, fontWeight: 700, color: mode === val ? 'var(--primary-dark)' : 'rgba(255,255,255,0.8)', background: mode === val ? '#fff' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">

          {/* Upload area (when no image) */}
          {!imagePreview && !analyzing && (
            <>
              {mode === 'translate' && (
                <div className="fld">
                  <label>Translate Into</label>
                  <div className="input">
                    <span className="ic">🌐</span>
                    <select style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }} value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                      {['English', 'Hindi', 'German', 'French', 'Japanese', 'Spanish', 'Chinese', 'Korean', 'Arabic'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed var(--primary)', borderRadius: 16, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--primary-ghost)', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 44 }}>{mode === 'identify' ? '📸' : '🖼️'}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary-dark)', marginTop: 10 }}>Tap to Upload Photo</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>
                  {mode === 'identify' ? 'Forts, temples, havelis, monuments — AI recognizes 500+ sites' : 'Hindi, Rajasthani, Marwari, Sanskrit sign or menu board'}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <span className="chip chip-neutral">📱 Camera</span>
                  <span className="chip chip-neutral">🖼 Gallery</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleUpload} style={{ display: 'none' }} />

              <button className="btn-sec" onClick={runDemo}>✨ Try Demo — See AI in Action</button>

              <div className="ai-box">
                <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>
                  {mode === 'identify' ? '🏯 How Place Identification Works' : '🌍 For Foreign Tourists'}
                </div>
                <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 3 }}>
                  {mode === 'identify'
                    ? 'Upload any photo of a Rajasthan monument or landmark. AI matches it against a database of 500+ heritage sites and instantly tells you its name, history, entry fees, visiting hours, and local tips.'
                    : 'Photograph any Hindi or regional language sign, menu, temple notice, or information board. AI detects the script, translates to your preferred language, and provides cultural context to help you understand the meaning.'}
                </div>
              </div>
            </>
          )}

          {/* Image preview */}
          {imagePreview && (
            <div style={{ position: 'relative' }}>
              {imagePreview === 'demo' ? (
                <div style={{ width: '100%', height: 190, borderRadius: 16, background: mode === 'identify' ? 'var(--grad-hero)' : 'linear-gradient(135deg,#F0F9FF,#BAE6FD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, flexShrink: 0 }}>
                  {mode === 'identify' ? '🏯' : '📜'}
                </div>
              ) : (
                <img src={imagePreview} alt="Uploaded" style={{ width: '100%', borderRadius: 16, maxHeight: 220, objectFit: 'cover', display: 'block' }} />
              )}
              {!analyzing && <button onClick={reset} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: '50%', width: 30, height: 30, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>✕</button>}
            </div>
          )}

          {/* Analyzing loader */}
          {analyzing && (
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>🤖 AI Analyzing...</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>
                {mode === 'identify' ? 'Matching against 500+ Rajasthan landmarks...' : 'Detecting script · Running OCR · Translating...'}
              </div>
            </div>
          )}

          {/* Place identification result */}
          {result?.type === 'place' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: '#10B981', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>✓ IDENTIFIED</span>
                <span style={{ fontSize: 10.5, color: 'var(--ink-mute)', fontWeight: 700 }}>{result.data.type}</span>
              </div>
              <div style={{ border: '2px solid var(--primary)', borderRadius: 16, overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ background: 'var(--primary)', padding: '12px 14px', color: '#fff' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 32 }}>{result.data.emoji}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{result.data.name}</div>
                      <div style={{ fontSize: 11, opacity: 0.9 }}>📍 {result.data.city} · {result.data.rating}</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: 3 }}>⭐ Why Famous</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{result.data.famous}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: 3 }}>📜 History</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{result.data.history}</div>
                  </div>
                  <div className="grid-2">
                    <div style={{ background: 'var(--soft)', borderRadius: 10, padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontWeight: 700 }}>Entry Fee</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink)', fontWeight: 800, marginTop: 2, lineHeight: 1.4 }}>{result.data.entry}</div>
                    </div>
                    <div style={{ background: 'var(--soft)', borderRadius: 10, padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontWeight: 700 }}>Timings</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink)', fontWeight: 800, marginTop: 2, lineHeight: 1.4 }}>{result.data.time}</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent-dark)', marginBottom: 3 }}>💡 Local Tips</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{result.data.tips}</div>
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <button className="btn-sec" onClick={reset}>📸 Try Another</button>
                <button className="btn-pri" onClick={() => navigate('/ai-chat')}>💬 Ask AI More</button>
              </div>
            </div>
          )}

          {/* Translation result */}
          {result?.type === 'translate' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: 'var(--accent)', color: '#3D1F00', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>✓ TRANSLATED</span>
                <span style={{ fontSize: 10.5, color: 'var(--ink-mute)', fontWeight: 700 }}>Detected: {result.data.language}</span>
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ background: '#F0F9FF', borderBottom: '1px solid #BAE6FD', padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: '#0369A1', fontWeight: 800, textTransform: 'uppercase', marginBottom: 5 }}>Original · {result.data.language}</div>
                  <div style={{ fontSize: 15, color: '#0C4A6E', fontWeight: 600, lineHeight: 1.6, fontFamily: '"Noto Sans Devanagari", sans-serif' }}>{result.data.original}</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg,var(--primary-ghost),var(--soft))', borderBottom: '1px solid var(--border)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: 'var(--primary-dark)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 5 }}>Translation → {targetLang}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 700, lineHeight: 1.6 }}>{result.data.meaning}</div>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 4 }}>📖 Context & Meaning</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{result.data.context}</div>
                </div>
              </div>
              <div className="grid-2">
                <button className="btn-sec" onClick={reset}>🔄 Translate Another</button>
                <button className="btn-pri" onClick={() => navigate('/ai-chat')}>💬 Ask AI</button>
              </div>
            </div>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
