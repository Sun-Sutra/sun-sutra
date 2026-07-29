import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import profileFallback from '../assets/shared/profile_fallback.png'

const studies = [
  {
    industry: 'Textile Mill',
    location: 'Bhiwandi, Maharashtra',
    load: '2.5 MW',
    currentBill: 1200000,
    newBill: 850000,
    co2: 125,
    image: 'https://images.unsplash.com/photo-1574620617345-cb3ba49a8f15?q=80&w=600&auto=format&fit=crop'
  },
  {
    industry: 'Injection Molding',
    location: 'Chakan MIDC',
    load: '1.2 MW',
    currentBill: 800000,
    newBill: 580000,
    co2: 80,
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop'
  },
  {
    industry: 'Cold Storage',
    location: 'Navi Mumbai',
    load: '3.0 MW',
    currentBill: 2500000,
    newBill: 1750000,
    co2: 240,
    image: 'https://images.unsplash.com/photo-1590740924045-802da408f619?q=80&w=600&auto=format&fit=crop'
  }
];

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function CaseStudies() {
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  return (
    <section style={{ ...sectionPad, background: 'var(--background)' }}>
      <div style={container}>
        <div ref={headerRef} style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 4rem' }}>
          <SectionLabel>Industry Profiles</SectionLabel>
          <SectionHeading>Real Impact Across Sectors</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>
            Whether you operate continuous-process machinery or temperature-controlled facilities, aggregated renewable energy delivers immediate bottom-line impact.
          </SectionBody>
        </div>

        <div ref={gridRef} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem'
        }}>
          {studies.map((study, i) => (
            <div key={i} style={{
              ...organicCardStyle,
              padding: 0,
              display: 'flex', flexDirection: 'column',
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }} className="case-card">
              <div style={{ height: 200, width: '100%', overflow: 'hidden' }}>
                <img src={study.image} alt={study.industry} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} className="case-img" />
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  {study.location}
                </div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1.5rem', color: 'var(--foreground)' }}>
                  {study.industry}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: 4 }}>Current Bill</div>
                    <div style={{ fontWeight: 600, color: '#ef4444' }}>{formatCurrency(study.currentBill)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: 4 }}>Sun Sutra Bill</div>
                    <div style={{ fontWeight: 700, color: '#10b981', fontSize: '1.1rem' }}>{formatCurrency(study.newBill)}</div>
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'var(--muted)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--foreground)', fontWeight: 600 }}>Monthly Savings</div>
                  <div style={{ fontSize: '1.2rem', fontFamily: 'var(--ff-display)', fontWeight: 800, color: 'var(--foreground)' }}>
                    {formatCurrency(study.currentBill - study.newBill)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .case-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .case-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-deep); }
        .case-card:hover .case-img { transform: scale(1.05); }
      `}</style>
    </section>
  );
}
