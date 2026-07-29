import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { sectionPad, container } from './utils';
import heroImg from '../assets/shared/hero.jpg';

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current || !isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', () => setIsDragging(false));
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <section className="before-after-section" style={{ padding: '20px 0 clamp(40px, 6vw, 80px)', overflow: 'hidden' }}>
      <div style={container}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: 800, margin: '0 auto 4rem' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--foreground)' }}>
            The Energy Procurement Shift
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted-foreground)', marginTop: '1rem', lineHeight: 1.6 }}>
            Drag the slider to see how Sun Sutra transforms complex, expensive power procurement into a streamlined, high-savings model.
          </p>
        </div>

        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            borderRadius: '2rem',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-deep)',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
          onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
        >
          {/* BACKGROUND (The Old Way) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, #1f2937, #111827)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '4rem', color: '#fff'
          }}>
            <h3 style={{ fontSize: '2rem', fontFamily: 'var(--ff-display)', color: '#ef4444', marginBottom: '1rem', opacity: 0.9 }}>The Old Way</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.7, fontSize: '1.1rem' }}>
              <li>❌ Fossil-fuel dependent grid power</li>
              <li>❌ Fluctuating industrial tariffs (₹10-15/unit)</li>
              <li>❌ Complex multi-vendor procurement</li>
              <li>❌ Zero sustainability impact</li>
            </ul>
          </div>

          {/* FOREGROUND (The Sun Sutra Way) */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '4rem', color: '#fff'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.85)', backdropFilter: 'blur(8px)', zIndex: 0 }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--ff-display)', color: '#fff', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>The Sun Sutra Way</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', fontWeight: 600, fontSize: '1.1rem', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                <li>✅ 100% Clean Renewable Energy</li>
                <li>✅ Fixed, low long-term tariff (₹7-9/unit)</li>
                <li>✅ Single-window aggregated procurement</li>
                <li>✅ Huge measurable CO₂ reductions</li>
              </ul>
            </div>
          </div>

          {/* SLIDER HANDLE */}
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: `${sliderPosition}%`,
            width: '4px',
            background: '#fff',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              width: 48, height: 48, background: '#fff', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)', color: 'var(--primary)',
              transition: 'transform 0.2s', transform: isDragging ? 'scale(1.1)' : 'scale(1)'
            }}>
              <ArrowLeftRight size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
