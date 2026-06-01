import { useState } from 'react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import { LineChart, ShieldCheck, Clock } from 'lucide-react'

const trustItems = [
  { icon: <LineChart size={20} />, text: 'Free renewable cost analysis for your facility' },
  { icon: <ShieldCheck size={20} />, text: 'Your data is confidential and secure' },
  { icon: <Clock size={20} />, text: 'Response within 48 business hours' },
]

const inputStyle = {
  background:'var(--background)',
  border:'1px solid rgba(222,216,207,0.8)',
  borderRadius:'9999px', color:'var(--foreground)',
  fontFamily:'var(--ff-body)', fontSize:'1rem',
  padding:'14px 20px', width:'100%',
  outline:'none', transition:'border-color 0.3s, box-shadow 0.3s',
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const ref = useFadeIn()

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <section id="contact" style={{...sectionPad, background: 'var(--background)', overflow: 'hidden'}}>
      <div className="blob-bg blob-2" style={{ top: '10%', right: '0%', width: 500, height: 500 }} />
      <div style={{...container, position: 'relative', zIndex: 1}}>
        <div ref={ref} style={{
          display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'6rem', alignItems:'start',
        }} className="contact-layout">
          {/* Info */}
          <div style={{paddingTop:'2rem'}}>
            <SectionLabel>Contact Us</SectionLabel>
            <SectionHeading>Let's Build the Future of Industrial Energy</SectionHeading>
            <SectionBody style={{marginBottom:'3rem'}}>
              Tell us about your facility and we'll deliver a personalized cost analysis showing your potential savings.
            </SectionBody>
            <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
              {trustItems.map((item, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:16,
                  padding:'1.25rem 1.5rem', background:'var(--surface)',
                  border:'1px solid rgba(222,216,207,0.5)', borderRadius:'9999px',
                  fontSize:'0.95rem', color:'var(--muted-foreground)', fontWeight: 500,
                  boxShadow:'0 2px 10px rgba(0,0,0,0.02)',
                }}>
                  <div style={{
                    width:40, height:40, background:'var(--muted)', borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                    color:'var(--primary)',
                  }}>
                    {item.icon}
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div style={{
            ...organicCardStyle,
            borderRadius: '2rem 4rem 3rem 1.5rem',
            padding: '3.5rem',
          }}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:6,background:'var(--primary)'}}/>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem'}} className="form-grid">
              {[
                { label:'Full Name', id:'name', type:'text', placeholder:'Rajesh Kumar' },
                { label:'Company Name', id:'company', type:'text', placeholder:'ACME Industries Pvt Ltd' },
                { label:'Email Address', id:'email', type:'email', placeholder:'rajesh@acme.in' },
                { label:'Phone Number', id:'phone', type:'tel', placeholder:'+91 98765 43210' },
              ].map(f => (
                <div key={f.id} style={{display:'flex',flexDirection:'column',gap:8}}>
                  <label style={{fontSize:13,fontWeight:600,color:'var(--foreground)',fontFamily:'var(--ff-body)'}}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} style={inputStyle}
                    onFocus={e=>{e.target.style.borderColor='var(--primary)';e.target.style.boxShadow='0 0 0 3px rgba(93,112,82,0.1)'}}
                    onBlur={e=>{e.target.style.borderColor='rgba(222,216,207,0.8)';e.target.style.boxShadow='none'}}
                  />
                </div>
              ))}
              {/* Selects */}
              {[
                { label:'Monthly Electricity Bill', id:'bill', opts:['₹50,000 – ₹1,00,000','₹1,00,000 – ₹5,00,000','₹5,00,000 – ₹20,00,000','₹20,00,000+'] },
                { label:'Industrial Location', id:'loc', opts:['Pune','Pimpri-Chinchwad','Chakan','MIDC Industrial Cluster','Other Maharashtra'] },
              ].map(s => (
                <div key={s.id} style={{display:'flex',flexDirection:'column',gap:8}}>
                  <label style={{fontSize:13,fontWeight:600,color:'var(--foreground)',fontFamily:'var(--ff-body)'}}>{s.label}</label>
                  <select style={inputStyle}
                    onFocus={e=>{e.target.style.borderColor='var(--primary)';e.target.style.boxShadow='0 0 0 3px rgba(93,112,82,0.1)'}}
                    onBlur={e=>{e.target.style.borderColor='rgba(222,216,207,0.8)';e.target.style.boxShadow='none'}}>
                    <option value="" disabled selected>Select range</option>
                    {s.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              {/* Textarea */}
              <div style={{display:'flex',flexDirection:'column',gap:8,gridColumn:'1/-1'}}>
                <label style={{fontSize:13,fontWeight:600,color:'var(--foreground)',fontFamily:'var(--ff-body)'}}>Message (Optional)</label>
                <textarea placeholder="Tell us about your energy consumption needs or any specific questions..."
                  style={{...inputStyle, borderRadius:'1.5rem', resize:'vertical', minHeight:120}}
                  onFocus={e=>{e.target.style.borderColor='var(--primary)';e.target.style.boxShadow='0 0 0 3px rgba(93,112,82,0.1)'}}
                  onBlur={e=>{e.target.style.borderColor='rgba(222,216,207,0.8)';e.target.style.boxShadow='none'}}
                />
              </div>
            </div>
            <button onClick={handleSubmit} disabled={submitted} className="btn-organic" style={{
              width:'100%', padding:'16px', justifyContent: 'center',
              background: submitted ? 'var(--secondary)' : 'var(--primary)',
              color:'var(--primary-foreground)', fontSize:'1.1rem',
              border:'none', cursor: submitted ? 'default' : 'pointer',
              boxShadow: submitted ? 'none' : 'var(--shadow-soft)',
            }}>
              {submitted ? '✓ Request Received — We\'ll be in touch!' : 'Get Renewable Cost Analysis'}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){
          .contact-layout{grid-template-columns:1fr!important;gap:3rem!important}
        }
        @media(max-width:640px){
          .form-grid{grid-template-columns:1fr!important}
          .contact-layout > div:last-child { padding: 2rem !important; }
        }
      `}</style>
    </section>
  )
}
