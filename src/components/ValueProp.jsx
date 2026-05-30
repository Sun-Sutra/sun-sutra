import { useState } from 'react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import { Check } from 'lucide-react'

const vpData = {
  msme: [
    'Lower electricity cost — up to 30% reduction vs. current industrial tariffs',
    'Long-term tariff stability with predictable energy pricing',
    'Simplified renewable procurement — no internal expertise required',
    'Full operational and compliance support throughout the lifecycle',
  ],
  generators: [
    'Aggregated industrial demand — large, consolidated off-take at once',
    'Long-term customers with structured purchase agreements',
    'Reduced customer acquisition costs via single-point aggregation',
    'Access to the MSME market segment without fragmented outreach',
  ],
  discoms: [
    'Renewable integration support through structured open-access utilization',
    'Stable industrial energy ecosystem with managed demand profiles',
    'Contribution toward state and national renewable adoption targets',
    'Reduced pressure on distribution infrastructure through demand rationalization',
  ],
}

export default function ValueProp() {
  const [active, setActive] = useState('msme')
  const headerRef = useFadeIn()
  const contentRef = useFadeIn()

  const tabs = [
    { id:'msme', label:'For MSMEs'},
    { id:'generators', label:'For Generators'},
    { id:'discoms', label:'For DISCOMs'},
  ]

  return (
    <section id="value" style={{...sectionPad, background: 'var(--background)'}}>
      <div style={container}>
        <div ref={headerRef} style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <SectionLabel>Value Proposition</SectionLabel>
          <SectionHeading>Value for Every Stakeholder</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>Our model creates aligned incentives for MSMEs, renewable generators, and the energy ecosystem.</SectionBody>
        </div>

        <div ref={contentRef} style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Tabs */}
          <div style={{
            display:'flex', gap:'0.5rem', background:'var(--muted)',
            padding: '0.5rem', borderRadius:'9999px', width:'fit-content',
            marginBottom:'3rem',
          }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActive(tab.id)} style={{
                padding:'12px 32px', fontSize:15, fontWeight: active===tab.id ? 700 : 600,
                color: active===tab.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                background: active===tab.id ? 'var(--primary)' : 'transparent',
                border:'none', cursor:'pointer', fontFamily:'var(--ff-body)',
                borderRadius: '9999px', transition:'all 0.3s ease',
                boxShadow: active===tab.id ? 'var(--shadow-soft)' : 'none'
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{...organicCardStyle, width: '100%', maxWidth: 1000}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'2rem'}} className="vp-grid">
              {vpData[active].map((item, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'flex-start', gap:16, padding:'1.5rem',
                  background:'var(--background)', borderRadius:'1.5rem',
                  border:'1px solid rgba(222,216,207,0.3)', transition:'all 0.3s ease',
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateX(6px)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none'}}>
                  <div style={{
                    width:32, height:32, background:'var(--muted)',
                    borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%', display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0, color:'var(--secondary)',
                  }}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <span style={{fontSize:'1.05rem', color:'var(--foreground)', lineHeight:1.6, fontWeight: 500}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.vp-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
