import { useEffect, useRef, useState } from 'react';
import { SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils';

export default function Timeline() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far through the component we've scrolled
      // Start filling when the top of the component hits the middle of the screen
      // Finish filling when the bottom of the component hits the middle of the screen
      const start = rect.top - (windowHeight / 2);
      const end = rect.bottom - (windowHeight / 2);
      
      let progress = 0;
      if (start < 0) {
        progress = Math.min(1, Math.max(0, Math.abs(start) / (rect.height)));
      }
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { num: '01', title: 'Energy Audit & Analysis', desc: 'We analyze your 12-month billing data and load profile to determine exact requirements and savings potential.' },
    { num: '02', title: 'Custom Proposal', desc: 'You receive a structured PPA proposal outlining your fixed tariff, estimated monthly savings, and integration timeline.' },
    { num: '03', title: 'Agreement Signing', desc: 'We finalize the Power Purchase Agreement and initiate the onboarding process with generators and DISCOMs.' },
    { num: '04', title: 'Regulatory Clearance', desc: 'Our team handles all open-access approvals, wheeling agreements, and grid-integration paperwork.' },
    { num: '05', title: 'Power Flow & Savings', desc: 'Clean energy flows to your facility, immediately reflecting as a 20-30% reduction on your monthly electricity bill.' }
  ];

  return (
    <section id="timeline" style={{ ...sectionPad, background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div style={container}>
        <div style={{ textAlign: 'center', marginBottom: '6rem', maxWidth: 800, margin: '0 auto 6rem' }}>
          <SectionLabel>How It Works</SectionLabel>
          <SectionHeading>The Path to Cheaper Power</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>
            We handle the complexity of renewable procurement so you can focus on running your business.
          </SectionBody>
        </div>

        <div ref={containerRef} style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          {/* Background static line */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '40px', width: '4px',
            background: 'var(--border)', borderRadius: '4px', zIndex: 1
          }} className="timeline-line"></div>
          
          {/* Animated fill line */}
          <div style={{
            position: 'absolute', top: 0, left: '40px', width: '4px',
            background: 'var(--primary)', borderRadius: '4px', zIndex: 2,
            height: `${scrollProgress * 100}%`,
            transition: 'height 0.1s ease-out'
          }} className="timeline-line"></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 3 }}>
            {steps.map((step, index) => {
              // Node is active if the progress line has reached its vertical center
              const itemProgressThreshold = index / (steps.length - 1);
              const isActive = scrollProgress >= (itemProgressThreshold - 0.05);

              return (
                <div key={step.num} style={{
                  display: 'flex', alignItems: 'center', gap: '3rem',
                  opacity: isActive ? 1 : 0.4,
                  transform: isActive ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} className="timeline-item">
                  
                  {/* Node */}
                  <div style={{
                    width: '84px', flexShrink: 0, display: 'flex', justifyContent: 'center'
                  }}>
                    <div style={{
                      width: isActive ? '32px' : '24px',
                      height: isActive ? '32px' : '24px',
                      borderRadius: '50%',
                      background: isActive ? 'var(--primary)' : 'var(--surface)',
                      border: `4px solid ${isActive ? 'var(--surface)' : 'var(--border)'}`,
                      boxShadow: isActive ? '0 0 0 4px rgba(253, 224, 71, 0.4)' : 'none',
                      transition: 'all 0.4s ease'
                    }}></div>
                  </div>

                  {/* Content Card */}
                  <div style={{
                    ...organicCardStyle,
                    flex: 1, padding: '2rem',
                    border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                    boxShadow: isActive ? 'var(--shadow-deep)' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--muted-foreground)' }}>{step.num}</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--ff-display)' }}>{step.title}</h3>
                    </div>
                    <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6, margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width: 640px) {
          .timeline-line { left: 24px !important; }
          .timeline-item { gap: 1.5rem !important; }
          .timeline-item > div:first-child { width: 52px !important; }
        }
      `}</style>
    </section>
  );
}
