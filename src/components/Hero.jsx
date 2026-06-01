import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Sun, ShieldCheck, FileCheck, ArrowRight, Activity } from 'lucide-react'
import heroImg from '../assets/hero.jpg'

const metrics = [
  { icon: <Activity size={24} />, label: 'Electricity Cost', value: 'Lower Bills' },
  { icon: <Sun size={24} />, label: 'Renewable Energy', value: 'Clean Access' },
  { icon: <ShieldCheck size={24} />, label: 'Tariff Stability', value: 'Long-Term Stable Rates' },
  { icon: <FileCheck size={24} />, label: 'Procurement', value: 'Simplified' },
]

export default function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('.fade-up')
    els?.forEach((el, i) => {
      el.style.opacity = 0
      el.style.transform = 'translateY(28px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        el.style.opacity = 1
        el.style.transform = 'none'
      }, 150 + i * 150)
    })
  }, [])

  return (
    <section ref={heroRef} id="home" style={{
      position:'relative', minHeight:'100vh',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'clamp(140px, 20vw, 180px) clamp(1rem, 5vw, 2rem) clamp(40px, 8vw, 80px)', overflow:'hidden',
    }}>
      {/* Background Image with Bottom Fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.35 // Soft opacity for readability
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to bottom, rgba(253, 252, 248, 0), var(--background))'
        }} />
      </div>

      {/* Organic Blobs */}
      <div className="blob-bg blob-1" style={{ top: '10%', left: '15%', width: 500, height: 400 }} />
      <div className="blob-bg blob-2" style={{ top: '30%', right: '10%', width: 600, height: 500 }} />

      <h1 className="fade-up" style={{
        fontFamily:'var(--ff-display)', fontWeight:700, lineHeight:1.1,
        letterSpacing:'-0.02em', maxWidth:900, marginBottom:'2rem',
        fontSize:'clamp(2.2rem, 8vw, 5.5rem)', position:'relative', zIndex:1,
        color: 'var(--foreground)'
      }}>
        <em style={{fontStyle:'italic', color:'var(--primary)', fontWeight: 600}}>Affordable<br className="mobile-br"/> Renewable</em><br/>
        Electricity for<br/>
        Industrial MSMEs
      </h1>

      <div className="fade-up hero-buttons" style={{
        display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap',
        justifyContent:'center', marginBottom:'2.5rem', position:'relative', zIndex:1,
      }}>
        <Link to="/contact" className="btn-organic" style={{
          background:'var(--primary)', color:'var(--primary-foreground)',
          fontSize:16, padding:'16px 36px',
          boxShadow:'var(--shadow-soft)',
          justifyContent: 'center'
        }}>
          Get Cost Analysis <ArrowRight size={18} />
        </Link>
        <Link to="/solutions" className="btn-organic" style={{
          background:'transparent', color:'var(--secondary)',
          fontSize:16, padding:'14px 34px',
          border:'2px solid var(--secondary)',
          justifyContent: 'center'
        }}>
          How It Works
        </Link>
      </div>

      <p className="fade-up hero-desc" style={{
        fontSize:'clamp(1.125rem, 2vw, 1.35rem)', color:'var(--muted-foreground)', maxWidth:600,
        marginBottom:'5rem', fontWeight:400, lineHeight:1.8, zIndex:1, position:'relative',
        fontFamily: 'var(--ff-body)'
      }}>
        Helping MSMEs reduce electricity costs through renewable energy aggregation, group captive, and open-access procurement models.
      </p>

      {/* Metrics strip - Organic styled */}
      <div className="fade-up" style={{
        display:'flex', alignItems:'stretch', flexWrap: 'wrap',
        background:'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(222, 216, 207, 0.5)',
        borderRadius:'2rem', overflow:'hidden',
        position:'relative', zIndex:1, maxWidth:1000, width:'100%',
        boxShadow:'var(--shadow-float)',
      }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            flex:'1 1 200px', padding:'2rem 1.5rem', display:'flex', flexDirection:'column', gap:8,
            borderRight: i < metrics.length - 1 ? '1px solid rgba(222, 216, 207, 0.5)' : 'none',
            borderBottom: i < metrics.length - 1 ? 'none' : 'none',
            textAlign:'center', transition:'all 0.4s ease', alignItems: 'center'
          }}
          className="metric-item"
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.9)'; e.currentTarget.style.transform='translateY(-4px)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'}}>
            <div style={{
              width:48, height:48, background:'var(--muted)', borderRadius:'40% 60% 70% 30% / 40% 50% 60% 50%',
              display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8,
              color:'var(--primary)', transition: 'all 0.4s ease'
            }}>
              {m.icon}
            </div>
            <div style={{fontSize:12,color:'var(--muted-foreground)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>{m.label}</div>
            <div style={{fontFamily:'var(--ff-display)',fontSize:'1.4rem',fontWeight:700,color:'var(--foreground)',lineHeight:1.2}}>{m.value}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 900px) {
          .metric-item { border-right: none !important; border-bottom: 1px solid rgba(222, 216, 207, 0.5) !important; flex: 1 1 45% !important; }
          .metric-item:last-child { border-bottom: none !important; }
        }
        @media (max-width: 480px) {
          .metric-item { flex: 1 1 100% !important; }
        }
      `}</style>
    </section>
  )
}
