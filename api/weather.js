const CITIES = [
  { name: 'Jaipur',    lat: 26.9124, lon: 75.7873 },
  { name: 'Udaipur',   lat: 24.5854, lon: 73.7125 },
  { name: 'Jodhpur',   lat: 26.2389, lon: 73.0243 },
  { name: 'Jaisalmer', lat: 26.9157, lon: 70.9083 },
  { name: 'Pushkar',   lat: 26.4893, lon: 74.5518 },
  { name: 'Bikaner',   lat: 28.0229, lon: 73.3119 },
]

const WMO_DESC = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Moderate showers', 82: 'Heavy showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm',
}

const WMO_EMOJI = {
  0: '☀️', 1: '🌤', 2: '⛅', 3: '☁️',
  45: '🌫', 48: '🌫', 51: '🌦', 53: '🌦', 55: '🌧',
  61: '🌧', 63: '🌧', 65: '🌧', 71: '❄️', 73: '❄️', 75: '❄️',
  80: '🌦', 81: '🌦', 82: '🌧', 95: '⛈', 96: '⛈', 99: '⛈',
}

let cache = null
let cacheTime = 0
const CACHE_TTL = 10 * 60 * 1000

export async function fetchRajasthanWeather() {
  const now = Date.now()
  if (cache && now - cacheTime < CACHE_TTL) return cache
  const results = await Promise.all(
    CITIES.map(async city => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&hourly=apparent_temperature&forecast_days=1&timezone=Asia%2FKolkata`
      const r = await fetch(url, { signal: AbortSignal.timeout(4000) })
      const d = await r.json()
      const cw = d.current_weather
      const code = cw.weathercode
      const hour = new Date().getHours()
      return {
        name: city.name,
        temp: Math.round(cw.temperature),
        feelsLike: Math.round(d.hourly?.apparent_temperature?.[hour] ?? cw.temperature),
        condition: WMO_DESC[code] || 'Variable',
        emoji: WMO_EMOJI[code] || '🌡',
        windspeed: Math.round(cw.windspeed),
        isDay: cw.is_day === 1,
      }
    })
  )
  cache = results
  cacheTime = now
  return results
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const now = Date.now()
  if (cache && now - cacheTime < CACHE_TTL) {
    return res.json({ cities: cache, cached: true, fetchedAt: new Date(cacheTime).toISOString() })
  }

  try {
    const results = await fetchRajasthanWeather()
    return res.json({ cities: results, cached: false, fetchedAt: new Date().toISOString() })
  } catch (err) {
    if (cache) return res.json({ cities: cache, cached: true, fetchedAt: new Date(cacheTime).toISOString() })
    return res.status(503).json({ error: 'Weather unavailable', message: err.message })
  }
}
