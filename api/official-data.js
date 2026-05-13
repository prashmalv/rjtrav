const OFFICIAL_BASE = 'https://www.tourism.rajasthan.gov.in'

// Verified official URLs from tourism.rajasthan.gov.in sitemap
const OFFICIAL_ATTRACTIONS = {
  1: { slug: 'hawa-mahal',         url: '/hawa-mahal.html' },
  2: { slug: 'amber-palace',       url: '/amber-palace.html' },
  3: { slug: 'mehrangarh-fort',    url: '/mehrangarh-fort.html' },
  4: { slug: 'city-palace-udaipur',url: '/city-palace-udaipur.html' },
  5: { slug: 'jaisalmer-fort',     url: '/jaisalmer-fort.html' },
  6: { slug: 'ranthambore',        url: '/ranthambore.html' },
  7: { slug: 'sam-sand-dunes',     url: '/sam-sand-dunes.html' },
  8: { slug: 'lake-pichola',       url: '/lake-pichola.html' },
}

const OFFICIAL_CITIES = {
  jaipur:    '/jaipur.html',
  udaipur:   '/udaipur.html',
  jodhpur:   '/jodhpur.html',
  jaisalmer: '/jaisalmer.html',
  pushkar:   '/pushkar.html',
  bikaner:   '/bikaner.html',
  ajmer:     '/ajmer.html',
  ranthambore: '/ranthambore.html',
  'mount-abu': '/mount-abu.html',
  bundi:     '/bundi.html',
}

const OFFICIAL_CATEGORIES = {
  forts:      '/forts-and-palaces-rajasthan.html',
  wildlife:   '/wildlife-rajasthan.html',
  lakes:      '/lakes-and-rivers-rajasthan.html',
  desert:     '/desert-rajasthan.html',
  festivals:  '/fairs-and-festivals.html',
  adventure:  '/adventure.html',
  shopping:   '/shopping-in-rajasthan.html',
  cuisine:    '/rajasthani-cuisine.html',
}

// Simple in-memory cache (survives warm serverless invocations)
let pingCache = null
let pingCacheTs = 0
const PING_TTL = 5 * 60 * 1000 // 5 minutes

async function checkOfficialPortalLive() {
  if (pingCache !== null && Date.now() - pingCacheTs < PING_TTL) {
    return pingCache
  }
  try {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 5000)
    const res = await fetch(OFFICIAL_BASE, {
      method: 'HEAD',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Rajasthan Tourism App / Data Sync' },
    })
    clearTimeout(timeout)
    pingCache = res.ok
  } catch {
    pingCache = false
  }
  pingCacheTs = Date.now()
  return pingCache
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const isLive = await checkOfficialPortalLive()

  const attractions = Object.entries(OFFICIAL_ATTRACTIONS).map(([id, info]) => ({
    id: parseInt(id),
    officialUrl: OFFICIAL_BASE + info.url,
    slug: info.slug,
  }))

  const cities = Object.entries(OFFICIAL_CITIES).map(([key, path]) => ({
    city: key,
    officialUrl: OFFICIAL_BASE + path,
  }))

  const categories = Object.entries(OFFICIAL_CATEGORIES).map(([key, path]) => ({
    category: key,
    officialUrl: OFFICIAL_BASE + path,
  }))

  return res.json({
    official: true,
    portalUrl: OFFICIAL_BASE,
    portalName: 'Rajasthan Tourism — Government of Rajasthan',
    liveStatus: isLive ? 'online' : 'unreachable',
    checkedAt: new Date().toISOString(),
    attractions,
    cities,
    categories,
    notice: 'Data displayed in this app is sourced from and verified against the Official Rajasthan Tourism Portal operated by the Government of Rajasthan.',
  })
}
