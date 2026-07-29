import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function ProjectionChart({ monthlyBill, newBill }) {
  const gridEscalationRate = 1.05; // 5% annual hike
  const annualGridBill = monthlyBill * 12;
  const annualSunSutraBill = newBill * 12;

  let cumulativeGrid = 0;
  let cumulativeSS = 0;
  
  const data = Array.from({ length: 11 }, (_, i) => {
    if (i > 0) {
      cumulativeGrid += annualGridBill * Math.pow(gridEscalationRate, i);
      cumulativeSS += annualSunSutraBill;
    }
    
    return {
      year: i === 0 ? 'Now' : `Year ${i}`,
      gridCost: cumulativeGrid,
      ssCost: cumulativeSS,
      savings: cumulativeGrid - cumulativeSS,
      co2: (monthlyBill / 8 * 0.0008 * 12 * i)
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '16px 20px',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          color: '#fff',
          minWidth: '220px'
        }}>
          <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: '1rem', color: '#a1a1aa' }}>{label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{width: 8, height: 8, borderRadius: '50%', background: '#ef4444'}}></span> Grid Cost
              </span>
              <strong style={{ fontWeight: 700 }}>{formatCurrency(payload[0].value)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{width: 8, height: 8, borderRadius: '50%', background: '#10b981'}}></span> Sun Sutra Cost
              </span>
              <strong style={{ fontWeight: 700 }}>{formatCurrency(payload[1].value)}</strong>
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#eab308', fontWeight: 600 }}>Total Savings</span>
              <strong style={{ fontWeight: 800, color: '#eab308' }}>{formatCurrency(payload[0].payload.savings)}</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #18181b 0%, #09090b 100%)',
      padding: '3rem',
      borderRadius: '32px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 500,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
    }}>
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--ff-display)', margin: '-1rem 0 0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
          The Cost of Doing Nothing
        </h3>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Watch the diverging costs over a 10-year period as grid tariffs rise 5% annually.
        </p>
      </div>

      <div style={{ width: '100%', height: 320, zIndex: 1, marginTop: 'auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="year" 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            
            <YAxis 
              tickFormatter={(val) => `₹${(val/10000000).toFixed(1)}Cr`}
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false}
              width={60}
              dx={-10}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }} />
            
            <Area 
              type="monotone" 
              dataKey="gridCost" 
              stroke="#ef4444" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorGrid)"
              activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              style={{ filter: 'url(#glow)' }}
            />
            <Area 
              type="monotone" 
              dataKey="ssCost" 
              stroke="#10b981" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorSS)"
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              style={{ filter: 'url(#glow)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
