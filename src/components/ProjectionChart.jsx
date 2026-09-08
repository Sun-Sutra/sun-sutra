import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        padding: '12px 16px',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
        color: 'var(--foreground)',
        maxWidth: '240px'
      }}>
        <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{label}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}></span> Grid
            </span>
            <strong style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--foreground)' }}>{formatCurrency(payload[0].value)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span> Sun Sutra
            </span>
            <strong style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--foreground)' }}>{formatCurrency(payload[1].value)}</strong>
          </div>
          <div style={{ height: '1px', background: 'var(--border)', margin: '2px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.82rem', color: '#ca8a04', fontWeight: 700 }}>Saved</span>
            <strong style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ca8a04' }}>{formatCurrency(payload[0].payload.savings)}</strong>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProjectionChart({ monthlyBill, newBill }) {
  const gridEscalationRate = 1.05; // 5% annual hike
  const annualGridBill = monthlyBill * 12;
  const annualSunSutraBill = newBill * 12;

  const data = useMemo(() => {
    const list = [];
    let grid = 0;
    let ss = 0;
    for (let i = 0; i <= 10; i++) {
      if (i > 0) {
        grid += annualGridBill * Math.pow(gridEscalationRate, i);
        ss += annualSunSutraBill;
      }
      list.push({
        year: i === 0 ? 'Now' : `Yr ${i}`,
        gridCost: grid,
        ssCost: ss,
        savings: grid - ss,
        co2: (monthlyBill / 8 * 0.0008 * 12 * i)
      });
    }
    return list;
  }, [annualGridBill, annualSunSutraBill, gridEscalationRate, monthlyBill]);

  return (
    <div style={{
      background: '#ffffff',
      padding: 'clamp(1.25rem, 4vw, 3rem)',
      borderRadius: '2rem',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'auto',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)'
    }} className="projection-chart-box">
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.5rem' }} className="projection-chart-header">
        <h3 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 2rem)', fontWeight: 800, fontFamily: 'var(--ff-display)', margin: '0 0 0.5rem', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
          The Cost of Doing Nothing
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.5 }}>
          Watch the diverging costs over a 10-year period as conventional grid tariffs escalate 5% annually.
        </p>
      </div>
      <div style={{ width: '100%', height: 280, zIndex: 1, marginTop: 'auto' }} className="projection-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              dy={6}
            />

            <YAxis
              tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
              stroke="var(--border)"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              width={52}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

            <Area
              type="monotone"
              dataKey="gridCost"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorGrid)"
              activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="ssCost"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSS)"
              activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
