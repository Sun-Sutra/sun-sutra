import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Layers, Briefcase } from 'lucide-react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import maharashtraClustersImg from '../assets/maharashtra_clusters.png'
import groupCaptiveImg from '../assets/group_captive.jpeg'
import regulatoryOnboardingImg from '../assets/regulatory_onboarding.jpeg'
import businessModelImg from '../assets/business_model.jpeg'
import savingImg from '../assets/saving.jpg'

const flowItems = [
  { 
    icon: <MapPin size={20} />, 
    title: 'Maharashtra Industrial Clusters', 
    desc: 'Focused on Pune and nearby MIDC regions for initial rollout',
    image: maharashtraClustersImg
  },
  { 
    icon: <Layers size={20} />, 
    title: 'Group Captive & Open Access', 
    desc: 'Leveraging proven procurement models for MSME access',
    image: groupCaptiveImg
  },
  { 
    icon: <Briefcase size={20} />, 
    title: 'End-to-End Management', 
    desc: 'Compliance, onboarding, and operational coordination',
    image: regulatoryOnboardingImg
  },
]

export default function About() {
  const ref = useFadeIn()
  
  // Rotating images inside the About section card
  const aboutImages = [businessModelImg, maharashtraClustersImg, groupCaptiveImg, regulatoryOnboardingImg, savingImg]
  const [activeImgIdx, setActiveImgIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImgIdx(prev => (prev + 1) % aboutImages.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const getCaption = (idx) => {
    switch (idx) {
      case 0: return "Consolidating MSME Power Demand"
      case 1: return "Targeting Core Maharashtra Clusters"
      case 2: return "Securing Group Captive Sourcing"
      case 3: return "Streamlining Regulatory Compliance"
      case 4: return "Delivering Substantial Utility Savings"
      default: return "Affordable Clean Energy Access"
    }
  }

  const getLabel = (idx) => {
    switch (idx) {
      case 0: return "Aggregated Sourcing"
      case 1: return "Regional Footprint"
      case 2: return "Captive Model"
      case 3: return "Compliance & Operations"
      case 4: return "Client Value"
      default: return "About Us"
    }
  }

  return (
    <>
      <section id="about" style={{
        ...sectionPad,
        paddingTop: 'clamp(100px, 10vw, 140px)',
        background: 'var(--muted)',
        overflow: 'hidden'
      }}>
        <div className="blob-bg blob-3" style={{ top: '20%', left: '-10%', width: 400, height: 400 }} />
        <div ref={ref} style={{
          display:'grid', gridTemplateColumns:'1.1fr 1.35fr', gap:'4rem', alignItems:'center', position: 'relative', zIndex: 1,
          maxWidth: '100%', width: '100%',
          paddingLeft: 'max(2rem, calc((100vw - 1280px) / 2 + 2rem))',
          paddingRight: 0
        }} className="about-grid">
          <div style={{ paddingRight: '2rem' }}>
            <SectionLabel>About Us</SectionLabel>
            <SectionHeading>Building Affordable Renewable Energy Access</SectionHeading>
            <SectionBody>
              We are building an MSME-focused renewable energy aggregation business that enables industries to access affordable clean electricity through group captive and open-access procurement models.
            </SectionBody>
            <div style={{marginTop:'3rem', marginBottom: '1.5rem'}}>
              <Link to="/contact" className="btn-organic" style={{
                background:'var(--primary)', color:'var(--primary-foreground)',
                fontSize:16, padding:'16px 32px', boxShadow:'var(--shadow-soft)',
              }}>
                Partner With Us <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Asymmetric card containing the scrolling images, touching the right edge of the screen */}
          <div 
            className="about-image-card"
            style={{
              ...organicCardStyle,
              borderRadius: '4rem 0px 0px 4rem', /* Flat on the right side to stick to the screen edge */
              borderRight: 'none',
              background: 'var(--surface)',
              padding: 0,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-deep)',
              height: '590px',
              position: 'relative',
              width: '90%',
              marginLeft: 'auto'
            }}
          >
            {aboutImages.map((img, idx) => (
              <div key={idx} style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                opacity: idx === activeImgIdx ? 1 : 0,
                transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 8s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: idx === activeImgIdx ? 'scale(1.05)' : 'scale(1)',
                zIndex: idx === activeImgIdx ? 1 : 0
              }}>
                <img src={img} alt={getCaption(idx)} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }} />
              </div>
            ))}

            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
              padding: '2.5rem 2rem 2.5rem 3rem',
              color: '#FFFFFF',
              zIndex: 5
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FDE047' }}>
                {getLabel(activeImgIdx)}
              </span>
              <h4 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginTop: 6, fontWeight: 700, fontFamily: 'var(--ff-display)' }}>
                {getCaption(activeImgIdx)}
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* Current Focus Section */}
      <section id="current-focus" style={{
        ...sectionPad,
        paddingBottom: '64px',
        background: 'var(--background)',
        borderTop: '1px solid var(--border)'
      }}>
        <div className="blob-bg blob-2" style={{ bottom: '10%', right: '-5%', width: 500, height: 500 }} />
        <div style={container}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: 800, margin: '0 auto' }}>
            <SectionLabel>Our Strategy</SectionLabel>
            <SectionHeading style={{ color: 'var(--primary)' }}>Current Focus Areas</SectionHeading>
            <SectionBody style={{ margin: '0 auto' }}>
              We are laser-focused on Maharashtra's key industrial corridors, developing aggregation systems that scale power delivery.
            </SectionBody>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2.5rem',
            marginBottom: '4rem',
            marginTop: '4rem'
          }} className="focus-grid">
            {flowItems.map((item, i) => (
              <div key={i} className="focus-card" style={{
                ...organicCardStyle,
                background: 'var(--surface)',
                padding: 0,
                borderRadius: i === 0 ? '3rem 1.5rem 4rem 1.5rem' : i === 1 ? '1.5rem 3rem 1.5rem 4rem' : '4rem 1.5rem 3rem 1.5rem',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
                height: '380px',
                position: 'relative'
              }}>
                {/* Full Card Image */}
                <img src={item.image} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Default Dark bottom gradient for text readability */}
                <div className="dark-gradient" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
                  pointerEvents: 'none',
                  transition: 'opacity 0.4s ease',
                  zIndex: 1
                }} />
                
                {/* Hover white transparent overlay */}
                <div className="focus-hover-bg" style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(253, 252, 248, 0.6)',
                  opacity: 0,
                  transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 2
                }} />
                
                {/* Content Container (holds heading and description) */}
                <div className="focus-card-content" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '2.5rem 2rem',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end',
                  minHeight: '180px',
                  zIndex: 3,
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {/* Heading */}
                  <h3 className="focus-card-heading" style={{
                    fontSize: '1.2rem', fontWeight: 700, margin: 0,
                    fontFamily: 'var(--ff-display)', color: '#FFFFFF',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(36px)', /* Shifts up on hover */
                    lineHeight: 1.3
                  }}>
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="focus-card-desc" style={{
                    fontSize: '0.9rem', color: 'var(--foreground)',
                    lineHeight: 1.6, marginTop: '1rem', marginBottom: 0,
                    opacity: 0,
                    transform: 'translateY(15px)',
                    transition: 'opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
                  }}>
                    {item.desc}
                  </p>
                </div>
                
              </div>
            ))}
          </div>

          <div style={{
            ...organicCardStyle,
            background: 'var(--muted)',
            padding: '3rem',
            borderRadius: '2rem 4rem 2rem 4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '3rem',
            flexWrap: 'wrap'
          }} className="comparison-card">
            <div style={{ flex: '1 1 400px' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--foreground)' }}>
                Substantial Tariff Reductions
              </h3>
              <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                By aggregating loads, we negotiate directly with tier-1 power generators. This allows us to secure stable, long-term power purchase agreements (PPAs) that bypass high retail tariffs.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', flex: '1 1 300px', justifyContent: 'center' }}>
              {[['₹7-15', 'Sunsutra Tariff', 'var(--primary)'], ['₹9-17', 'Grid Tariff', 'var(--destructive)']].map(([num, label, color]) => (
                <div key={label} style={{
                  flex: 1, padding: 'clamp(1.25rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1.5rem)', background: 'var(--surface)',
                  borderRadius: '1.5rem', border: '1px solid rgba(222,216,207,0.8)',
                  textAlign: 'center', minWidth: '120px', boxShadow: 'var(--shadow-soft)'
                }} className="rate-card">
                  <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 700, color, lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .focus-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease !important;
        }
        .focus-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-deep) !important;
        }
        .focus-card:hover .dark-gradient {
          opacity: 0 !important;
        }
        .focus-card:hover .focus-hover-bg {
          opacity: 1 !important;
        }
        .focus-card:hover .focus-card-heading {
          color: var(--foreground) !important;
          transform: translateY(0) !important;
        }
        .focus-card:hover .focus-card-desc {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @media(max-width:900px){
          .about-grid{
            grid-template-columns:1fr!important;
            gap:2rem!important;
            padding-left:clamp(1rem, 5vw, 2rem)!important;
            padding-right:clamp(1rem, 5vw, 2rem)!important;
          }
          .about-image-card {
            border-radius:2rem!important;
            border-right:1px solid rgba(222, 216, 207, 0.5)!important;
            height:300px!important;
            width:100%!important;
          }
          .focus-grid{grid-template-columns:1fr!important;gap:1.5rem!important}
          .focus-grid > div { height: 300px !important; }
          .comparison-card{flex-direction:column!important;text-align:center!important;padding:1.5rem!important;gap:2rem!important}
          .comparison-card > div {
            flex: none !important;
          }
          .comparison-card > div:last-child { 
            flex-direction: row !important; 
            gap: 1rem !important; 
            width: 100% !important;
          }
        }
        @media(max-width:480px) {
          .about-image-card { height: 240px !important; }
        }
      `}</style>
    </>
  )
}
