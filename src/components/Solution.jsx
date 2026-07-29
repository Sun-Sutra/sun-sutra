import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import ElectronFlow from './ElectronFlow'
import { Wind, Combine, Factory, Check } from 'lucide-react'

import generatorBg from "../assets/solutions/generators.jpg"
import voltaraBg from "../assets/solutions/agreement.jpg"
import msmeBg from "../assets/solutions/industries.jpg"

const solPoints = [
  'MSME demand aggregation across industrial clusters',
  'Renewable energy procurement coordination',
  'Group captive and open-access support',
  'Compliance and onboarding management',
  'Operational coordination and ongoing support',
  'Long-term renewable electricity access',
]

const CheckDot = () => (
  <div
    style={{
      width: 24,
      height: 24,
      background: 'var(--muted)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 2,
    }}
  >
    <Check size={14} color="var(--primary)" strokeWidth={3} />
  </div>
)

const imageCardStyle = (image) => ({
  ...organicCardStyle,
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: `
    linear-gradient(
      rgba(0,0,0,0),
      rgba(0,0,0,0)
    ),
    url(${image})
  `,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: '#fff',
  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
  minHeight: '300px',
  willChange: 'transform',
})

export default function Solution() {
  const headerRef = useFadeIn()
  const flowRef = useFadeIn()
  const pointsRef = useFadeIn()

  return (
    <section id="solution" style={{ ...sectionPad, overflow: 'hidden' }}>

      <div style={{ ...container, position: 'relative', zIndex: 1 }}>
        <div ref={headerRef}>
          <SectionLabel>Our Solution</SectionLabel>
          <SectionHeading>Simplifying Renewable Energy</SectionHeading>
          <SectionBody>
            We act as the intelligent layer between renewable generators and industrial MSMEs —
            handling everything from aggregation to compliance.
          </SectionBody>
        </div>

        {/* FLOW SECTION */}
        <div
          ref={flowRef}
          style={{
            marginTop: '4rem',
            display: 'flex',
            alignItems: 'stretch',
            gap: '2rem',
          }}
          className="solution-flow"
        >

          {/* GENERATORS */}
          <div
            style={{
              ...imageCardStyle(generatorBg),
              flex: 1,
              textAlign: 'center',
              borderRadius: '4rem 2rem 2rem 4rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)'
              e.currentTarget.style.boxShadow = 'var(--shadow-deep)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0.35))',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius:
                    '30% 70% 70% 30% / 30% 30% 70% 70%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}
              >
                <Wind size={32} color="#fff" strokeWidth={2}  />
              </div>

              <div
                style={{
                  fontFamily: 'var(--ff-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                Renewable Generators
              </div>

              <div
                style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.92)',
                  lineHeight: 1.7,
                }}
              >
                Solar, wind, and hybrid energy producers seeking reliable industrial off-takers.
              </div>
            </div>
          </div>

          <div className="flow-arrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
            <ElectronFlow />
          </div>

          {/* SUN SUTRA */}
          <div
            style={{
              ...imageCardStyle(voltaraBg),
              flex: 1,
              textAlign: 'center',
              borderRadius: '2rem',
              transform: 'scale(1.05)',
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)'
              e.currentTarget.style.boxShadow = 'var(--shadow-deep)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.25))',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius:
                    '50% 50% 20% 80% / 25% 80% 20% 75%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}
              >
                <Combine size={32} color="#fff" strokeWidth={2} />
              </div>

              <div
                style={{
                  fontFamily: 'var(--ff-display)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                Sun Sutra Energy
              </div>

              <div
                style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.92)',
                  lineHeight: 1.7,
                }}
              >
                Aggregation, compliance, onboarding, and operational management.
              </div>
            </div>
          </div>

          <div className="flow-arrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
            <ElectronFlow />
          </div>

          {/* MSMEs */}
          <div
            style={{
              ...imageCardStyle(msmeBg),
              flex: 1,
              textAlign: 'center',
              borderRadius: '2rem 4rem 4rem 2rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)'
              e.currentTarget.style.boxShadow = 'var(--shadow-deep)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0.25))',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius:
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}
              >
                <Factory size={32} color="#fff" strokeWidth={2} />
              </div>

              <div
                style={{
                  fontFamily: 'var(--ff-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                Aggregated MSMEs
              </div>

              <div
                style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.92)',
                  lineHeight: 1.7,
                }}
              >
                Industrial clusters in Maharashtra accessing affordable clean electricity.
              </div>
            </div>
          </div>
        </div>

        {/* POINTS SECTION */}
        <div
          ref={pointsRef}
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: '1.5rem',
          }}
          className="sol-points"
        >
          {solPoints.map((pt, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '1.5rem 2rem',
                background: 'var(--surface)',
                border: '1px solid rgba(222,216,207,0.5)',
                borderRadius: '9999px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              <CheckDot />
              <span
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--foreground)',
                  fontWeight: 500,
                }}
              >
                {pt}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:1024px){
          .solution-flow{
            flex-direction:column!important;
            gap:1.5rem!important;
          }

          .flow-arrow {
            transform: rotate(90deg);
            height: 60px;
          }

          .solution-flow > div{
            border-radius:2rem!important;
            transform:none!important;
          }
        }

        @media(max-width:768px){
          .sol-points{
            grid-template-columns:1fr!important;
          }
          .sol-points > div {
            padding: 1rem 1.25rem !important;
            border-radius: 1.25rem !important;
          }
        }

        @media(hover: none) {
          .solution-flow > div {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}