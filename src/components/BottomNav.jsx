import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'
import NearbySearch from './NearbySearch'

export default function BottomNav({ dark }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, appLanguage } = useApp()
  const t = useT(appLanguage)

  const items = [
    { ico: '🏠', label: t.home, path: isLoggedIn ? '/home' : '/visitor' },
    { ico: '🧭', label: t.explore, path: '/explore' },
    { ico: '🎫', label: t.trips, path: '/my-trips' },
    { ico: '🤖', label: t.chat, path: '/ai-chat' },
    { ico: '👤', label: isLoggedIn ? t.profile : t.home, path: isLoggedIn ? '/profile' : '/login' },
  ]

  return (
    <>
    <NearbySearch bottomOffset={68} />
    <div className={`bottomnav${dark ? ' dark' : ''}`}>
      {items.map((item) => {
        const active = location.pathname === item.path ||
          (item.path === '/home' && location.pathname === '/home') ||
          (item.path === '/visitor' && location.pathname === '/visitor')
        return (
          <button key={item.path} className={`bn-item${active ? ' active' : ''}`} onClick={() => navigate(item.path)}>
            <span className="bn-ico">{item.ico}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
    </>
  )
}
