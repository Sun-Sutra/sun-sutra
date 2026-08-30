import { Leaf, Sun, Coins, Share2, Layers } from 'lucide-react'
import { SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'

import groupCaptiveImg from '../assets/about/group_captive.jpeg'
import businessModelImg from '../assets/about/business_model.jpeg'
import openAccessImg from '../assets/solutions/open_access.jpg'
import sustainabilityImg from '../assets/solutions/sustainability.jpg'
import generatorsImg from '../assets/solutions/generators.jpg'

const flowItems = [
  { 
    icon: <Leaf size={18} />, 
    tag: 'Discom Model',
    title: 'Green Tariff', 
    desc: 'Procure 100% clean green power directly through DISCOM billing mechanisms without on-site installation or capital outlay.',
    image: sustainabilityImg
  },
  { 
    icon: <Sun size={18} />, 
    tag: 'Direct Ownership',
    title: 'Rooftop CAPEX', 
    desc: 'Self-owned on-site solar setup maximizing lifetime energy savings, complete asset control, and 40% accelerated depreciation tax benefits.',
    image: generatorsImg
  },
  { 
    icon: <Coins size={18} />, 
    tag: 'Zero Investment',
    title: 'Rooftop RESCO / OPEX', 
    desc: 'Zero-capex developer-funded rooftop solar model. The developer builds, operates, and maintains the plant while you pay only for units consumed.',
    image: businessModelImg
  },
  { 
    icon: <Share2 size={18} />, 
    tag: 'Off-Site Procurement',
    title: 'Third Party Open Access', 
    desc: 'Direct bilateral power purchase agreements (PPAs) with utility-scale solar and wind generators delivered via the state grid.',
    image: openAccessImg
  },
  { 
    icon: <Layers size={18} />, 
    tag: 'Aggregated Captive',
    title: 'Group Captive', 
    desc: '26% equity structure eliminating Cross-Subsidy Surcharge (CSS) and additional surcharges, securing the lowest landed tariff for I&C consumers.',
    image: groupCaptiveImg
  },
]

export default function SolutionsPortfolio() {
  return (
    <section id="solutions-portfolio" style={{
      ...sectionPad,
      paddingBottom: '80px',
      background: 'var(--background)',
      borderTop: '1px solid var(--border)'
    }}>
      <div style={container}>
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 3.5rem' }}>
          <SectionLabel>Our Solutions Portfolio</SectionLabel>
          <SectionHeading style={{ color: 'var(--primary)' }}>Current Focus Areas</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>
            We provide comprehensive renewable energy procurement models tailored for I&C (Industrial & Commercial) power consumers across Maharashtra.
          </SectionBody>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
          marginTop: '2.5rem'
        }} className="portfolio-focus-grid">
          {flowItems.map((item, i) => (
            <div key={i} className="portfolio-focus-card" style={{
              ...organicCardStyle,
              background: 'var(--surface)',
              padding: 0,
              borderRadius: i % 2 === 0 ? '2.5rem 1.5rem 2.5rem 1.5rem' : '1.5rem 2.5rem 1.5rem 2.5rem',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-soft)',
              height: '380px',
              position: 'relative'
            }}>
              {/* Full Card Image */}
              <img src={item.image} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Default Dark bottom gradient for text readability */}
              <div className="portfolio-dark-gradient" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
                pointerEvents: 'none',
                transition: 'opacity 0.4s ease',
                zIndex: 1
              }} />
              
              {/* Hover white transparent overlay */}
              <div className="portfolio-hover-bg" style={{
                position: 'absolute', inset: 0,
                background: 'rgba(253, 252, 248, 0.92)',
                opacity: 0,
                transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 2
              }} />
              
              {/* Content Container (holds heading, tag and description) */}
              <div className="portfolio-card-content" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '2.25rem 2rem',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end',
                minHeight: '190px',
                zIndex: 3,
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {/* Tag with Icon */}
                <div className="portfolio-card-tag" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#FDE047',
                  marginBottom: '8px',
                  transition: 'color 0.4s ease'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  <span>{item.tag}</span>
                </div>

                {/* Heading */}
                <h3 className="portfolio-card-heading" style={{
                  fontSize: '1.3rem', fontWeight: 800, margin: 0,
                  fontFamily: 'var(--ff-display)', color: '#FFFFFF',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(36px)',
                  lineHeight: 1.25
                }}>
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="portfolio-card-desc" style={{
                  fontSize: '0.88rem', color: 'var(--foreground)',
                  lineHeight: 1.55, marginTop: '0.85rem', marginBottom: 0,
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

        {/* Substantial Tariff Reductions Banner */}
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
        }} className="portfolio-comparison-card">
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
              }} className="portfolio-rate-card">
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 700, color, lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .portfolio-focus-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease !important;
        }
        .portfolio-focus-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-deep) !important;
        }
        .portfolio-focus-card:hover .portfolio-dark-gradient {
          opacity: 0 !important;
        }
        .portfolio-focus-card:hover .portfolio-hover-bg {
          opacity: 1 !important;
        }
        .portfolio-focus-card:hover .portfolio-card-tag {
          color: var(--primary) !important;
        }
        .portfolio-focus-card:hover .portfolio-card-heading {
          color: var(--foreground) !important;
          transform: translateY(0) !important;
        }
        .portfolio-focus-card:hover .portfolio-card-desc {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @media(max-width:900px){
          .portfolio-focus-grid{grid-template-columns:1fr!important;gap:1.5rem!important}
          .portfolio-focus-grid > div { height: 340px !important; }
          .portfolio-comparison-card{flex-direction:column!important;text-align:center!important;padding:1.5rem!important;gap:2rem!important}
          .portfolio-comparison-card > div {
            flex: none !important;
          }
          .portfolio-comparison-card > div:last-child { 
            flex-direction: row !important; 
            gap: 1rem !important; 
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}
