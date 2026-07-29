import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import navLogo from '../assets/shared/logo_rectangle.png'

export default function Footer() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/solutions', label: 'Solutions' },
    { to: '/contact', label: 'Get Analysis' },
  ]

  return (
    <footer style={{
      background: 'var(--foreground)', // rich dark charcoal
      color: '#a3a3a3',
      padding: '4rem 2rem 2rem',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Footer Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
        }} className="footer-grid">
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link to="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              <img 
                src={navLogo} 
                alt="Sun Sutra" 
                style={{ 
                  height: '42px', 
                  filter: 'brightness(0) invert(1)', // make logo white on dark bg
                  objectFit: 'contain' 
                }} 
              />
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0, color: '#8e8e8e' }}>
              Empowering MSMEs across Maharashtra with seamless open-access renewable energy solutions.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              {[
                {
                  href: '#',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  )
                },
                {
                  href: '#',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  )
                },
                {
                  href: '#',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.href} 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a3a3a3',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#a3a3a3';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.05em', margin: 0 }}>
              QUICK NAVIGATION
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {links.map(l => (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  style={{
                    fontSize: '0.9rem',
                    color: '#8e8e8e',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#8e8e8e'}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.05em', margin: 0 }}>
              GET IN TOUCH
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#8e8e8e' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>IIT Kharagpur Cluster, West Bengal / Maharashtra, India</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--primary)' }} />
                <span>+91 99999 99999</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                <span>contact@sunsutraenergy.com</span>
              </div>
            </div>
          </div>

          {/* Interactive CTA Box */}
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>
              Slash Your Grid Bills
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: '#8e8e8e' }}>
              Upload your power bill today and get a free, detailed 10-year PPA analysis.
            </p>
            <Link 
              to="/contact" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'var(--primary)',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '700',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Free Analysis <ArrowRight size={14} />
            </Link>
          </div>

        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', width: '100%' }} />

        {/* Footer Bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#6b7280'
        }}>
          <span>© {new Date().getFullYear()} Sun Sutra Energy. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#6b7280'}>Privacy Policy</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#6b7280'}>Terms of Service</a>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  )
}
