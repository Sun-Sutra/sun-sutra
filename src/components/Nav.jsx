import { NavLink } from 'react-router-dom'
import sunsutraLogo from '../assets/shared/logo_rectangle.png'

export default function Nav() {
  const links = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: 'ABOUT US' },
    { to: '/solutions', label: 'SOLUTIONS' }
  ]

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      padding: '20px 60px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit'
    }}>
      {/* Logo Container (Left) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={sunsutraLogo} alt="Sun Sutra" style={{ height: 45 }} />
        </NavLink>
      </div>

      {/* Centered Links */}
      <ul style={{ display: 'flex', gap: '3rem', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
        {links.map(l => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              style={({ isActive }) => ({
                color: 'var(--foreground)',
                textDecoration: 'none',
                fontSize: 12,
                fontFamily: 'var(--ff-display)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                paddingBottom: '4px',
                borderBottom: isActive ? '2px solid var(--foreground)' : '2px solid transparent',
                transition: 'border-color 0.3s'
              })}
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Button Container (Right) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <NavLink to="/analysis" style={{
          background: 'var(--foreground)',
          color: 'var(--background)',
          padding: '12px 24px',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontSize: 12,
          fontFamily: 'var(--ff-display)',
          fontWeight: 700,
          letterSpacing: '0.1em',
        }}>
          GET ANALYSIS
        </NavLink>
      </div>
    </nav>
  )
}
