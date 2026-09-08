import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container } from './utils'

import openAccessImg from '../assets/solutions/open_access.jpg'
import industriesImg from '../assets/solutions/industries.jpg'
import businessModelImg from '../assets/about/business_model.jpeg'

const features = [
  {
    title: "I&C Demand Aggregation",
    desc: "We pool energy demand across industrial clusters to negotiate institutional tariffs directly with tier-1 solar and wind developers.",
    path: "/solutions",
    image: industriesImg,
    bullets: [
      "Aggregated I&C buying power accessing tier-1 developer rates",
      "Direct grid injection with up to 30-40% energy cost reduction",
      "Long-term fixed tariff hedging against DISCOM rate hikes",
      "Predictable utility savings with zero internal complexity"
    ]
  },
  {
    title: "Open-Access Power Procurement",
    desc: "Enabling small and medium industrial facilities to procure clean utility-scale solar and wind electricity seamlessly via the state grid.",
    path: "/solutions",
    image: openAccessImg,
    bullets: [
      "Direct procurement from high-efficiency solar & wind parks",
      "Zero disruption to facility operations or power reliability",
      "Substantial reduction in corporate carbon emissions & ESG footprint",
      "Transparent wheeling and energy accounting coordination"
    ]
  },
  {
    title: "Aligned Business Model",
    desc: "No expensive consulting fees. We earn margins on the units of electricity successfully delivered, ensuring we only win when you save.",
    path: "/market",
    image: businessModelImg,
    bullets: [
      "No upfront consulting or advisory service fees",
      "Performance pricing strictly tied to verified unit savings",
      "Transparent per-unit billing with zero hidden surcharges",
      "Shared success structure ensuring maximum energy yield"
    ]
  }
]

