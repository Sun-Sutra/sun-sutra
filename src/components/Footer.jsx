import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import navLogo from '../assets/nav.png'

export default function Footer() {
  const links = [
    {to:'/',label:'Home'},
    {to:'/about',label:'About Us'},
    {to:'/solutions',label:'Solutions'},
    {to:'/market',label:'Market & Model'},
    {to:'/contact',label:'Contact'},
  ]
  return (
    <footer style={{
      borderTop:'1px solid var(--border)', padding:'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 2rem)',
      background:'var(--background)', position:'relative', zIndex:1,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <Link to="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
            <div style={{ height: 40, display:'flex', alignItems:'center', marginTop: '-5px' }}>
              <img src={navLogo} alt="Sun Sutra" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
            </div>
          </Link>
          
          <div style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                fontSize:15, color:'var(--muted-foreground)', textDecoration:'none', transition:'color 0.3s',
              }}
              onMouseEnter={e=>e.target.style.color='var(--foreground)'}
              onMouseLeave={e=>e.target.style.color='var(--muted-foreground)'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', width: '100%', opacity: 0.5 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{fontSize:14,color:'var(--muted-foreground)'}}>© 2026 Sun Sutra Energy.</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[MapPin, Phone, Mail].map((Icon, i) => (
              <a key={i} href="#" style={{
                width: 40, height: 40, borderRadius: '50%', background: 'rgba(93, 112, 82, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                transition: 'all 0.3s ease', border: '1px solid transparent'
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--primary)';e.currentTarget.style.color='var(--primary-foreground)';e.currentTarget.style.transform='scale(1.1)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(93, 112, 82, 0.05)';e.currentTarget.style.color='var(--primary)';e.currentTarget.style.transform='scale(1)'}}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
