import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export const destinations = [
  { id: 1, name: 'Hawa Mahal', city: 'Jaipur', rating: 4.7, reviews: 8247, category: 'Heritage', price: '₹50/200', fee: 50, img: '🏰', desc: 'Built in 1799 by Maharaja Sawai Pratap Singh, the iconic five-storey "Palace of Winds" features 953 small windows (jharokhas) decorated with intricate latticework.', badge: '⭐ UNESCO', bestTime: 'Oct–Mar' },
  { id: 2, name: 'Amber Fort', city: 'Jaipur', rating: 4.8, reviews: 12340, category: 'Heritage', price: '₹100/500', fee: 100, img: '🏯', desc: 'A majestic fort-palace atop a hill, blending Rajput and Mughal architecture. Known for its ornate Sheesh Mahal (Mirror Palace) and stunning panoramic views.', badge: '⭐ UNESCO', bestTime: 'Oct–Mar' },
  { id: 3, name: 'Mehrangarh Fort', city: 'Jodhpur', rating: 4.8, reviews: 9870, category: 'Heritage', price: 'Free', fee: 0, img: '🗼', desc: 'One of India\'s largest forts, rising 400 feet above Jodhpur. Houses a fine collection of palanquins, howdahs, royal cradles, arms, armour, and paintings.', badge: '⭐ Majestic', bestTime: 'Nov–Feb' },
  { id: 4, name: 'City Palace Udaipur', city: 'Udaipur', rating: 4.9, reviews: 11200, category: 'Heritage', price: '₹250', fee: 250, img: '🏛️', desc: 'A stunning palace complex on the eastern banks of Lake Pichola. The Mewar dynasty\'s grandeur is on full display with Rajput and European architecture.', badge: '⭐ Royal', bestTime: 'Oct–Mar' },
  { id: 5, name: 'Jaisalmer Fort', city: 'Jaisalmer', rating: 4.8, reviews: 7650, category: 'Heritage', price: 'Free', fee: 0, img: '🌟', desc: 'The "Golden Fort" rises from the Thar Desert like a mirage. A living fort where people still reside within its golden sandstone walls.', badge: '⭐ UNESCO', bestTime: 'Nov–Feb' },
  { id: 6, name: 'Ranthambore', city: 'Sawai Madhopur', rating: 4.8, reviews: 5430, category: 'Wildlife', price: '₹500+', fee: 500, img: '🐅', desc: '62+ tigers roam the rugged terrain of Ranthambore, one of India\'s most famous tiger reserves. Also home to leopards, sloth bears, and crocodiles.', badge: '🐅 Tiger Reserve', bestTime: 'Oct–Jun' },
  { id: 7, name: 'Sam Sand Dunes', city: 'Jaisalmer', rating: 4.7, reviews: 8900, category: 'Desert', price: '₹200', fee: 200, img: '🐪', desc: 'Experience the vast Thar Desert with golden sand dunes stretching to the horizon. Camel safaris, folk performances, and stunning sunsets await.', badge: '🐪 Desert', bestTime: 'Nov–Feb' },
  { id: 8, name: 'Lake Pichola', city: 'Udaipur', rating: 4.9, reviews: 13400, category: 'Lakes', price: '₹450 boat', fee: 450, img: '⛵', desc: 'An artificial freshwater lake created in 1362. A boat ride offers stunning views of the City Palace, Lake Palace Hotel, and Jag Mandir island.', badge: '⛵ Scenic', bestTime: 'Oct–Mar' },
]

export const packages = [
  {
    id: 1, name: 'Royal Rajasthan Trail', cities: 'Jaipur · Udaipur · Jaisalmer',
    days: 7, nights: 6, price: 38499, rating: 4.9, reviews: 892, booked: 1247,
    img: '🏯', badge: '⭐ Bestseller',
    includes: ['4★ Stay', 'Transport', 'Meals', 'Entry'],
    itinerary: [
      { day: 'Day 1', title: 'Arrive Jaipur', desc: 'Hawa Mahal · City Palace · Bazaar' },
      { day: 'Day 2', title: 'Amber Fort', desc: 'Jal Mahal · Folk dinner' },
      { day: 'Day 3-4', title: 'Udaipur', desc: 'Lake Pichola · City Palace' },
      { day: 'Day 5-7', title: 'Jaisalmer', desc: 'Golden Fort · Sam Dunes' },
    ]
  },
  {
    id: 2, name: 'Desert Safari Escape', cities: 'Jodhpur · Jaisalmer',
    days: 4, nights: 3, price: 18999, rating: 4.8, reviews: 540, booked: 632,
    img: '🐪', badge: '🐪 Adventure',
    includes: ['Luxury Tent', 'Camel Safari', 'Breakfast', 'Entry'],
    itinerary: [
      { day: 'Day 1', title: 'Jodhpur', desc: 'Mehrangarh · Blue City walk' },
      { day: 'Day 2-3', title: 'Jaisalmer', desc: 'Golden Fort · Sam Dunes night camp' },
      { day: 'Day 4', title: 'Departure', desc: 'Morning desert sunrise · Return' },
    ]
  },
  {
    id: 3, name: 'Lakes & Palaces', cities: 'Udaipur · Pushkar',
    days: 5, nights: 4, price: 24999, rating: 4.9, reviews: 380, booked: 415,
    img: '⛵', badge: '⛵ Romantic',
    includes: ['Heritage Hotel', 'Boat Ride', 'Meals', 'Guide'],
    itinerary: [
      { day: 'Day 1-3', title: 'Udaipur', desc: 'City Palace · Lake Pichola · Saheliyon' },
      { day: 'Day 4-5', title: 'Pushkar', desc: 'Brahma Temple · Pushkar Lake · Camel Fair' },
    ]
  },
]

export const grievances = [
  { id: 'GRV-2026-04812', title: 'Overcharging at Camel Safari', location: 'Pushkar', status: 'in_progress', priority: 'high', category: 'Overcharging', date: 'Apr 22', icon: '💰', color: '#FEF3C7', days: 1, officer: 'Anita Sharma', comments: [{ who: 'You', msg: 'Camel safari operator at Pushkar quoted ₹500 per person but charged ₹1,500 each.', time: 'Apr 22, 2:14 PM' }, { who: 'Officer Anita Sharma', msg: 'Contacted BSP. Awaiting receipts by EOD.', time: 'Apr 23, 11 AM' }] },
  { id: 'GRV-2026-04657', title: 'Toilet maintenance — Amber Fort', location: 'Jaipur', status: 'resolved', priority: 'medium', category: 'Infrastructure', date: 'Apr 15', icon: '🚧', color: '#D1FAE5', rating: 4, officer: 'Rajesh Kumar' },
  { id: 'GRV-2026-04598', title: 'Misleading hotel description', location: 'Udaipur', status: 'open', priority: 'medium', category: 'BSP / Operator', date: 'Apr 10', icon: '🏨', color: '#DBEAFE', officer: null },
]

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('pink')
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cart, setCart] = useState(null)
  const [toast, setToast] = useState(null)

  const login = (userData) => {
    setUser(userData || { name: 'Vikram Singh', initials: 'VS', mobile: '+91 98290•••345', tier: 'Gold', trips: 4, points: 2840 })
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <AppContext.Provider value={{ theme, setTheme, user, isLoggedIn, login, logout, cart, setCart, toast, showToast, destinations, packages, grievances }}>
      <div data-theme={theme}>
        {children}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
