import { useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import WhatWeDoCarousel from '../components/WhatWeDoCarousel'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from '../components/utils'
import { ArrowRight } from 'lucide-react'
import savingImg from '../assets/saving.jpg'

export default function Home() {
  const calcRef = useFadeIn()
  const featuresRef = useFadeIn()

  // Savings Calculator State
  const [bill, setBill] = useState(250000)

  // Calculations
  const currentRate = 8 
  const voltaraRate = 5.5
  const units = bill / currentRate
  const newBill = units * voltaraRate
  const monthlySavings = bill - newBill
  const annualSavings = monthlySavings * 12

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <>
      <Hero />

      {/* Savings Calculator Section */}
      <section ref={calcRef} style={{ ...sectionPad, background: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        <div className="blob-bg blob-3" style={{ top: '10%', left: '-5%', width: 500, height: 500 }} />
        <div style={{...container, position: 'relative', zIndex: 1}}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: 800, margin: '0 auto 4rem' }}>
            <SectionLabel>Instant Savings Estimator</SectionLabel>
            <SectionHeading>See How Much You Can Save</SectionHeading>
            <SectionBody style={{ margin: '0 auto' }}>
              MSMEs in Maharashtra are saving up to 30% on electricity costs by switching to our aggregated renewable energy model.
            </SectionBody>
          </div>

          <div style={{
            ...organicCardStyle,
            display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center',
            padding: '4rem', borderRadius: '4rem 2rem 5rem 2rem'
          }} className="calc-container">
            {/* Input Slider */}
            <div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--foreground)' }}>
                Your Current Consumption
              </h3>
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Monthly Electricity Bill</span>
                  <span style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>{formatCurrency(bill)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="10000"
                  value={bill}
                  onChange={(e) => setBill(Number(e.target.value))}
                  style={{
                    width: '100%', height: 8, borderRadius: 4,
                    background: 'rgba(222,216,207,0.8)', outline: 'none',
                    WebkitAppearance: 'none', cursor: 'pointer',
                  }}
                  className="custom-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted-foreground)', marginTop: '0.75rem', fontWeight: 500 }}>
                  <span>₹50k</span>
                  <span>₹5L</span>
                  <span>₹10L+</span>
                </div>
              </div>

              <div style={{ background: 'var(--background)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(222,216,207,0.5)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--foreground)' }}>Assumptions based on Pune/Chakan MIDC averages:</h4>
                <ul style={{ fontSize: '0.95rem', color: 'var(--muted-foreground)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: 8, lineHeight: 1.5 }}>
                  <li>Current industrial grid tariff of ~₹8.00 per unit</li>
                  <li>Sun Sutra consolidated group captive rate of ~₹5.50 per unit</li>
                  <li>No capital expenditure required from your company</li>
                </ul>
              </div>
            </div>

            {/* Results Output */}
            <div style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              padding: '3.5rem',
              borderRadius: '2rem 4rem 2rem 5rem',
              boxShadow: 'var(--shadow-deep)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: 400, position: 'relative', overflow: 'hidden'
            }}>
              <div className="blob-bg" style={{
                top: '-20%', right: '-20%', width: 300, height: 300,
                background: 'rgba(255,255,255,0.1)', borderRadius: '50% 50% 20% 80% / 25% 80% 20% 75%',
                filter: 'blur(30px)'
              }} />

              <div style={{position: 'relative', zIndex: 1}}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.9 }}>Estimated Savings</span>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: '3rem', fontWeight: 800, marginTop: '0.5rem', lineHeight: 1 }}>
                  {formatCurrency(monthlySavings)}
                  <span style={{ fontSize: '1.2rem', fontWeight: 500, opacity: 0.9, fontFamily: 'var(--ff-body)' }}> / month</span>
                </div>
                <div style={{ fontSize: '1.05rem', opacity: 0.9, marginTop: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2rem' }}>
                  Annual savings of <strong style={{ fontSize: '1.3rem', fontWeight: 700 }}>{formatCurrency(annualSavings)}</strong>
                </div>
              </div>

              <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: '0.75rem', opacity: 0.9 }}>
                  <span>Estimated New Bill:</span>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{formatCurrency(newBill)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, opacity: 0.9 }}>
                  <span>Carbon Reduction:</span>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>~{(units * 0.0008).toFixed(1)} MT CO₂/mo</span>
                </div>
              </div>

              <Link to="/contact" className="btn-organic" style={{
                background: 'var(--primary-foreground)', color: 'var(--primary)',
                padding: '16px', justifyContent: 'center', fontSize: 16,
                marginTop: '3rem', position: 'relative', zIndex: 1
              }}>
                Get Verified Analysis <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <WhatWeDoCarousel />

      {/* <Testimonials /> */}

      {/* Hero-like Call to Action */}
      <section style={{ ...sectionPad, background: 'var(--secondary)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background Image with Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
          backgroundImage: `url(${savingImg})`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.35
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(193, 140, 93, 0.45), rgba(193, 140, 93, 0.8))'
          }} />
        </div>
        <div className="blob-bg" style={{
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 800, height: 500, background: 'rgba(255,255,255,0.1)',
          borderRadius: '50% 50% 20% 80% / 25% 80% 20% 75%', filter: 'blur(60px)'
        }} />
        <div style={{...container, position: 'relative', zIndex: 1}}>
          <SectionLabel style={{color: 'var(--secondary-foreground)'}}>Ready to Begin?</SectionLabel>
          <SectionHeading style={{ maxWidth: 800, margin: '0 auto 2rem', color: 'var(--secondary-foreground)' }}>Start Reducing Your Industrial Power Costs</SectionHeading>
          <SectionBody style={{ margin: '0 auto 3rem', maxWidth: 600, color: 'rgba(255,255,255,0.9)' }}>
            Submit a request with your facility location and monthly consumption to get a customized, certified cost analysis.
          </SectionBody>
          <Link to="/contact" className="btn-organic" style={{
            background: 'var(--secondary-foreground)', color: 'var(--secondary)',
            fontSize: 16, padding: '16px 36px', boxShadow: 'var(--shadow-float)',
          }}>
            Request Cost Analysis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style>{`
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--primary); cursor: pointer;
          border: 4px solid var(--background);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }
        .custom-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        @media(max-width:1024px){
          .calc-container { grid-template-columns: 1fr !important; gap: 3rem !important; padding: 2.5rem !important; }
          .features-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </>
  )
}
