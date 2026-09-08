import { useState, useEffect } from 'react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import maharashtraClustersImg from '../assets/about/maharashtra_clusters.png'
import groupCaptiveImg from '../assets/about/group_captive.jpeg'
import regulatoryOnboardingImg from '../assets/about/regulatory_onboarding.jpeg'
import businessModelImg from '../assets/about/business_model.jpeg'
import savingImg from '../assets/about/saving.jpg'

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
      case 0: return "Consolidating I&C Power Demand"
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
        padding: 'clamp(40px, 6vw, 80px) 0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={container}>
          <div ref={ref} className="about-hero-grid">

            {/* Left Column: Text & CTA */}
            <div className="about-hero-content">
              <SectionLabel>About Us</SectionLabel>
              <SectionHeading style={{ margin: '0 0 1.25rem 0', lineHeight: 1.15 }}>
                Building Affordable Renewable Energy Access
              </SectionHeading>
              <SectionBody style={{ margin: '0 0 2rem 0', maxWidth: '540px' }}>
                We are building an I&C-focused renewable energy aggregation business that enables industrial and commercial consumers to access affordable clean electricity through group captive and open-access procurement models.
              </SectionBody>
            </div>

            {/* Right Column: Balanced Image Card */}
            <div className="about-image-card-wrapper">
              <div
                className="about-image-card"
                style={{
                  ...organicCardStyle,
                  borderRadius: '2.5rem',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  padding: 0,
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  height: '480px',
                  width: '100%',
                  position: 'relative'
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
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                  padding: '2.25rem 2rem 2rem 2rem',
                  color: '#FFFFFF',
                  zIndex: 5
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FDE047' }}>
                    {getLabel(activeImgIdx)}
                  </span>
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginTop: 6, fontWeight: 700, fontFamily: 'var(--ff-display)', margin: '6px 0 0 0' }}>
                    {getCaption(activeImgIdx)}
                  </h4>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .about-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(2rem, 4vw, 3.5rem);
          align-items: center;
        }

        @media(max-width:900px){
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .about-image-card {
            border-radius: 2rem !important;
            height: 340px !important;
            width: 100% !important;
          }
        }
        @media(max-width:480px) {
          .about-image-card { height: 260px !important; }
        }
      `}</style>
    </>
  )
}
