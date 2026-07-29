import React from 'react';

export default function ElectronFlow() {
  return (
    <div 
      className="electron-flow-container" 
      style={{ 
        width: '100px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: '0 -10px',
        zIndex: 0
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="electronGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--border)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--border)" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Base dashed line */}
        <path 
          d="M 0 20 L 100 20" 
          stroke="url(#lineGrad)" 
          strokeWidth="2" 
          strokeDasharray="4 4" 
        />
        
        {/* Animated Electron 1 */}
        <circle r="4" fill="#10b981" filter="url(#electronGlow)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0 20 L 100 20" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Animated Electron 2 (trailing) */}
        <circle r="3" fill="#38bdf8" filter="url(#electronGlow)">
          <animateMotion dur="2.5s" begin="0.8s" repeatCount="indefinite" path="M 0 20 L 100 20" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
        </circle>
        
        {/* Animated Electron 3 (trailing) */}
        <circle r="2" fill="#eab308" filter="url(#electronGlow)">
          <animateMotion dur="2.5s" begin="1.6s" repeatCount="indefinite" path="M 0 20 L 100 20" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.5s" begin="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
