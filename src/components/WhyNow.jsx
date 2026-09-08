import {
  useFadeIn,
  SectionLabel,
  SectionHeading,
  SectionBody,
  sectionPad,
  container,
  organicCardStyle
} from './utils'

import industrialTariffs from '../assets/solutions/industrial_tariffs.jpg'
import fallingCosts from '../assets/solutions/falling_costs.jpg'
import openAccess from '../assets/solutions/open_access.jpg'
import sustainability from '../assets/solutions/sustainability.jpg'
import expandingEcosystem from '../assets/solutions/expanding_ecosystem.jpg'
import policyTailwinds from '../assets/solutions/policy_tailwinds.jpg'

const cards = [
  {
    image: industrialTariffs,
    title: "Rising Industrial Tariffs",
    desc: "Industrial electricity rates continue to climb, widening the cost gap between grid and renewable energy procurement."
  },
  {
    image: fallingCosts,
    title: "Falling Renewable Costs",
    desc: "Solar and wind generation costs are at all-time lows, making renewable procurement economically compelling at scale."
  },
  {
    image: openAccess,
    title: "Open Access Growth",
    desc: "Growing adoption of open-access frameworks is enabling industrial consumers to source power from non-DISCOM suppliers."
  },
  {
    image: sustainability,
    title: "Sustainability Demand",
    desc: "Export-oriented I&C businesses face increasing pressure from global buyers to demonstrate credible renewable energy sourcing."
  },
  {
    image: expandingEcosystem,
    title: "Expanding RE Ecosystem",
    desc: "India's renewable energy capacity is expanding rapidly, increasing supply and creating new procurement opportunities."
  },
  {
    image: policyTailwinds,
    title: "Policy Tailwinds",
    desc: "Government initiatives to promote renewable energy for the industrial sector are creating regulatory momentum."
  },
]

export default function WhyNow() {
  const headerRef = useFadeIn()
  const gridRef = useFadeIn()

  return (
    <section
      id="whynow"
      style={{
        ...sectionPad,
        background: 'var(--muted)'
      }}
    >

      <div
        style={{
          ...container,
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          ref={headerRef}
          style={{
            textAlign: 'center',
            maxWidth: 800,
            margin: '0 auto'
          }}
        >
          <SectionLabel>Why Now</SectionLabel>

          <SectionHeading>
            The Renewable Transition is Accelerating
          </SectionHeading>

          <SectionBody style={{ margin: '0 auto' }}>
            Key converging market forces are creating an unprecedented
            window for industrial renewable energy aggregation in India.
          </SectionBody>
        </div>

        <div
          ref={gridRef}
          className="why-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: '2rem',
            marginTop: '4rem'
          }}
        >
          {cards.map((card, index) => {
            const radii = [
              '3rem 1.5rem 3rem 1.5rem',
              '1.5rem 3rem 1.5rem 3rem',
              '2rem 2rem 4rem 2rem',
              '4rem 2rem 2rem 2rem',
              '2rem 4rem 2rem 2rem',
              '2rem 2rem 2rem 4rem'
            ]

            return (
              <div
                key={index}
                style={{
                  ...organicCardStyle,
                  borderRadius: radii[index % radii.length],
                  overflow: 'hidden',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--surface)',
                  border: '1px solid rgba(222,216,207,0.5)',
                  transition: 'all 0.4s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-deep)'

                  const img =
                    e.currentTarget.querySelector('.why-image')

                  if (img) {
                    img.style.transform = 'scale(1.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow =
                    'var(--shadow-soft)'

                  const img =
                    e.currentTarget.querySelector('.why-image')

                  if (img) {
                    img.style.transform = 'scale(1)'
                  }
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '180px',
                    overflow: 'hidden',
                    borderRadius: '1.5rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="why-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--ff-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    color: 'var(--foreground)'
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.7
                  }}
                >
                  {card.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media(max-width:1024px){
          .why-grid{
            grid-template-columns:1fr 1fr!important;
          }
        }

        @media(max-width:640px){
          .why-grid{
            grid-template-columns:1fr!important;
          }
        }
      `}</style>
    </section>
  )
}