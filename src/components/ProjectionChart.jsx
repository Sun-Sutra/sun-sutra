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
          background: '#ffffff',
          padding: '16px 20px',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
          color: 'var(--foreground)',
          minWidth: '220px'
        }}>
          <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: '0.95rem', color: 'var(--muted-foreground)' }}>{label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span> Grid Cost
              </span>
              <strong style={{ fontWeight: 700, color: 'var(--foreground)' }}>{formatCurrency(payload[0].value)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> Sun Sutra Cost
              </span>
              <strong style={{ fontWeight: 700, color: 'var(--foreground)' }}>{formatCurrency(payload[1].value)}</strong>
            </div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#ca8a04', fontWeight: 700 }}>Total Savings</span>
              <strong style={{ fontWeight: 800, color: '#ca8a04' }}>{formatCurrency(payload[0].payload.savings)}</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: '#ffffff',
      padding: '3rem',
      borderRadius: '32px',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 500,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--ff-display)', margin: '-1rem 0 0.5rem', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
          The Cost of Doing Nothing
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.6 }}>
          Watch the diverging costs over a 10-year period as conventional grid tariffs escalate 5% annually.
        </p>
      </div>
      <div style={{ width: '100%', height: 320, zIndex: 1, marginTop: 'auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorSS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />

            <XAxis
              dataKey="year"
              stroke="var(--border)"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              dy={10}
            />

            <YAxis
              tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
              stroke="var(--border)"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              width={60}
              dx={-10}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

            <Area
              type="monotone"
              dataKey="gridCost"
              stroke="#ef4444"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#colorGrid)"
              activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="ssCost"
              stroke="#10b981"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#colorSS)"
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
