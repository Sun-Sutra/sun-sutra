import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Sliders } from 'lucide-react';
import { SectionLabel, SectionHeading, SectionBody, organicCardStyle } from '../components/utils';

export default function NotFoundPage() {
  return (
    <div className="page-wrapper" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '4rem 2rem',
    }}>
      <div style={{
        ...organicCardStyle,
        maxWidth: 550,
        width: '100%',
        textAlign: 'center',
        padding: '3.5rem 2.5rem',
        borderRadius: '2rem 3rem 1.5rem 4rem',
        boxShadow: 'var(--shadow-deep)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, var(--secondary), var(--primary))'
        }} />
        
        {/* Animated Icon Container */}
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'rgba(193, 140, 93, 0.1)',
          color: 'var(--secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}>
          <AlertTriangle size={36} />
        </div>

        <SectionLabel>ERROR 404</SectionLabel>
        
        <SectionHeading style={{ fontSize: '2.2rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          Grid Link Offline
        </SectionHeading>
        
        <SectionBody style={{ margin: '0 auto 2.5rem', maxWidth: 420, fontSize: '0.98rem', lineHeight: 1.6 }}>
          The page you are looking for has either been disconnected, decommissioned, or redirected to another section of the Sun Sutra energy network.
        </SectionBody>

        {/* Quick CTAs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'var(--foreground)',
            color: 'var(--background)',
            padding: '14px 24px',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontFamily: 'var(--ff-display)',
            fontWeight: 700,
            fontSize: '0.9rem',
          }} className="btn-organic">
            <Home size={16} /> Return to Home
          </Link>
          
          <Link to="/analysis" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            border: '1px solid rgba(222,216,207,0.8)',
            background: 'var(--surface)',
            color: 'var(--foreground)',
            padding: '14px 24px',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontFamily: 'var(--ff-display)',
            fontWeight: 700,
            fontSize: '0.9rem',
          }} className="btn-organic">
            <Sliders size={16} /> Estimate Savings
          </Link>
        </div>
      </div>
    </div>
  );
}
