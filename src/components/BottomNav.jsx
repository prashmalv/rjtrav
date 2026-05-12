import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function BottomNav({ dark }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useApp()

  const items = [
    { ico: '🏠', label: 'Home', path: isLoggedIn ? '/home' : '/visitor' },
    { ico: '🧭', label: 'Explore', path: '/explore' },
    { ico: '🎫', label: 'Trips', path: '/my-trips' },
    { ico: '🤖', label: 'Padharo', path: '/ai-chat' },
    { ico: '👤', label: isLoggedIn ? 'Me' : 'Sign In', path: isLoggedIn ? '/profile' : '/login' },
  ]

  return (
    <div className={`bottomnav${dark ? ' dark' : ''}`}>
      {items.map((item) => {
        const active = location.pathname === item.path ||
          (item.path === '/home' && location.pathname === '/home') ||
          (item.path === '/visitor' && location.pathname === '/visitor')
        return (
          <button key={item.label} className={`bn-item${active ? ' active' : ''}`} onClick={() => navigate(item.path)}>
            <span className="bn-ico">{item.ico}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
