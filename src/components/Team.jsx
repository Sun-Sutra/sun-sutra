import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import profileFallback from '../assets/shared/profile_fallback.png'

import Aryan from '../assets/about/team/Aryan.jpeg';
import Manmohan from '../assets/about/team/Manmohan.jpeg';
import Aditya from '../assets/about/team/Aditya.jpeg';
import Rohit from '../assets/about/team/Rohit.jpeg';
// import Madhav from '../assets/about/team/Madhav.jpeg';
// import Avinash from '../assets/about/team/Avinash.jpeg';

const members = [
  { initials: 'AD', name: 'Aryan Dhangar', role: 'Founder', bio: 'BS Economics student at IIT Kharagpur. Experience in business strategy, revenue model development, team management, and entrepreneurial initiatives.', image: Aryan },
  { initials: 'MM', name: 'Manmohan', role: 'Co-Founder', bio: 'Ex-Navodayan with experience in import-export operations, client relationship management, chemical markets, and industrial networking.', image: Manmohan },
  { initials: 'AK', name: 'Aditya Kumar', role: 'Co-Founder', bio: 'Student at the Department of Humanities and Social Sciences, IIT Kharagpur. Contributes to market research, stakeholder engagement, and strategic planning, helping bridge business insights with operational execution. His interdisciplinary perspective supports Sunsutra\'s mission of making renewable energy more accessible and affordable for I&C industrial consumers.', image: Aditya },
  { initials: 'RB', name: 'Rohit Bej', role: 'CTO', bio: 'B.Tech Mechanical Engineering student at the Indian Institute of Technology Kharagpur. Experienced in web development and artificial intelligence technologies, bringing technical expertise in building intelligent digital platforms.', image:Rohit },
  { initials: 'MD', name: 'Madhav', role: 'Legal & Compliance Advisor', bio: 'Renewable energy professional with 10+ years of experience in solar project management and execution. A qualified lawyer, he advises Sunsutra on regulatory compliance, contractual matters, and renewable energy project governance.',  image: profileFallback},
  { initials: 'AK', name: 'Avinash Kumar', role: 'Advisory', bio: 'Director at Brahmih International Foundation with deep organizational leadership and social impact experience.', image:'../assets/team/Aryan.jpeg' }
]

export default function Team() {
  const headerRef = useFadeIn()
  const gridRef = useFadeIn()

  return (
    <section id="team" style={{
      ...sectionPad,
      paddingTop: '64px',
      background: 'var(--background)',
      overflow: 'hidden'
    }}>
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
            return (
              <div key={index} className="team-card" style={{
                ...organicCardStyle,
                borderRadius: '1.5rem',
                padding: 0,
                height: '380px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = profileFallback; }}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover'
                  }}
                />
                
                {/* Default Dark bottom gradient for text readability */}
                <div className="dark-gradient" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
                  pointerEvents: 'none',
                  transition: 'opacity 0.4s ease',
                  zIndex: 1
                }} />

                {/* Hover black transparent overlay */}
                <div className="team-hover-bg" style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  opacity: 0,
                  transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 2
                }} />

                {/* Content Container (holds name, role and bio) */}
                <div className="team-card-content" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '2rem',
                  zIndex: 3,
                  textAlign: 'left'
                }}>
                  {/* Name and Role Info Wrapper */}
                  <div className="team-card-info">
                    <div className="team-card-name" style={{
                      fontFamily: 'var(--ff-display)', fontSize: '1.4rem', fontWeight: 700,
                      color: '#FFFFFF', transition: 'color 0.4s', lineHeight: 1.2, marginBottom: 4
                    }}>{m.name}</div>
                    <div className="team-card-role" style={{
                      fontSize: '0.85rem', color: '#FDE047', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.4s'
                    }}>{m.role}</div>
                  </div>

                  {/* Bio Description */}
                  <p className="team-card-bio" style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    lineHeight: 1.5,
                    margin: 0,
                    maxHeight: 0,
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease, max-height 0.4s ease, margin-top 0.4s ease',
                    overflowY: 'auto'
                  }}>
                    {m.bio}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`
        .team-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease !important;
        }
        .team-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-deep) !important;
        }
        .team-card:hover .dark-gradient {
          opacity: 0 !important;
        }
        .team-card:hover .team-hover-bg {
          opacity: 1 !important;
        }
        .team-card:hover .team-card-bio {
          max-height: 150px !important;
          margin-top: 1rem !important;
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .team-card-bio::-webkit-scrollbar {
          width: 4px;
        }
        .team-card-bio::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        @media(max-width:1024px){.team-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:640px){.team-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}
