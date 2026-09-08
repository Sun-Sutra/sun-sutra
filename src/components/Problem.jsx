import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ArrowRight, BookOpen, Clock, Sparkles, TrendingUp, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react'
import { useFadeIn, useParallax, SectionLabel, SectionHeading, SectionBody, sectionPad, container } from './utils'

import industrialTariffs from '../assets/solutions/industrial_tariffs.jpg'
import fragmentedDemand from '../assets/solutions/fragmented_demand.jpg'
import regulatoryBarriers from '../assets/solutions/regulatory_barriers.jpg'
import limitedAccess from '../assets/solutions/limited_access.jpg'
import procurementComplexity from '../assets/solutions/procurement_complexity.jpg'
import noSupport from '../assets/solutions/no_support.jpg'

const problems = [
  {
    num: '01',
    title: 'High Industrial Tariffs',
    desc: 'Industrial electricity tariffs between ₹9-17 per unit create an unsustainable cost burden for I&C consumers competing in tight margins.',
    image: industrialTariffs
  },
  {
    num: '02',
    title: 'Complex Procurement',
    desc: 'The renewable energy procurement process is riddled with compliance requirements, technical barriers, and regulatory complexity.',
    image: procurementComplexity
  },
  {
    num: '03',
    title: 'Fragmented Demand',
    desc: 'Individual I&C industrial facilities lack the scale to negotiate directly with renewable generators, who require large, consolidated demand commitments.',
    image: fragmentedDemand
  },
  {
    num: '04',
    title: 'Limited Access',
    desc: 'Large-scale renewable procurement channels are designed for large conglomerates, shutting out mid-scale I&C consumers entirely.',
    image: limitedAccess
  },
  {
    num: '05',
    title: 'Regulatory Barriers',
    desc: 'Onboarding, compliance, and approvals require specialized expertise that most I&C facilities cannot afford in-house.',
    image: regulatoryBarriers
  },
  {
    num: '06',
    title: 'No Coordination Support',
    desc: 'There is no single operational partner to manage the end-to-end process from procurement through delivery for small and mid-scale industrials.',
    image: noSupport
  },
];

