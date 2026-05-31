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
  { num: '63M+', label: 'MSMEs in India' },
  { num: '₹7–9', label: 'Grid tariff per unit' },
  { num: '₹5–6', label: 'Renewable per unit' },
  { num: 'MH #1', label: 'Industrial market size' },
]

const regions = [
  'Pune — Main industrial and manufacturing hub',
  'Pimpri-Chinchwad — Automotive and engineering clusters',
  'Chakan — High-density MSME industrial corridor',
  'MIDC Industrial Clusters — State-designated development zones',
]

export default function Market() {
  const ref = useFadeIn()

  return (
    <section
      id="market"
      style={{
        ...sectionPad,
        background: 'var(--background)',
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
              ...organicCardStyle,
              padding: '4rem',
              borderRadius: '3rem',
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
              India's MSME sector represents one of the world's largest and
              most underserved industrial energy markets.
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
                  '30% 70% 70% 30% / 30% 30% 70% 70%',
                  '60% 40% 30% 70% / 60% 30% 70% 40%',
                  '50% 50% 20% 80% / 25% 80% 20% 75%',
                  '40% 60% 70% 30% / 40% 50% 60% 50%',
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
                        fontSize: '2.6rem',
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
          <div
            style={{
              ...organicCardStyle,
              padding: '4rem',
              borderRadius: '3rem',
            }}
          >
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