import { useNavigate } from 'react-router-dom'

export default function AppBar({ title, back, actions, variant, onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else if (back === true) navigate(-1)
    else if (back) navigate(back)
  }

  return (
    <div className={`appbar${variant ? ' ' + variant : ''}`}>
      {(back || onBack) && (
        <button className="appbar-back" onClick={handleBack}>←</button>
      )}
      <span className="appbar-title">{title}</span>
      {actions && (
        <div className="flex gap-2">
          {actions.map((a, i) => (
            <button key={i} className="appbar-action" onClick={a.onClick}>{a.icon}</button>
          ))}
        </div>
      )}
    </div>
  )
}