const problemArticles = {
  '01': {
    tag: 'Industrial Economics',
    readTime: '4 min read',
    title: 'The High Tariff Burden: How Power Costs Erode Indian Manufacturing Competitiveness',
    subtitle: 'Why commercial and industrial retail grid tariffs of ₹9–₹17/kWh are forcing I&C consumers to reconsider their power procurement strategy.',
    stats: [
      { label: 'Avg Industrial Tariff', value: '₹10.5–15/kWh' },
      { label: 'PPA Alternative', value: '₹6.50/kWh' },
      { label: 'Achievable Net Savings', value: 'Up to 35%' }
    ],
    paragraphs: [
      'In states like Maharashtra, Gujarat, and Tamil Nadu, industrial electricity tariffs continue to rank among the highest globally. Commercial and industrial (I&C) consumers face high cross-subsidy surcharges embedded in retail grid billing to offset subsidized residential and agricultural consumption.',
      'For manufacturing plants operating in injection molding, auto-ancillaries, metal fabrication, and textile spinning, electricity accounts for 20% to 40% of total direct manufacturing overhead. When utility power tariffs escalate by 4% to 8% annually, it severely compresses operating margins and inhibits capital reinvestment.',
      'Utility-scale solar and wind projects generate power at ₹3.20–₹4.50 per unit. Even after accounting for open-access transmission losses, wheeling charges, and state duties, delivered renewable energy costs approximately ₹6.50–₹7.50 per unit. Transitioning to open access delivers immediate, durable bottom-line relief.'
    ],
    keyPoints: [
      'Industrial units pay up to 3x higher tariffs than agricultural and domestic consumers.',
      'Annual DISCOM tariff revision petitions continually drive power inflation.',
      'Aggregated renewable PPAs lock in flat, predictable tariffs for 10 to 15 years.'
    ],
    solutionHeading: 'How Sun Sutra Solves High Tariffs',
    solutionText: 'Sun Sutra aggregates power requirements across industrial clusters to negotiate institutional flat tariffs from tier-1 renewable generators, reducing delivered costs by 20% to 35% without requiring upfront CAPEX.'
  },
  '02': {
    tag: 'Procurement & Engineering',
    readTime: '5 min read',
    title: 'Demystifying Complex Energy Procurement for Manufacturing Plant Heads',
    subtitle: 'From contract demand calculations to TOD slot optimization, navigating renewable energy contracts without operational disruption.',
    stats: [
      { label: 'Typical Timeline', value: '45–60 Days' },
      { label: 'Parties Involved', value: '4+ Entities' },
      { label: 'Internal Effort', value: 'Zero with Sun Sutra' }
    ],
    paragraphs: [
      'Procuring renewable power is fundamentally different from buying raw materials or standard factory equipment. It requires deep technical assessments of load curves, contract demand (kVA), time-of-day (TOD) drawal patterns, and transformer capacity.',
      'For a typical factory manager or CFO, interfacing with state load dispatch centers (SLDC), DISCOM sub-divisions, transmission utilities, and private power developers simultaneously creates massive administrative friction and risk of contract mispricing.',
      'Sun Sutra unifies this entire workflow. By conducting AI-driven automated bill audits and handling all technical coordination, we remove the burden from your in-house team entirely.'
    ],
    keyPoints: [
      'Complex load curves require precise capacity sizing to avoid deviation penalties.',
      'Multiple regulatory clearances must be harmonized simultaneously.',
      'Turnkey management ensures clean switchover without grid interruption.'
    ],
    solutionHeading: 'Turnkey Procurement Architecture',
    solutionText: 'We handle load modeling, technical feasibility studies, and bilateral contract structuring, delivering a seamless power procurement experience with zero downtime.'
  },
  '03': {
    tag: 'Demand Aggregation',
    readTime: '4 min read',
    title: 'The Power of Aggregation: Overcoming Fragmented I&C Industrial Demand',
    subtitle: 'Why individual factory units get overlooked by major solar/wind developers, and how load pooling unlocks tier-1 pricing.',
    stats: [
      { label: 'Min Developer Scale', value: '10 MW+' },
      { label: 'Avg I&C Load', value: '250kW–1MW' },
      { label: 'Bargaining Power', value: 'Institutional' }
    ],
    paragraphs: [
      'India’s largest renewable developers build solar parks and wind farms sized at 50 MW to 500 MW. Securing institutional project finance requires them to sign high-volume power purchase agreements with creditworthy off-takers.',
      'Consequently, commercial and industrial enterprises needing 50 kW to 1,000 kW get turned away or offered suboptimal, expensive retail terms because their demand is fragmented and individually unviable.',
      'Sun Sutra acts as an aggregator. By consolidating the power requirements of dozens of manufacturers across industrial clusters (such as Chakan, Bhosari, and Talegaon), we present a combined 10 MW+ portfolio that commands institutional pricing.'
    ],
    keyPoints: [
      'Tier-1 generators only entertain large corporate off-takers due to banking constraints.',
      'Individual I&C consumers lack the transaction volume to negotiate favorable PPA terms.',
      'Demand aggregation levels the playing field, securing tier-1 tariffs for mid-scale industrials.'
    ],
    solutionHeading: 'Aggregated Industrial Buyer Pool',
    solutionText: 'By pooling multi-factory demand across Maharashtra MIDC clusters, Sun Sutra secures bulk utility-scale pricing normally reserved for conglomerate buyers.'
  },
  '04': {
    tag: 'Market Accessibility',
    readTime: '4 min read',
    title: 'Breaking the Open Access Monopoly: Clean Power for Every Industrial Consumer',
    subtitle: 'Understanding Green Energy Open Access Rules (GEOAR) and how I&C industrials can leverage the 100 kW threshold.',
    stats: [
      { label: 'Old Threshold', value: '1,000 kW (1 MW)' },
      { label: 'New GEOAR Threshold', value: '100 kW' },
      { label: 'Eligible Factories', value: '100,000+' }
    ],
    paragraphs: [
      'For over a decade, Open Access was the exclusive domain of multi-crore corporations with captive substations and massive power needs above 1 MW. Small and mid-scale enterprises were effectively locked out and dependent on local DISCOM monopoly rates.',
      'The landmark Green Energy Open Access Rules (GEOAR) reduced the minimum sanctioned load requirement from 1 MW down to 100 kW, opening the door for hundreds of thousands of medium factories, commercial hubs, and cold storage facilities.',
      'However, qualifying under policy is only the first step. Execution requires commercial packaging, banking agreements, and supplier matching. Sun Sutra builds the bridge that brings this legal right into practical, daily cost savings.'
    ],
    keyPoints: [
      'GEOAR 100 kW rule enables mid-scale enterprises to legally access open market power.',
      'Policy reform alone is insufficient without dedicated aggregation and execution infrastructure.',
      'I&C businesses can now achieve the same energy sustainability targets as multinational corporations.'
    ],
    solutionHeading: 'Democratized Energy Sourcing',
    solutionText: 'Sun Sutra facilitates seamless open access onboarding for connected loads starting at 100 kW, allowing I&C manufacturers to bypass legacy DISCOM monopolies.'
  },
  '05': {
    tag: 'Compliance & Regulation',
    readTime: '5 min read',
    title: 'Navigating MERC Regulations, Open Access Petitions, and Surcharges',
    subtitle: 'How regulatory compliance and accurate energy banking scheduling protect industrial consumers from surprise penalty charges.',
    stats: [
      { label: 'MERC Regulations', value: 'Multi-Tiered' },
      { label: 'Filing Accuracy', value: '100% Guaranteed' },
      { label: 'Surcharge Optimization', value: 'Maximized' }
    ],
    paragraphs: [
      'The Indian power regulatory framework is governed by State Electricity Regulatory Commissions (such as MERC in Maharashtra). Open access consumer petitions involve complex filings, including connectivity approvals, wheeling agreements, and metering verification.',
      'Improper monthly scheduling or delays in open access renewals can trigger Deviation Settlement Mechanism (DSM) charges or loss of banking credits, eroding expected savings.',
      'Sun Sutra maintains deep regulatory advisory capabilities. We manage all ongoing filings, DISCOM coordination, and tariff order updates to ensure our clients remain 100% compliant with zero risk of penalty.'
    ],
    keyPoints: [
      'State regulatory orders dictate wheeling, transmission, and cross-subsidy charges.',
      'Proactive scheduling and banking reconciliation prevent costly penalties.',
      'Sun Sutra provides end-to-end regulatory filings and compliance monitoring.'
    ],
    solutionHeading: 'Automated Regulatory Management',
    solutionText: 'Our experienced regulatory team handles all liaison with state utilities, SLDC, and regulatory commissions, insulating your operations from administrative friction.'
  },
  '06': {
    tag: 'Lifecycle Operations',
    readTime: '4 min read',
    title: 'Beyond the Signature: The Vital Need for Continuous Energy Lifecycle Management',
    subtitle: 'Why signing a PPA is only the first step, and how monthly bill validation ensures projected savings actually hit your bank account.',
    stats: [
      { label: 'Contract Tenure', value: '10–15 Years' },
      { label: 'Audit Frequency', value: 'Monthly' },
      { label: 'Support Model', value: 'Dedicated SPM' }
    ],
    paragraphs: [
      'In traditional energy consulting, brokers connect buyers and sellers, collect a one-time transaction fee, and exit. When monthly billing discrepancies arise between the DISCOM statement and the generator invoice, the consumer is left stranded.',
      'Effective energy cost optimization requires active monthly bill auditing: cross-verifying gross generation meter data against net delivered units, checking banking rollover, and resolving tariff rate mismatches with utility billing desks.',
      'Sun Sutra remains your operational energy partner for the entire 10-to-15-year lifecycle of the PPA. Our automated audit engine reconciles every monthly electricity bill to verify that every single rupee of promised savings is realized.'
    ],
    keyPoints: [
      'One-time brokers cannot solve recurring monthly billing and meter settlement errors.',
      'Continuous monthly reconciliation safeguards your facility from overbilling.',
      'Sun Sutra provides dedicated operational oversight throughout the entire agreement tenure.'
    ],
    solutionHeading: 'Dedicated Lifecycle Partnership',
    solutionText: 'We monitor generation yields, audit monthly DISCOM bills, and handle operational coordination for the full tenure of the PPA, guaranteeing verified long-term savings.'
  }
};

