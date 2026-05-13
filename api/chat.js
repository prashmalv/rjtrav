export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages = [], userProfile = {}, language = 'English' } = req.body || {}
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(503).json({ error: 'AI_NOT_CONFIGURED' })
  }

  // Language instruction
  const langMap = {
    Hindi:    'Always respond in Hindi (Devanagari script). Keep it simple and clear.',
    German:   'Always respond in German.',
    French:   'Always respond in French.',
    Japanese: 'Always respond in Japanese.',
    Spanish:  'Always respond in Spanish.',
  }
  const langInstruction = langMap[language] || 'Always respond in English.'

  // Build profile context string
  const profile = [
    userProfile.name        && `Name: ${userProfile.name}`,
    userProfile.travelStyle && `Travel style: ${userProfile.travelStyle}`,
    userProfile.interests?.length && `Interests: ${userProfile.interests.join(', ')}`,
    userProfile.homeCity    && `Travelling from: ${userProfile.homeCity}`,
    userProfile.nationality && `Nationality: ${userProfile.nationality}`,
    userProfile.age         && `Age: ${userProfile.age}`,
  ].filter(Boolean).join('\n')

  const system = `You are Padharo AI — the official AI travel companion for Rajasthan Tourism, Government of Rajasthan.

${profile ? `Traveller profile:\n${profile}\n\nPersonalise every response based on this profile. If they love wildlife, highlight safari options. If they are a family, mention child-friendly spots. If they are from Delhi, factor in travel time and weekend crowds.` : ''}

Your knowledge covers:
- Jaipur: Hawa Mahal (₹50/₹200, 9AM–4:30PM), Amber Fort (₹100/₹500, 8AM–5:30PM), City Palace, Jantar Mantar, Nahargarh Fort
- Udaipur: City Palace (₹250), Lake Pichola boat (₹450), Sajjangarh, Saheliyon ki Bari
- Jodhpur: Mehrangarh Fort (₹100/₹600, 9AM–5PM), Umaid Bhawan, Blue City lanes
- Jaisalmer: Golden Fort (₹70/₹250), Sam Sand Dunes, Patwon ki Haveli, desert camp stays
- Pushkar: Brahma Temple (only in India!), Pushkar Lake, Camel Fair (Nov)
- Ranthambore: Tiger reserve, Zone 1–5 safaris, book 60 days ahead, Oct–Jun season
- Crowd intelligence: Weekends in Jaipur are very crowded due to Khatu Shyam Mandir pilgrims — suggest Pushkar first for Delhi/NCR travellers
- Transport: Rajasthan roadways, heritage trains (Palace on Wheels, Royal Rajasthan on Wheels), local taxis
- Food: Dal baati churma, laal maas, ker sangri, ghewar, pyaaz kachori
- Safety: Tourist Helpline 1363 (free, 24×7), Blue Beret tourist police at all major sites
- Best season: October to March. Avoid May–June (extreme heat 45°C+)

Response style: Concise (3–5 sentences for simple questions, bullet lists for itineraries). Warm, knowledgeable, helpful. Use 1–2 emojis max.

${langInstruction}`

  // Format messages for Anthropic — must alternate user/assistant, start with user
  const formatted = messages
    .filter(m => m.from === 'user' || m.from === 'bot')
    .map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }))

  // Remove consecutive same-role messages (keep last), ensure starts with user
  const deduplicated = []
  for (const msg of formatted) {
    if (deduplicated.length && deduplicated[deduplicated.length - 1].role === msg.role) {
      deduplicated[deduplicated.length - 1] = msg
    } else {
      deduplicated.push(msg)
    }
  }
  const anthropicMessages = deduplicated[0]?.role === 'user' ? deduplicated : deduplicated.slice(1)

  if (!anthropicMessages.length) {
    return res.status(400).json({ error: 'No user message' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system,
        messages: anthropicMessages,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return res.json({ reply: data.content[0].text })

  } catch (err) {
    console.error('Padharo AI error:', err.message)
    return res.status(500).json({ error: 'AI_UNAVAILABLE', message: err.message })
  }
}
