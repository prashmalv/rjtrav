import { useState } from 'react'
import { useApp } from '../context/AppContext'

const LANGS = [
  { code: 'English',  flag: '🇬🇧', label: 'EN' },
  { code: 'Hindi',    flag: '🇮🇳', label: 'हिं' },
  { code: 'German',   flag: '🇩🇪', label: 'DE' },
  { code: 'French',   flag: '🇫🇷', label: 'FR' },
  { code: 'Japanese', flag: '🇯🇵', label: 'JP' },
  { code: 'Spanish',  flag: '🇪🇸', label: 'ES' },
]

export default function LanguageSelector({ light = false }) {
  const { appLanguage, setAppLanguage } = useApp()
  const [open, setOpen] = useState(false)
  const current = LANGS.find(l => l.code === appLanguage) || LANGS[0]

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: light ? 'rgba(255,255,255,0.2)' : 'var(--soft)',
          border: light ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--border)',
          borderRadius: 20, padding: '4px 10px',
          fontSize: 11.5, fontWeight: 700,
          color: light ? '#fff' : 'var(--ink)',
          cursor: 'pointer', backdropFilter: 'blur(6px)',
        }}
      >
        <span style={{ fontSize: 13 }}>{current.flag}</span>
        {current.label}
        <span style={{ fontSize: 8, opacity: 0.7 }}>▼</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
          <div style={{
            position: 'absolute', top: 34, right: 0, zIndex: 99,
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden', minWidth: 140,
          }}>
            {LANGS.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setAppLanguage(lang.code); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', fontSize: 12.5, fontWeight: 600,
                  color: lang.code === appLanguage ? 'var(--primary)' : 'var(--ink)',
                  background: lang.code === appLanguage ? 'var(--primary-ghost)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderBottom: '1px solid var(--soft)',
                }}
              >
                <span style={{ fontSize: 16 }}>{lang.flag}</span>
                {lang.code}
                {lang.code === appLanguage && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 14 }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