const ProblemCard = ({ p, index, radii, onOpenArticle }) => {
  const parallaxRef = useParallax(0.1);

  return (
    <div
      onClick={() => onOpenArticle(p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenArticle(p) }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '340px',
        borderRadius: radii[index % radii.length],
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '2rem',
        boxShadow: 'var(--shadow-soft)',
      }}
      className="problem-interactive-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = 'var(--shadow-deep)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
      }}
    >
      {/* Background Image with Parallax */}
      <div 
        ref={parallaxRef}
        style={{
          position: 'absolute',
          top: '-20%',
          left: 0,
          right: 0,
          bottom: '-20%',
          backgroundImage: `url(${p.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
          willChange: 'transform'
        }}
      />
      {/* Gradient Overlay */}
      <div 
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.2) 100%)',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{
            fontFamily: 'var(--ff-display)',
            fontSize: '2.8rem',
            fontWeight: 800,
            color: '#ffffff',
            opacity: 0.95,
            lineHeight: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}>
            {p.num}
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Read Blog <ArrowUpRight size={12} />
          </span>
        </div>

        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.6rem',
          fontFamily: 'var(--ff-display)',
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          lineHeight: 1.25
        }}>
          {p.title}
        </h3>
        <p style={{
          fontSize: '0.92rem',
          color: 'rgba(255,255,255,0.92)',
          lineHeight: 1.6,
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          margin: 0
        }}>
          {p.desc}
        </p>
      </div>
    </div>
  );
};

export default function Problem() {
  const headerRef = useFadeIn()
  const gridRef = useFadeIn()
  const [activeArticleId, setActiveArticleId] = useState(null)

  const activeProblem = problems.find(p => p.num === activeArticleId)
  const activeArticle = activeArticleId ? problemArticles[activeArticleId] : null

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveArticleId(null)
      }
    }
    if (activeArticleId) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [activeArticleId])

  return (
    <section id="problem" style={{
      ...sectionPad,
      background: 'var(--background)'
    }}>
      <div style={container}>
        <div ref={headerRef} style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <SectionLabel>The Industry Challenges</SectionLabel>
          <SectionHeading>Why I&C Consumers Struggle with Renewable Power</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>
            Industrial and commercial consumers face high tariffs and structural procurement bottlenecks. Click any topic below to read our detailed industry breakdown.
          </SectionBody>
        </div>
        
        <div ref={gridRef} style={{
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem', marginTop:'4rem',
        }} className="problem-grid">
          {problems.map((p, index) => {
            const radii = [
              '4rem 2rem 2rem 2rem',
              '2rem 4rem 2rem 2rem',
              '2rem 2rem 4rem 2rem',
              '2rem 2rem 2rem 4rem',
              '3rem 1.5rem 3rem 1.5rem',
              '1.5rem 3rem 1.5rem 3rem'
            ]
            return (
              <ProblemCard 
                key={p.num} 
                p={p} 
                index={index} 
                radii={radii} 
                onOpenArticle={(item) => setActiveArticleId(item.num)} 
              />
            )
          })}
        </div>
      </div>

      {/* ─── High-Production Blog Modal Reader ─── */}
      {activeArticle && activeProblem && (
        <div 
          onClick={() => setActiveArticleId(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeInModal 0.25s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              maxWidth: '840px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="custom-blog-modal"
          >
            {/* Modal Header Bar with Close Button */}
            <div style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '16px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em'
                }}>
                  TOPIC {activeProblem.num}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {activeArticle.tag}
                </span>
                <span style={{ color: 'var(--border)' }}>•</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {activeArticle.readTime}
                </span>
              </div>

              <button
                onClick={() => setActiveArticleId(null)}
                aria-label="Close article"
                style={{
                  background: 'var(--muted)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--foreground)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--foreground)';
                  e.currentTarget.style.color = 'var(--background)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--muted)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Body */}
            <div style={{ padding: '2rem 2.5rem 3rem 2.5rem' }}>
              {/* Article Title & Subtitle */}
              <h2 style={{
                fontFamily: 'var(--ff-display)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
                fontWeight: 800,
                color: 'var(--foreground)',
                lineHeight: 1.2,
                margin: '0 0 1rem 0'
              }}>
                {activeArticle.title}
              </h2>

              <p style={{
                fontSize: '1.05rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.6,
                margin: '0 0 2rem 0',
                fontWeight: 500
              }}>
                {activeArticle.subtitle}
              </p>

              {/* Highlight Stats Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                background: 'var(--muted)',
                padding: '1.25rem',
                borderRadius: '16px',
                marginBottom: '2.5rem',
                border: '1px solid var(--border)'
              }}>
                {activeArticle.stats.map((st, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {st.label}
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--foreground)', fontFamily: 'var(--ff-display)', marginTop: 4 }}>
                      {st.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Body Paragraphs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--foreground)', fontSize: '1rem', lineHeight: 1.75 }}>
                {activeArticle.paragraphs.map((pText, i) => (
                  <p key={i} style={{ margin: 0 }}>
                    {pText}
                  </p>
                ))}
              </div>

              {/* Key Takeaways Box */}
              <div style={{
                margin: '2.5rem 0',
                padding: '1.5rem',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px'
              }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  margin: '0 0 1rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Sparkles size={16} /> Key Industry Takeaways
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeArticle.keyPoints.map((kp, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.92rem', color: 'var(--foreground)', lineHeight: 1.5 }}>
                      <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution & Action Box */}
              <div style={{
                background: 'var(--foreground)',
                color: 'var(--background)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: '1 1 320px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FDE047', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    THE SUN SUTRA SOLUTION
                  </span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 8px 0', color: '#fff', fontFamily: 'var(--ff-display)' }}>
                    {activeArticle.solutionHeading}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                    {activeArticle.solutionText}
                  </p>
                </div>

                <Link
                  to="/analysis"
                  onClick={() => setActiveArticleId(null)}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  Analyze Your Facility Tariffs <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media(max-width:1024px){.problem-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:640px){
          .problem-grid{grid-template-columns:1fr!important}
          .custom-blog-modal { padding: 1.5rem 1.25rem !important; }
        }
      `}</style>
    </section>
  )
}
