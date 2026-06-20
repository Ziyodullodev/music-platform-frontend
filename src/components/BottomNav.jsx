import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', end: true, icon: 'home', label: 'Home' },
  { to: '/playlists', icon: 'library_music', label: 'Playlists' },
  { to: '/profile', icon: 'person', label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-[68px] px-6"
      style={{ background: '#12192b', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {navItems.map(({ to, end, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex flex-col items-center justify-center gap-1 w-16 active:scale-90 transition-all duration-200"
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[22px] transition-colors duration-200 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className={`text-[11px] font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
