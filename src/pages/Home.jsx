import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sun, Wind, Layers, Zap, Leaf, Award, Calculator, ShieldCheck, Edit3, Sliders, RotateCcw, Check, Sparkles } from 'lucide-react'
import heroImg from '../assets/shared/hero.jpg'
import WhatWeDoCarousel from '../components/WhatWeDoCarousel'
import Ticker from '../components/Ticker'
import ProjectionChart from '../components/ProjectionChart'
import { useFadeIn, useParallax, SectionLabel, SectionHeading, SectionBody, sectionPad, container } from '../components/utils'

export default function Home() {
  const calcRef = useFadeIn()
  const parallaxRef = useParallax(0.15)

  // Savings Calculator State
  const [bill, setBill] = useState(250000)
  const [mix, setMix] = useState('hybrid') // 'solar', 'wind', 'hybrid'
  const [isCustomBill, setIsCustomBill] = useState(false)
  const [customBillInput, setCustomBillInput] = useState('1500000')

  // Calculations
  const currentRate = 9.5 // Average grid rate
  const sunSutraRate = mix === 'solar' ? 6.8 : mix === 'wind' ? 7.1 : 6.5
  const units = bill / currentRate
  const newBill = units * sunSutraRate
  const monthlySavings = bill - newBill
  const annualSavings = monthlySavings * 12
  const co2Offset = units * 12 * 0.71 / 1000 // in metric tons

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0)
  }

  const formatIndianWords = (val) => {
    if (!val || val <= 0) return '₹0'
    if (val >= 10000000) {
      const cr = val / 10000000
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Crore${cr > 1 ? 's' : ''}`
    }
    if (val >= 100000) {
      const l = val / 100000
      return `₹${l % 1 === 0 ? l : l.toFixed(2)} Lakh${l > 1 ? 's' : ''}`
    }
    return `₹${(val / 1000).toFixed(0)}k`
  }

  const handleEnableCustom = (initialVal = 1500000) => {
    setIsCustomBill(true)
    const targetVal = bill > 1000000 ? bill : initialVal
    setCustomBillInput(String(targetVal))
    setBill(targetVal)
  }

  const handleCustomInputChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '')
    setCustomBillInput(rawVal)
    const num = Number(rawVal)
    if (!isNaN(num) && num > 0) {
      setBill(num)
    }
  }

  const handleCustomPreset = (amount) => {
    setCustomBillInput(String(amount))
    setBill(amount)
  }

  const handleSwitchToSlider = () => {
    setIsCustomBill(false)
    if (bill > 1000000) {
      setBill(1000000)
    }
  }

  return (
    <>
      {/* Redesigned Minimalist Hero Section */}
      <div className="home-hero-container" style={{
        display: 'flex',
        flex: 'none',
        height: '75vh',
        padding: '50px 60px 20px 60px',
        gap: '40px'
      }}>
        {/* Left Text Content */}
        <div className="home-hero-text" style={{
          flex: '0 0 35%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: '40px'
        }}>
          <h1 style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            marginBottom: '2rem'
          }}>
            <span style={{ fontWeight: 300, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#a0a0a0' }}>POWERING</span>
            <span style={{ fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 3.5rem)' }}>INDUSTRY</span>
          </h1>
          <p className="home-hero-subtext" style={{
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            color: 'var(--muted-foreground)',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
            fontFamily: 'var(--ff-body)'
          }}>
            Helping MSMEs reduce electricity costs through renewable energy aggregation, group captive, and open-access procurement models.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/analysis" style={{
              background: 'var(--foreground)',
              color: 'var(--background)',
              padding: '16px 32px',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontFamily: 'var(--ff-display)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.05em'
            }}>
              COST ANALYSIS
            </Link>
          </div>
        </div>

        {/* Right Image Content */}
        <div className="home-hero-image" style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px'
        }}>
          <img 
            ref={parallaxRef}
            src={heroImg} 
            alt="Sun Sutra Hero" 
            style={{
              width: '100%',
              height: '130%',
              marginTop: '-15%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              willChange: 'transform'
            }}
          />
        </div>
      </div>

      {/* Trust & Impact Ticker */}
      <Ticker />

      {/* Savings Calculator Section */}
      <section ref={calcRef} style={{ ...sectionPad, background: 'transparent', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{...container, position: 'relative', zIndex: 1}}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: 800, margin: '0 auto 4rem' }}>
            <SectionLabel style={{ color: 'var(--muted-foreground)' }}>Instant Savings Estimator</SectionLabel>
            <SectionHeading style={{ fontFamily: 'var(--ff-display)', fontWeight: 800 }}>See Your Potential Savings</SectionHeading>
            <SectionBody style={{ margin: '0 auto' }}>
              Select your energy mix and slide your monthly bill to instantly calculate estimated savings under a Sun Sutra flat PPA agreement.
            </SectionBody>
          </div>

          <div style={{
            background: 'var(--surface)',
            display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '3.5rem', alignItems: 'stretch',
            padding: '3rem', borderRadius: '40px', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)'
          }} className="calc-container">
            
            {/* Input Controls Column */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calculator size={24} color="var(--primary)" /> Sourcing Configuration
                </h3>

                {/* Sourcing Mix Switcher */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    1. Select Sourcing Mix
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { id: 'solar', label: 'Solar Mix', rate: '₹6.80', icon: <Sun size={18} /> },
                      { id: 'wind', label: 'Wind Mix', rate: '₹7.10', icon: <Wind size={18} /> },
                      { id: 'hybrid', label: 'Hybrid Mix', rate: '₹6.50', icon: <Layers size={18} /> }
                    ].map(p => (
                      <div
                        key={p.id}
                        onClick={() => setMix(p.id)}
                        style={{
                          border: `2px solid ${mix === p.id ? 'var(--foreground)' : 'var(--border)'}`,
                          background: mix === p.id ? 'var(--muted)' : 'transparent',
                          borderRadius: '16px',
                          padding: '16px 12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: 'translateY(0)'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ color: mix === p.id ? 'var(--foreground)' : 'var(--muted-foreground)', marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
                          {p.icon}
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--foreground)' }}>{p.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: 4 }}>{p.rate}/unit</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Electricity Bill Section */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                        2. Monthly Electricity Bill
                      </span>
                      {isCustomBill ? (
                        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                          <Zap size={13} /> High Industrial Load Tier (&gt; ₹10L)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', fontWeight: 500, display: 'block', marginTop: 3 }}>
                          Slide or switch to custom for &gt; ₹10L
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ color: 'var(--foreground)', fontSize: '1.5rem', fontFamily: 'var(--ff-display)', display: 'block', lineHeight: 1.1 }}>
                        {formatCurrency(bill)}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                        {formatIndianWords(bill)} / month
                      </span>
                    </div>
                  </div>

                  {/* Mode Switcher Tabs */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    background: 'var(--muted)',
                    padding: '4px',
                    borderRadius: '12px',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--border)',
                    gap: '4px'
                  }}>
                    <button
                      type="button"
                      onClick={handleSwitchToSlider}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: !isCustomBill ? 'var(--surface)' : 'transparent',
                        color: !isCustomBill ? 'var(--foreground)' : 'var(--muted-foreground)',
                        fontWeight: !isCustomBill ? 700 : 500,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        boxShadow: !isCustomBill ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Sliders size={14} /> Slider (₹50k – ₹10L)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEnableCustom(bill > 1000000 ? bill : 1500000)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isCustomBill ? 'var(--foreground)' : 'transparent',
                        color: isCustomBill ? 'var(--background)' : 'var(--foreground)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        boxShadow: isCustomBill ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Edit3 size={14} /> Custom (&gt; ₹10L)
                    </button>
                  </div>

                  {!isCustomBill ? (
                    /* Standard Slider Mode */
                    <div>
                      <input
                        type="range"
                        min="50000"
                        max="1000000"
                        step="10000"
                        value={Math.min(bill, 1000000)}
                        onChange={(e) => setBill(Number(e.target.value))}
                        style={{
                          width: '100%', height: 8, borderRadius: 4,
                          background: 'var(--border)', outline: 'none',
                          WebkitAppearance: 'none', cursor: 'pointer',
                        }}
                        className="custom-slider"
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--muted-foreground)', marginTop: '0.75rem', fontWeight: 600 }}>
                        <span onClick={() => setBill(50000)} style={{ cursor: 'pointer' }}>₹50k</span>
                        <span onClick={() => setBill(500000)} style={{ cursor: 'pointer' }}>₹5L</span>
                        <button
                          type="button"
                          onClick={() => handleEnableCustom(1500000)}
                          style={{
                            border: '1px solid var(--border)',
                            background: 'var(--muted)',
                            color: 'var(--foreground)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--foreground)';
                            e.currentTarget.style.background = 'var(--surface)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.background = 'var(--muted)';
                          }}
                        >
                          ₹10L+ <Edit3 size={11} />
                        </button>
                      </div>

                      {/* Prompt / Callout to type custom bill above 10L */}
                      <div style={{
                        marginTop: '1rem',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.07)',
                        border: '1px dashed rgba(16, 185, 129, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        fontSize: '0.82rem'
                      }}>
                        <span style={{ color: 'var(--muted-foreground)' }}>
                          Monthly bill above <strong style={{ color: 'var(--foreground)' }}>₹10 Lakhs</strong>?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleEnableCustom(1500000)}
                          style={{
                            background: 'var(--foreground)',
                            border: 'none',
                            color: 'var(--background)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: '0.78rem',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          Type Custom Bill &gt; ₹10L <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Custom Bill Input Mode (> 10L) */
                    <div style={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--foreground)' }}>
                          Enter Monthly Electricity Bill (₹):
                        </label>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                          Type amount in Rupees
                        </span>
                      </div>
                      
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          position: 'absolute',
                          left: '14px',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: 'var(--foreground)',
                          pointerEvents: 'none'
                        }}>
                          ₹
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="e.g. 1500000"
                          value={customBillInput}
                          onChange={handleCustomInputChange}
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '12px 14px 12px 34px',
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            fontFamily: 'var(--ff-display)',
                            borderRadius: '12px',
                            border: '2px solid var(--primary)',
                            background: 'var(--surface)',
                            color: 'var(--foreground)',
                            outline: 'none',
                            boxShadow: '0 0 0 3px rgba(93, 112, 82, 0.12)'
                          }}
                        />
                      </div>

                      {/* Live calculation info */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.8rem', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ color: Number(customBillInput) < 1000000 ? '#eab308' : '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {Number(customBillInput) < 1000000 ? (
                            '💡 Note: For bills under ₹10L, slider mode is also available.'
                          ) : (
                            <>
                              <Check size={14} /> Configured: {formatCurrency(bill)} ({formatIndianWords(bill)}/mo)
                            </>
                          )}
                        </span>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', fontWeight: 600 }}>
                          ≈ {Math.round(units).toLocaleString('en-IN')} kWh/month
                        </span>
                      </div>

                      {/* Quick High-Load Presets */}
                      <div style={{ marginTop: '1.1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                          Quick High-Load Tiers:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {[
                            { label: '₹12 Lakhs', val: 1200000 },
                            { label: '₹15 Lakhs', val: 1500000 },
                            { label: '₹25 Lakhs', val: 2500000 },
                            { label: '₹50 Lakhs', val: 5000000 },
                            { label: '₹1 Crore', val: 10000000 },
                            { label: '₹2.5 Cr', val: 25000000 },
                          ].map(tier => (
                            <button
                              key={tier.val}
                              type="button"
                              onClick={() => handleCustomPreset(tier.val)}
                              style={{
                                border: bill === tier.val ? '1px solid var(--foreground)' : '1px solid var(--border)',
                                background: bill === tier.val ? 'var(--foreground)' : 'var(--muted)',
                                color: bill === tier.val ? 'var(--background)' : 'var(--foreground)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={e => {
                                if (bill !== tier.val) {
                                  e.currentTarget.style.borderColor = 'var(--foreground)';
                                }
                              }}
                              onMouseLeave={e => {
                                if (bill !== tier.val) {
                                  e.currentTarget.style.borderColor = 'var(--border)';
                                }
                              }}
                            >
                              {tier.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={handleSwitchToSlider}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--muted-foreground)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 8px'
                          }}
                        >
                          <RotateCcw size={12} /> Switch back to Slider (₹50k – ₹10L)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Real-time Metrics Card */}
                <div style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  marginBottom: '2rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      EST. MONTHLY SAVINGS
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--ff-display)', marginTop: 4 }}>
                      {formatCurrency(monthlySavings)}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ANNUAL REDUCTION
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#eab308', fontFamily: 'var(--ff-display)', marginTop: 4 }}>
                      {formatCurrency(annualSavings)}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link
                  to={`/analysis?bill=${bill}&mix=${mix}`}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                    padding: '16px 24px',
                    borderRadius: '9999px',
                    textDecoration: 'none',
                    fontFamily: 'var(--ff-display)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: 'var(--shadow-soft)'
                  }}
                >
                  Run Precision AI Audit <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Results Output - Interactive Chart */}
            <ProjectionChart monthlyBill={bill} newBill={newBill} />
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <WhatWeDoCarousel />

      <style>{`
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--foreground); cursor: pointer;
          border: 4px solid var(--background);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }
        .custom-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        
        @media (max-width: 900px) {
          .home-hero-container {
            flex-direction: column !important;
            height: auto !important;
            padding: 30px 20px 20px 20px !important;
            gap: 24px !important;
          }
          .home-hero-text {
            flex: none !important;
            padding-bottom: 0 !important;
          }
          .home-hero-image {
            height: 320px !important;
            min-height: 260px !important;
            width: 100% !important;
          }
        }
        
        @media (max-width: 1024px) {
          .calc-container { grid-template-columns: 1fr !important; gap: 2rem !important; padding: 2rem !important; border-radius: 24px !important; }
        }
        
        @media (max-width: 640px) {
          .calc-container { padding: 1.5rem !important; border-radius: 20px !important; }
          .home-hero-image { height: 260px !important; }
        }
      `}</style>
    </>
  )
}