export default function WhatWeDoCarousel() {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const headerRef = useFadeIn()
  
  const nextSlide = () => {
    setCurrent(c => (c === features.length - 1 ? 0 : c + 1))
  }
  
  const prevSlide = () => {
    setCurrent(c => (c === 0 ? features.length - 1 : c - 1))
  }

  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setCurrent(c => (c === features.length - 1 ? 0 : c + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [isHovered])

  return (
    <section id="what-we-do" style={{ ...sectionPad, background: 'var(--background)', overflow: 'hidden' }}>
      <div style={container}>
        
        {/* Section Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel>What We Do</SectionLabel>
          <SectionHeading style={{ maxWidth: 650, margin: '0 auto 1.25rem' }}>
            Unlocking Renewable Value
          </SectionHeading>
          <SectionBody style={{ margin: '0 auto', maxWidth: 650 }}>
            Sun Sutra acts as a single aggregator of fragmented industrial loads to secure tier-1 solar and wind power agreements, passing the savings to I&C consumers.
          </SectionBody>
        </div>

        {/* Carousel Viewport */}
        <div 
          style={{ position: 'relative', width: '100%', borderRadius: '40px', overflow: 'hidden' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Carousel Track */}
          <div style={{
            display: 'flex',
            width: '100%',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: `translateX(-${current * 100}%)`,
          }}>
            {features.map((f, idx) => {
              const isActive = idx === current
              return (
                <div 
                  key={idx} 
                  className="wwd-slide-card"
                  style={{
                    minWidth: '100%',
                    flex: '0 0 100%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '40px',
                    boxShadow: 'var(--shadow-card)',
                    padding: 'clamp(2rem, 4vw, 3.5rem)',
                    boxSizing: 'border-box',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                  }}
                >
                  <div className="wwd-card-grid">
                    
                    {/* Content Column */}
                    <div className="wwd-content-col">
                      <h3 
                        className="wwd-title"
                        style={{
                          fontFamily: 'var(--ff-display)',
                          fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                          fontWeight: 800,
                          lineHeight: 1.2,
                          color: 'var(--foreground)',
                          margin: 0
                        }}
                      >
                        {f.title}
                      </h3>

                      {/* Small Section Divider */}
                      <div 
                        className="wwd-divider"
                        style={{
                          width: 48,
                          height: 3,
                          background: 'var(--foreground)',
                          borderRadius: 2,
                          margin: '1.25rem 0 1.5rem 0',
                          opacity: 0.85
                        }}
                      />

                      {/* Description */}
                      <p 
                        className="wwd-desc"
                        style={{
                          fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                          lineHeight: 1.7,
                          color: 'var(--muted-foreground)',
                          fontFamily: 'var(--ff-body)',
                          margin: '0 0 1.75rem 0'
                        }}
                      >
                        {f.desc}
                      </p>

                      {/* Feature Bullets */}
                      <ul 
                        className="wwd-bullets"
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: '0 0 2.25rem 0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem'
                        }}
                      >
                        {f.bullets.map((bullet, bIdx) => (
                          <li 
                            key={bIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              fontSize: '0.95rem',
                              color: 'var(--foreground)',
                              fontFamily: 'var(--ff-body)',
                              fontWeight: 500,
                              lineHeight: 1.4
                            }}
                          >
                            <div style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: 'var(--background)',
                              border: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              color: 'var(--foreground)'
                            }}>
                              <CheckCircle2 size={13} />
                            </div>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Primary CTA Button */}
                      <div className="wwd-cta-wrap">
                        <Link 
                          to={f.path} 
                          className="wwd-cta-btn"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '0.85rem 1.75rem',
                            background: 'var(--foreground)',
                            color: 'var(--background)',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            fontFamily: 'var(--ff-body)',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                          }}
                        >
                          <span>Learn More</span>
                          <ArrowRight size={18} className="wwd-arrow-icon" />
                        </Link>
                      </div>
                    </div>

                    {/* Image Column */}
                    <div className="wwd-image-col">
                      <div 
                        style={{
                          background: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: '24px',
                          padding: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <img 
                          src={f.image} 
                          alt={f.title} 
                          loading="lazy" 
                          style={{
                            width: '100%',
                            maxHeight: '340px',
                            objectFit: 'cover',
                            borderRadius: '16px',
                            display: 'block'
                          }} 
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation Controls & Pagination Indicators */}
        <div 
          className="wwd-controls"
          style={{ 
            marginTop: '2.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '1.5rem'
          }} 
        >
          {/* Elegant Pagination Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {features.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  height: '10px',
                  width: idx === current ? '28px' : '10px',
                  borderRadius: '9999px',
                  background: idx === current ? 'var(--foreground)' : 'var(--border)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>

          {/* Clean Outlined Circular Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button 
              onClick={prevSlide} 
              aria-label="Previous slide"
              className="wwd-nav-btn"
              style={{
                width: 46, 
                height: 46, 
                borderRadius: '50%', 
                background: 'var(--surface)', 
                color: 'var(--foreground)',
                border: '1px solid var(--border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
              }}
            >
              <ArrowLeft size={19} />
            </button>
            
            <div style={{ 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              color: 'var(--muted-foreground)', 
              fontFamily: 'var(--ff-body)',
              fontVariantNumeric: 'tabular-nums',
              minWidth: '42px',
              textAlign: 'center'
            }}>
              {current + 1} / {features.length}
            </div>
            
            <button 
              onClick={nextSlide} 
              aria-label="Next slide"
              className="wwd-nav-btn"
              style={{
                width: 46, 
                height: 46, 
                borderRadius: '50%', 
                background: 'var(--surface)', 
                color: 'var(--foreground)',
                border: '1px solid var(--border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
              }}
            >
              <ArrowRight size={19} />
            </button>
          </div>

        </div>

      </div>

      <style>{`
        .wwd-card-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(2rem, 4vw, 3.5rem);
          align-items: center;
        }

        .wwd-nav-btn:hover {
          transform: translateY(-2px);
          border-color: var(--foreground) !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
        }

        .wwd-nav-btn:active {
          transform: translateY(0);
        }

        .wwd-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
          opacity: 0.94;
        }

        .wwd-cta-btn:hover .wwd-arrow-icon {
          transform: translateX(4px);
        }

        .wwd-arrow-icon {
          transition: transform 0.25s ease;
        }

        @media (max-width: 900px) {
          .wwd-card-grid {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          .wwd-title { order: 1; }
          .wwd-divider { order: 2; margin: 0.5rem 0 1rem 0 !important; }
          .wwd-image-col { order: 3; width: 100%; margin-bottom: 0.5rem; }
          .wwd-desc { order: 4; }
          .wwd-bullets { order: 5; }
          .wwd-cta-wrap { order: 6; }
        }

        @media (max-width: 640px) {
          .wwd-slide-card {
            padding: 1.75rem 1.25rem !important;
            border-radius: 28px !important;
          }
          .wwd-controls {
            flex-direction: column;
            align-items: center;
            gap: 1.25rem;
          }
        }
      `}</style>
    </section>
  )
}
