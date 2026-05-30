import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import navLogo from '../assets/nav.png'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/solutions', label: 'Solutions' },
    { to: '/market', label: 'Market & Model' },
  ]

  return (
    <div style={{
      position: 'fixed', top: scrolled ? 16 : 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '0 2rem' : '1rem 2rem',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex', justifyContent: 'center'
    }}>
      <nav style={{
        width: '100%', maxWidth: 1200, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(253,252,248,0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        border: scrolled ? '1px solid rgba(222, 216, 207, 0.5)' : '1px solid transparent',
        borderRadius: scrolled ? '9999px' : 0,
        padding: '0 1.5rem',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: scrolled ? 'var(--shadow-soft)' : 'none',
      }}>
        <Link to="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <div style={{ height: 40, display:'flex', alignItems:'center', marginTop: '-5px' }}>
            <img src={navLogo} alt="Sun Sutra" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
          </div>
        </Link>

        {/* Desktop links */}
        <ul style={{display:'flex',alignItems:'center',gap:'2.5rem',listStyle:'none'}} className="desktop-nav">
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                  textDecoration: 'none',
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 500,
                  transition: 'color 0.3s',
                  position: 'relative'
                })}
                onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.color='var(--foreground)' }}
                onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.color='var(--muted-foreground)' }}
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <span style={{
                        position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
                        width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)'
                      }}/>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/contact" className="btn-organic" style={{
              background:'var(--primary)',color:'var(--primary-foreground)',
              padding:'10px 24px',fontSize:15,textDecoration:'none',
              boxShadow:'var(--shadow-soft)'
            }}>
              Get Analysis
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display:'none', background:'none', border:'none',
          color:'var(--foreground)', cursor:'pointer',
        }} className="mobile-toggle">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position:'absolute', top: 80, left: '1rem', right: '1rem',
            background:'var(--surface)',
            border:'1px solid var(--border)', borderRadius: '2rem',
            padding:'2rem', display:'flex', flexDirection:'column',
            gap:'1.5rem', zIndex:99, boxShadow: 'var(--shadow-float)'
          }}>
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                  textDecoration: 'none',
                  fontSize: 18,
                  fontFamily: 'var(--ff-display)',
                  fontWeight: isActive ? 700 : 500
                })}
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="btn-organic" style={{
              background:'var(--primary)',color:'var(--primary-foreground)',
              padding:'12px 24px',fontSize:16,textDecoration:'none',
              textAlign:'center', marginTop: '1rem', justifyContent: 'center'
            }}>
              Get Analysis
            </Link>
          </div>
        )}

        <style>{`
          @media (max-width: 900px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: block !important; }
          }
        `}</style>
      </nav>
    </div>
  )
}
