import React from 'react';
import { sectionPad } from './utils';

export default function Ticker() {
  const metrics = [
    '10 MW+ Capacity Managed',
    '5,000+ Tons CO₂ Reduced',
    '₹15 Cr+ Client Savings',
    'Active in Pune MIDC',
    'Tier-1 Renewable Generators'
  ];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      background: 'var(--foreground)',
      color: 'var(--background)',
      padding: '1.5rem 0',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      whiteSpace: 'nowrap',
      position: 'relative'
    }}>
      {/* Container that animates */}
      <div className="ticker-track" style={{ display: 'flex', gap: '4rem' }}>
        {/* We map the items multiple times so it loops seamlessly */}
        {[...Array(3)].map((_, arrayIdx) => (
          <div key={arrayIdx} style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
            {metrics.map((metric, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                fontFamily: 'var(--ff-display)',
                fontWeight: 700,
                fontSize: '1.2rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                <span>{metric}</span>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  background: 'var(--primary)',
                  borderRadius: '50%'
                }}></span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .ticker-track {
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
