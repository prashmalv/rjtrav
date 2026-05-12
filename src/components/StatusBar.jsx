export default function StatusBar({ light }) {
  const now = new Date()
  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')
  return (
    <div className={`statusbar${light ? ' light' : ''}`}>
      <span>{h}:{m}</span>
      <span className="signal">📶 ▾ 🔋</span>
    </div>
  )
}
