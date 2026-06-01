import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowRight as ArrowIcon } from 'lucide-react'
import { useFadeIn, SectionHeading, sectionPad } from './utils'

import groupCaptiveImg from '../assets/group_captive.jpeg'
import regulatoryOnboardingImg from '../assets/regulatory_onboarding.jpeg'
import businessModelImg from '../assets/business_model.jpeg'

const features = [
  {
    title: "Group Captive Sourcing",
    desc: "We structure group captive investments where generators provide clean energy directly to our MSME pool with zero upfront capex requirements.",
    path: "/solutions",
    image: groupCaptiveImg
  },
  {
    title: "Regulatory & Onboarding",
    desc: "We handle DISCOM approvals, open access compliance, and monthly scheduling so you can focus entirely on your manufacturing.",
    path: "/solutions",
    image: regulatoryOnboardingImg
  },
  {
    title: "Aligned Business Model",
    desc: "No expensive consulting fees. We earn margins on the units of electricity successfully delivered, ensuring we only win when you save.",
    path: "/market",
    image: businessModelImg
  }
]

export default function WhatWeDoCarousel() {
  const [current, setCurrent] = useState(0)
  const headerRef = useFadeIn()
  
  const nextSlide = () => {
    setCurrent(c => (c === features.length - 1 ? 0 : c + 1))
  }
  
  const prevSlide = () => {
    setCurrent(c => (c === 0 ? features.length - 1 : c - 1))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c === features.length - 1 ? 0 : c + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const progress = ((current + 1) / features.length) * 100

  return (
    <section id="what-we-do" style={{ ...sectionPad, background: 'var(--background)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
        
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 8, 
            fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', 
            textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: '1.5rem',
            fontFamily: 'var(--ff-body)'
          }}>
            <div style={{ width: 10, height: 10, background: '#FDE047' }} />
            What We Do
          </div>
          <SectionHeading style={{ maxWidth: 600, margin: '0 auto', color: '#2b3f30' }}>
            Unlocking Renewable Value
          </SectionHeading>
          <p style={{
            fontSize: '1.125rem', color: 'var(--muted-foreground)', maxWidth: 600, 
            margin: '1.5rem auto 0', lineHeight: 1.8, fontFamily: 'var(--ff-body)'
          }}>
            Sun Sutra acts as a single aggregator of fragmented industrial loads to secure tier-1 solar and wind power agreements, passing the savings to MSMEs.
          </p>
        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative', width: '100%', outline: 'none', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateX(calc(-${current * 100}% - ${current * 2}rem))`,
            gap: '2rem',
          }}>
            {features.map((f, idx) => {
              const isActive = idx === current
              return (
                <div key={idx} style={{
                  minWidth: '100%',
                  flex: '0 0 100%',
                  background: '#F5F5ED',
                  borderRadius: '1rem',
                  padding: '4rem 5rem',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '4rem',
                  alignItems: 'center',
                  opacity: isActive ? 1 : 0.4,
                  transform: isActive ? 'scale(1)' : 'scale(0.95)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative'
                }} className="whatwedo-card">
                  
                  {/* Left Column - Headline & Icon */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{
                      fontFamily: 'var(--ff-body)',
                      fontSize: '2.8rem',
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: '#2b3f30'
                    }}>
                      {f.title}
                    </h3>
                    
                    <div style={{
                      marginTop: '3rem',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0.95
                    }}>
                      <img src={f.image} alt={f.title} loading="lazy" style={{ width: '100%', maxWidth: 320, height: 'auto', borderRadius: '1.5rem', mixBlendMode: 'multiply' }} />
                    </div>
                  </div>

                  {/* Right Column - Description & Link */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2b3f30', marginBottom: '2rem' }} />
                    
                    <p style={{
                      fontSize: '1.2rem',
                      lineHeight: 1.7,
                      color: '#4b5563',
                      fontWeight: 400,
                      fontFamily: 'var(--ff-body)',
                      marginBottom: '3rem'
                    }}>
                      {f.desc}
                    </p>
                    
                    <Link to={f.path} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      fontSize: '1.05rem', color: '#2b3f30', textDecoration: 'none', 
                      fontWeight: 700, fontFamily: 'var(--ff-body)', transition: 'opacity 0.3s'
                    }} onMouseEnter={e=>e.currentTarget.style.opacity=0.7} onMouseLeave={e=>e.currentTarget.style.opacity=1}>
                      Learn More <ArrowIcon size={18} />
                    </Link>
                  </div>

                </div>
              )
            })}
          </div>
        </div>

        {/* Progress & Navigation */}
        <div style={{ 
          marginTop: '4rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }} className="whatwedo-nav">
          
          {/* Progress Bar */}
          <div style={{ flex: 1, height: 2, background: '#E5E7EB', marginRight: '4rem', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', top: 0, left: 0, height: '100%', 
              background: '#2b3f30', width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={prevSlide} style={{
              width: 44, height: 44, borderRadius: '50%', background: '#4B4B4B', color: '#FFF',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'background 0.2s'
            }} onMouseEnter={e=>e.currentTarget.style.background='#2C2C24'} onMouseLeave={e=>e.currentTarget.style.background='#4B4B4B'}>
              <ArrowLeft size={20} />
            </button>
            
            <div style={{ fontSize: '1rem', fontWeight: 500, color: '#4b5563', fontVariantNumeric: 'tabular-nums' }}>
              {current + 1} / {features.length}
            </div>
            
            <button onClick={nextSlide} style={{
              width: 44, height: 44, borderRadius: '50%', background: '#4B4B4B', color: '#FFF',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'background 0.2s'
            }} onMouseEnter={e=>e.currentTarget.style.background='#2C2C24'} onMouseLeave={e=>e.currentTarget.style.background='#4B4B4B'}>
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </div>
      
      <style>{`
        @media(max-width: 1024px) {
          .whatwedo-card {
            grid-template-columns: 1fr !important;
            padding: 3rem 2rem !important;
            gap: 2rem !important;
          }
          .whatwedo-nav {
            flex-direction: column;
            gap: 2rem;
            align-items: stretch !important;
          }
          .whatwedo-nav > div:first-child {
            margin-right: 0 !important;
          }
          .whatwedo-nav > div:last-child {
            justify-content: space-between;
          }
        }
        @media(max-width: 640px) {
          .whatwedo-card {
            padding: 2rem 1.25rem !important;
          }
          .whatwedo-card h3 {
            font-size: 2rem !important;
          }
          .whatwedo-card p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </section>
  )
}
