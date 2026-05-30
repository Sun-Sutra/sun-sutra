import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Layers, Briefcase } from 'lucide-react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'

const flowItems = [
  { icon: <MapPin size={20} />, title: 'Maharashtra Industrial Clusters', desc: 'Focused on Pune and nearby MIDC regions for initial rollout' },
  { icon: <Layers size={20} />, title: 'Group Captive & Open Access', desc: 'Leveraging proven procurement models for MSME access' },
  { icon: <Briefcase size={20} />, title: 'End-to-End Management', desc: 'Compliance, onboarding, and operational coordination' },
]

export default function About() {
  const ref = useFadeIn()
  return (
    <section id="about" style={{...sectionPad, background: 'var(--muted)'}}>
      <div className="blob-bg blob-3" style={{ top: '20%', left: '-10%', width: 400, height: 400 }} />
      <div style={container}>
        <div ref={ref} style={{
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6rem', alignItems:'center', position: 'relative', zIndex: 1
        }} className="about-grid">
          <div>
            <SectionLabel>About Us</SectionLabel>
            <SectionHeading>Building Affordable Renewable Energy Access for MSMEs</SectionHeading>
            <SectionBody>
              We are building an MSME-focused renewable energy aggregation business that enables industries to access affordable clean electricity through group captive and open-access procurement models.
            </SectionBody>
            <SectionBody style={{marginTop:'1.5rem'}}>
              Our mission is to simplify renewable energy procurement for fragmented industrial consumers by coordinating with renewable energy generators and streamlining onboarding, compliance, and operational management.
            </SectionBody>
            <div style={{marginTop:'3rem'}}>
              <Link to="/contact" className="btn-organic" style={{
                background:'var(--primary)', color:'var(--primary-foreground)',
                fontSize:16, padding:'16px 32px', boxShadow:'var(--shadow-soft)',
              }}>
                Partner With Us <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Organic Card */}
          <div style={{
            ...organicCardStyle,
            borderRadius: '4rem 2rem 5rem 1.5rem', /* Wabi-Sabi Asymmetry */
            background: 'var(--surface)',
          }}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:'var(--secondary)'}}/>
            <SectionLabel>Current Focus</SectionLabel>
            <div style={{display:'flex', flexDirection:'column', gap:'1.5rem', marginTop:'1.5rem'}}>
              {flowItems.map((item, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'flex-start', gap:'1.25rem', padding:'1.5rem',
                  background:'var(--background)', borderRadius:'1.5rem', border:'1px solid rgba(222,216,207,0.5)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    width:44, height:44, background:'var(--muted)', borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                    color: 'var(--primary)'
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{fontSize:'1.05rem',fontWeight:700,marginBottom:4, color: 'var(--foreground)', fontFamily: 'var(--ff-display)'}}>{item.title}</div>
                    <div style={{fontSize:'0.9rem',color:'var(--muted-foreground)', lineHeight: 1.5}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{display:'flex', gap:'1.5rem', marginTop:'2.5rem'}}>
              {[['₹5–6','Renewable Rate', 'var(--primary)'],['₹7–9','Current Tariff', 'var(--destructive)']].map(([num, label, color]) => (
                <div key={label} style={{
                  flex:1, padding:'1.5rem', background:'var(--background)',
                  borderRadius:'1.5rem', border:'1px solid rgba(222,216,207,0.5)',
                  textAlign: 'center'
                }}>
                  <div style={{fontFamily:'var(--ff-display)',fontSize:'2rem',fontWeight:700,color}}>{num}</div>
                  <div style={{fontSize:12,color:'var(--muted-foreground)',marginTop:4, fontWeight: 600, textTransform: 'uppercase'}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.about-grid{grid-template-columns:1fr!important;gap:4rem!important}}`}</style>
    </section>
  )
}
