import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import sunsutraLogo from '../assets/shared/logo_rectangle.png'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: 'ABOUT US' },
    { to: '/solutions', label: 'SOLUTIONS' }
  ]

  // Close mobile menu automatically on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Close mobile menu if window is resized above mobile breakpoint (900px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav className="site-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 60px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
      transition: 'padding 0.3s ease'
    }}>
      {/* Logo Container (Left) */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setIsOpen(false)}>
          <img src={sunsutraLogo} alt="Sun Sutra" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
        </NavLink>
      </div>

      {/* Desktop Links (Center) */}
      <ul className="desktop-nav-links" style={{ display: 'flex', gap: '3rem', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
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

      {/* Desktop Button Container (Right) */}
      <div className="desktop-nav-cta" style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          transition: 'transform 0.2s ease, opacity 0.2s ease'
        }}>
          GET ANALYSIS
        </NavLink>
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        className="mobile-hamburger-btn"
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: '12px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--foreground)',
          cursor: 'pointer',
          padding: 0,
          zIndex: 60,
          transition: 'all 0.2s ease'
        }}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Drawer Menu */}
      <div
        className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          width: '100vw',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 55,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20
        }}>
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            <img src={sunsutraLogo} alt="Sun Sutra" style={{ height: 38 }} />
          </NavLink>
        </div>

        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.75rem'
        }}>
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => ({
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  fontSize: '1.25rem',
                  fontFamily: 'var(--ff-display)',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  paddingBottom: '6px',
                  borderBottom: isActive ? '3px solid var(--foreground)' : '3px solid transparent',
                  transition: 'all 0.3s ease'
                })}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink
          to="/analysis"
          onClick={() => setIsOpen(false)}
          style={{
            background: 'var(--foreground)',
            color: 'var(--background)',
            padding: '16px 36px',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontFamily: 'var(--ff-display)',
            fontWeight: 800,
            letterSpacing: '0.1em',
            boxShadow: 'var(--shadow-card)',
            marginTop: '1rem'
          }}
        >
          GET ANALYSIS
        </NavLink>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .site-nav {
            padding: 16px 20px !important;
          }
          .desktop-nav-links,
          .desktop-nav-cta {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  )
}
