import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import profileFallback from '../assets/profile_fallback.png'

const members = [
  { initials: 'AD', name: 'Aryan Dhangar', role: 'Founder', bio: 'BS Economics student at IIT Kharagpur. Experience in business strategy, revenue model development, team management, and entrepreneurial initiatives.' },
  { initials: 'MM', name: 'Manmohan', role: 'Co-Founder', bio: 'Ex-Navodayan with experience in import-export operations, client relationship management, chemical markets, and industrial networking.' },
  { initials: 'RB', name: 'Rohit Bej', role: 'Operations', bio: 'Web Secretary at IIT Kharagpur with technical and operational coordination experience across digital infrastructure.' },
  { initials: 'AK', name: 'Avinash Kumar', role: 'Advisory', bio: 'Director at Brahmih International Foundation with deep organizational leadership and social impact experience.' },
  { initials: 'OV', name: 'Omkar Venkata', role: 'CTO', bio: 'CTO at Honeyloop Technology Pvt Ltd. Brings technology and systems expertise critical to building the procurement platform.' },
]

export default function Team() {
  const headerRef = useFadeIn()
  const gridRef = useFadeIn()

  return (
    <section id="team" style={{ ...sectionPad, background: 'var(--background)' }}>
      <div className="blob-bg blob-2" style={{ top: '30%', right: '0%', width: 500, height: 500 }} />
      <div style={{ ...container, position: 'relative', zIndex: 1 }}>
        <div ref={headerRef} style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <SectionLabel>The Team</SectionLabel>
          <SectionHeading>Founders &amp; Leadership</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>A cross-functional team combining energy economics, industrial operations, and technology expertise.</SectionBody>
        </div>
        <div ref={gridRef} style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', marginTop: '4rem',
        }} className="team-grid">
          {members.map((m, index) => {
            const radii = [
              '4rem 2rem 5rem 1.5rem',
              '2rem 4rem 1.5rem 5rem',
              '5rem 1.5rem 4rem 2rem',
              '1.5rem 5rem 2rem 4rem',
              '3rem 2rem 4rem 3rem'
            ]
            return (
              <div key={m.initials} style={{
                ...organicCardStyle,
                borderRadius: radii[index % radii.length],
                padding: '3rem 2rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-deep)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-soft)' }}>
                <img
                  src={`/team/${m.name}.png`}
                  alt={m.name}
                  onError={(e) => { e.currentTarget.src = profileFallback; }}
                  style={{
                    width: 120, height: 120, borderRadius: '50%', objectFit: 'cover',
                    marginBottom: '1.5rem', border: '2px solid var(--primary)',
                    background: 'var(--muted)'
                  }}
                />
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 4, color: 'var(--foreground)' }}>{m.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.role}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{m.bio}</div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){.team-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:640px){.team-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}
