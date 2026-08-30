import {
  useFadeIn,
  SectionLabel,
  SectionHeading,
  SectionBody,
  sectionPad,
  container,
  organicCardStyle,
} from './utils'

import { MapPin } from 'lucide-react'

const stats = [
  { num: '63M+', label: 'I&C Enterprises in India' },
  { num: '₹9-17', label: 'Grid tariff per unit' },
  { num: '₹7-15', label: 'Sunsutra tariff per unit' },
  { num: 'MH #1', label: 'Industrial market size' },
]

const regions = [
  'Pune — Main industrial and manufacturing hub',
  'Pimpri-Chinchwad — Automotive and engineering clusters',
  'Chakan — High-density I&C industrial corridor',
  'MIDC Industrial Clusters — State-designated development zones',
]

export default function Market() {
  const ref = useFadeIn()

  return (
    <section
      id="market"
      style={{
        ...sectionPad,
        paddingTop: 'clamp(100px, 10vw, 140px)',
        background: 'var(--background)',
        overflow: 'hidden',
      }}
    >
      <div
        className="blob-bg blob-2"
        style={{
          top: '10%',
          right: '10%',
          width: 400,
          height: 400,
        }}
      />

      <div
        style={{
          ...container,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          ref={ref}
          className="market-layout"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4rem',
          }}
        >

          {/* MARKET OPPORTUNITY */}
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <SectionLabel>Market Opportunity</SectionLabel>

            <SectionHeading>
              Massive Industrial Energy Opportunity
            </SectionHeading>

            <SectionBody
              style={{
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
              India's commercial and industrial sector represents one of the world's largest and
              most underserved energy markets.
            </SectionBody>

            <div
              className="stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(220px,1fr))',
                gap: '1.5rem',
                marginTop: '3rem',
              }}
            >
              {stats.map((s, index) => {
                const radii = [
                  '2rem 4rem 2rem 3rem',
                  '3rem 2rem 4rem 2rem',
                  '2rem 3rem 2rem 4rem',
                  '4rem 2rem 3rem 2rem',
                ]

                return (
                  <div
                    key={s.label}
                    style={{
                      padding: '2rem',
                      background: 'var(--surface)',
                      border:
                        '1px solid rgba(222,216,207,0.5)',
                      borderRadius:
                        radii[index % radii.length],
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-soft)',
                      transition:
                        'transform 0.35s ease, box-shadow 0.35s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-6px) scale(1.03)'
                      e.currentTarget.style.boxShadow =
                        'var(--shadow-float)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow =
                        'var(--shadow-soft)'
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--ff-display)',
                        fontSize: 'clamp(2rem, 6vw, 2.6rem)',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        lineHeight: 1,
                      }}
                    >
                      {s.num}
                    </div>

                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--muted-foreground)',
                        marginTop: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* FOCUS REGIONS */}
          <div>
              <div
                style={{
                textAlign: 'center',
                marginBottom: '3rem',
              }}
            >
              <SectionLabel>Focus Regions</SectionLabel>

              <h3
                style={{
                  fontFamily: 'var(--ff-display)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--foreground)',
                  marginBottom: '1rem',
                }}
              >
                Maharashtra Industrial Clusters
              </h3>

              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--muted-foreground)',
                  maxWidth: '700px',
                  margin: '0 auto',
                  lineHeight: 1.7,
                }}
              >
                Initial deployment targets high-density
                industrial zones in the Pune metropolitan
                region and adjacent manufacturing corridors.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(300px,1fr))',
                gap: '1.25rem',
              }}
            >
              {regions.map((r) => (
                <div
                  key={r}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.4rem 1.6rem',
                    background: 'var(--background)',
                    border:
                      '1px solid rgba(222,216,207,0.5)',
                    borderRadius: '1.25rem',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'var(--foreground)',
                    transition: 'all 0.3s ease',
                    boxShadow:
                      '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'translateX(8px)'
                    e.currentTarget.style.background =
                      'var(--muted)'
                    e.currentTarget.style.boxShadow =
                      'var(--shadow-soft)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      'none'
                    e.currentTarget.style.background =
                      'var(--background)'
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div
                    style={{
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>

                  {r}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media(max-width:1024px){

          .market-layout{
            gap:3rem!important;
          }

        }

        @media(max-width:768px){

          .market-layout > div{
            padding:2rem!important;
          }

          .stats-grid{
            grid-template-columns:1fr!important;
          }

        }
      `}</style>
    </section>
  )
}