import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight, Sparkles, Check, X } from 'lucide-react';
import { sectionPad, container } from './utils';
import heroImg from '../assets/shared/hero.jpg';

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showHintLabel, setShowHintLabel] = useState(false);
  const [handleScale, setHandleScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const animRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const stopAutoAnimation = () => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setIsAnimating(false);
    setShowHintLabel(false);
    setHandleScale(1);
  };

  const startOnboardingAnimation = () => {
    if (hasAnimatedRef.current) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    hasAnimatedRef.current = true;
    setIsAnimating(true);
    setShowHintLabel(true);

    const startTime = performance.now();

    // Sequence timings according to exact specification:
    // 1. Wait 500ms at 50%
    // 2. Slide 50% -> 85% (right) over 800ms
    // 3. Pause 250ms at 85%
    // 4. Slide 85% -> 15% (left) over 1000ms
    // 5. Pause 250ms at 15%
    // 6. Slide 15% -> 50% (center) over 800ms
    const delay = 500;
    const p1Duration = 800;
    const p2Duration = 250;
    const p3Duration = 1000;
    const p4Duration = 250;
    const p5Duration = 800;

    const t0 = delay;
    const t1 = t0 + p1Duration;
    const t2 = t1 + p2Duration;
    const t3 = t2 + p3Duration;
    const t4 = t3 + p4Duration;
    const t5 = t4 + p5Duration;

    const animate = (now) => {
      const elapsed = now - startTime;

      if (elapsed < t0) {
        // Wait 500ms at center (50%)
        setSliderPosition(50);
        setHandleScale(1);
        animRef.current = requestAnimationFrame(animate);
      } else if (elapsed < t1) {
        // Slide 50% -> 85% over 800ms
        const progress = (elapsed - t0) / p1Duration;
        const ease = easeInOutCubic(progress);
        const pos = 50 + (85 - 50) * ease;
        const scale = 1 + 0.05 * Math.sin(progress * Math.PI); // 5% scale up
        setSliderPosition(pos);
        setHandleScale(scale);
        animRef.current = requestAnimationFrame(animate);
      } else if (elapsed < t2) {
        // Pause 250ms at 85%
        setSliderPosition(85);
        setHandleScale(1.05);
        animRef.current = requestAnimationFrame(animate);
      } else if (elapsed < t3) {
        // Slide 85% -> 15% over 1000ms
        const progress = (elapsed - t2) / p3Duration;
        const ease = easeInOutCubic(progress);
        const pos = 85 + (15 - 85) * ease;
        setSliderPosition(pos);
        setHandleScale(1.05);
        animRef.current = requestAnimationFrame(animate);
      } else if (elapsed < t4) {
        // Pause 250ms at 15%
        setSliderPosition(15);
        setHandleScale(1.05);
        animRef.current = requestAnimationFrame(animate);
      } else if (elapsed < t5) {
        // Slide 15% -> 50% over 800ms
        const progress = (elapsed - t4) / p5Duration;
        const ease = easeInOutCubic(progress);
        const pos = 15 + (50 - 15) * ease;
        const scale = 1.05 - 0.05 * ease; // Scale back to 1.0
        setSliderPosition(pos);
        setHandleScale(scale);
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Stay at center (50%) permanently & hand control to user
        setSliderPosition(50);
        stopAutoAnimation();
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleUserInteractionStart = (clientX) => {
    stopAutoAnimation();
    setIsDragging(true);
    handleMove(clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            startOnboardingAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onMouseUp = () => setIsDragging(false);
    const onTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);

  return (
    <section
      ref={sectionRef}
      className="before-after-section"
      style={{ ...sectionPad, overflow: 'hidden' }}
    >
      <div style={container}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: 750, margin: '0 auto 3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'var(--ff-body)'
          }}>
            <Sparkles size={15} /> TRANSFORMING ENERGY PROCUREMENT
          </div>

          <h2 style={{
            fontFamily: 'var(--ff-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: 'var(--foreground)',
            lineHeight: 1.15,
            marginBottom: '1rem'
          }}>
            The Energy Procurement Shift
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            color: 'var(--muted-foreground)',
            lineHeight: 1.7,
            fontFamily: 'var(--ff-body)'
          }}>
            Drag the interactive slider below to see how Sun Sutra replaces expensive, fragmented grid power with a seamless, high-savings aggregated model.
          </p>
        </div>

        {/* Comparison Slider Container */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '520px',
            borderRadius: '2.5rem',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border)',
            cursor: isDragging ? 'grabbing' : 'ew-resize',
            userSelect: 'none',
            touchAction: 'none'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={(e) => handleUserInteractionStart(e.clientX)}
          onTouchStart={(e) => handleUserInteractionStart(e.touches[0].clientX)}
        >

          {/* BACKGROUND LAYER (The Traditional Way - Pinned to the Right Half) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            padding: 'clamp(2rem, 5vw, 4rem)',
            color: '#fff'
          }}>
            <div style={{ maxWidth: '440px', width: '100%', textAlign: 'left' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.18)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1rem'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                Legacy Procurement
              </div>

              <h3 style={{
                fontSize: 'clamp(1.7rem, 2.5vw, 2.3rem)',
                fontFamily: 'var(--ff-display)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1.5rem',
                lineHeight: 1.2
              }}>
                The Traditional Way
              </h3>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
                fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                fontFamily: 'var(--ff-body)',
                color: '#cbd5e1'
              }}>
                {[
                  'High volatile grid DISCOM tariffs (₹10 - ₹15/unit)',
                  'Unpredictable annual power cost inflation (4-8%)',
                  'Complex multi-vendor & regulatory compliance',
                  'Zero ESG impact or verified carbon offsets'
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: '#f87171'
                    }}>
                      <X size={14} />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FOREGROUND LAYER (The Sun Sutra Way - Pinned to the Left Half) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 'clamp(2rem, 5vw, 4rem)',
            color: '#fff',
            willChange: 'clip-path'
          }}>
            {/* Emerald Glass Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.94) 0%, rgba(4, 120, 87, 0.92) 100%)',
              backdropFilter: 'blur(6px)',
              zIndex: 0
            }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '440px', width: '100%', textAlign: 'left' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.22)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1rem'
              }}>
                <Sparkles size={13} style={{ color: '#FDE047' }} />
                Aggregated Renewable Sourcing
              </div>

              <h3 style={{
                fontSize: 'clamp(1.7rem, 2.5vw, 2.3rem)',
                fontFamily: 'var(--ff-display)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1.5rem',
                lineHeight: 1.2,
                textShadow: '0 2px 10px rgba(0,0,0,0.15)'
              }}>
                The Sun Sutra Way
              </h3>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
                fontWeight: 600,
                fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                fontFamily: 'var(--ff-body)',
                color: '#ffffff',
                textShadow: '0 1px 4px rgba(0,0,0,0.15)'
              }}>
                {[
                  'Stable, low long-term tariff (₹6.50 - ₹7.50/unit)',
                  'Up to 40% reduction in monthly electricity bills',
                  'Single-window aggregated onboarding & scheduling',
                  '100% clean solar & wind power with verified CO₂ offset'
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: '#ffffff'
                    }}>
                      <Check size={14} />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FLOATING ONBOARDING GUIDANCE LABEL */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: `${sliderPosition}%`,
              transform: 'translateX(-50%)',
              zIndex: 25,
              pointerEvents: 'none',
              opacity: showHintLabel || (isHovered && !isDragging) ? 1 : 0,
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div style={{
              background: 'var(--foreground)',
              color: '#ffffff',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'var(--ff-body)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em'
            }}>
              <Sparkles size={14} style={{ color: '#FDE047' }} />
              <span>Slide to Compare</span>
            </div>
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--foreground)',
              marginTop: '-1px'
            }} />
          </div>

          {/* SLIDER DIVIDER LINE & DRAGGABLE HANDLE */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${sliderPosition}%`,
              width: '4px',
              background: '#ffffff',
              transform: 'translateX(-50%)',
              zIndex: 20,
              boxShadow: isAnimating || isHovered || isDragging
                ? '0 0 18px rgba(255, 255, 255, 0.95), 0 0 32px rgba(16, 185, 129, 0.7)'
                : '0 0 10px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            {/* Soft Shimmer Animation along Divider */}
            {(isAnimating || isHovered) && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95), transparent)',
                  animation: 'shimmerSlide 1.5s infinite linear'
                }}
              />
            )}

            {/* Draggable Circle Handle */}
            <div
              style={{
                width: 50,
                height: 50,
                background: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isAnimating || isHovered || isDragging
                  ? '0 0 28px rgba(16, 185, 129, 0.75), 0 8px 24px rgba(0,0,0,0.3)'
                  : '0 4px 16px rgba(0,0,0,0.25)',
                color: 'var(--foreground)',
                cursor: isDragging ? 'grabbing' : 'ew-resize',
                transform: `scale(${handleScale})`,
                transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                zIndex: 21
              }}
            >
              <ArrowLeftRight
                size={22}
                className={isAnimating ? 'pulse-arrows' : ''}
                style={{ color: 'var(--foreground)' }}
              />
            </div>
          </div>

        </div>

        {/* Quick Click Preset Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1.75rem',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => { stopAutoAnimation(); setSliderPosition(100); }}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: sliderPosition > 70 ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface)',
              color: 'var(--foreground)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
            The Sun Sutra Way (100%)
          </button>

          <button
            type="button"
            onClick={() => { stopAutoAnimation(); setSliderPosition(50); }}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              background: sliderPosition === 50 ? 'var(--foreground)' : 'var(--surface)',
              color: sliderPosition === 50 ? 'var(--background)' : 'var(--foreground)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeftRight size={14} />
            Split View (50/50)
          </button>

          <button
            type="button"
            onClick={() => { stopAutoAnimation(); setSliderPosition(0); }}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: sliderPosition < 30 ? 'rgba(239, 68, 68, 0.12)' : 'var(--surface)',
              color: 'var(--foreground)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            The Traditional Way (100%)
          </button>
        </div>

      </div>

      <style>{`
        @keyframes shimmerSlide {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        @keyframes arrowNudge {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.18);
          }
        }
        .pulse-arrows {
          animation: arrowNudge 0.9s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
