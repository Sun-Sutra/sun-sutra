import { useState } from 'react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import { LineChart, ShieldCheck, Clock } from 'lucide-react'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

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

const inputErrorStyle = {
  ...inputStyle,
  borderColor: 'var(--destructive)',
  boxShadow: '0 0 0 3px rgba(168,84,72,0.1)',
}

const errorTextStyle = {
  fontSize: 12, color: 'var(--destructive)', fontWeight: 500,
  marginTop: 4, fontFamily: 'var(--ff-body)',
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '',
    bill: '', location: '', message: '',
  })
  const ref = useFadeIn()

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (submitting || submitted) return
    if (!validate()) return
    setSubmitting(true)
    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false,
      })

      // 2. Trigger SMTP emails (notification + auto-reply) via serverless function
      try {
        const emailRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const emailData = await emailRes.json()
        if (!emailRes.ok) {
          console.warn('Email API responded with error:', emailData)
        }
      } catch (emailErr) {
        // Email failure should not block the success state — message is already saved
        console.error('Email dispatch failed:', emailErr)
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Error saving message:', err)
      setErrors({ _form: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
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
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:6,background:'var(--primary)', zIndex: 2}}/>

            {/* ─── Success Confirmation Overlay ─── */}
            {submitted && (
              <div className="confirmation-overlay" style={{
                position: 'absolute', inset: 0, zIndex: 3,
                background: 'var(--surface)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '3rem', textAlign: 'center',
                animation: 'confirmFadeIn 0.5s ease',
              }}>
                <div className="confirm-check" style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #7a9468)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 30px rgba(93,112,82,0.3)',
                  animation: 'confirmPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both',
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" className="confirm-tick" />
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: 'var(--ff-display)', fontSize: '1.6rem',
                  color: 'var(--foreground)', marginBottom: '0.75rem',
                  animation: 'confirmSlideUp 0.4s ease 0.4s both',
                }}>Message Sent Successfully!</h3>
                <p style={{
                  color: 'var(--muted-foreground)', fontSize: '1rem',
                  lineHeight: 1.6, maxWidth: 340,
                  animation: 'confirmSlideUp 0.4s ease 0.55s both',
                }}>
                  Thank you for reaching out. Our team will review your inquiry and get back to you within 48 business hours.
                </p>
                <div style={{
                  marginTop: '2rem', padding: '12px 24px',
                  background: 'var(--muted)', borderRadius: '9999px',
                  fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600,
                  animation: 'confirmSlideUp 0.4s ease 0.7s both',
                }}>
                  ✉ Confirmation sent to {formData.email}
                </div>
              </div>
            )}

            {/* ─── Form Fields ─── */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem'}} className="form-grid">
              {[
                { label:'Full Name', id:'name', type:'text', placeholder:'Rajesh Kumar' },
                { label:'Company Name', id:'company', type:'text', placeholder:'ACME Industries Pvt Ltd' },
                { label:'Email Address', id:'email', type:'email', placeholder:'rajesh@acme.in' },
                { label:'Phone Number', id:'phone', type:'tel', placeholder:'+91 98765 43210' },
              ].map(f => (
                <div key={f.id} style={{display:'flex',flexDirection:'column',gap:8}}>
                  <label style={{fontSize:13,fontWeight:600,color:'var(--foreground)',fontFamily:'var(--ff-body)'}}>
                    {f.label}
                    {(f.id === 'name' || f.id === 'email') && <span style={{color:'var(--destructive)', marginLeft: 2}}>*</span>}
                  </label>
                  <input type={f.type} placeholder={f.placeholder}
                    style={errors[f.id] ? inputErrorStyle : inputStyle}
                    value={formData[f.id]}
                    onChange={handleChange(f.id)}
                    onFocus={e=>{e.target.style.borderColor = errors[f.id] ? 'var(--destructive)' : 'var(--primary)';e.target.style.boxShadow=`0 0 0 3px ${errors[f.id] ? 'rgba(168,84,72,0.1)' : 'rgba(93,112,82,0.1)'}`}}
                    onBlur={e=>{if(!errors[f.id]){e.target.style.borderColor='rgba(222,216,207,0.8)';e.target.style.boxShadow='none'}}}
                  />
                  {errors[f.id] && <span style={errorTextStyle}>{errors[f.id]}</span>}
                </div>
              ))}
              {/* Selects */}
              {[
                { label:'Monthly Electricity Bill', id:'bill', opts:['₹50,000 – ₹1,00,000','₹1,00,000 – ₹5,00,000','₹5,00,000 – ₹20,00,000','₹20,00,000+'] },
                { label:'Industrial Location', id:'location', opts:['Pune','Pimpri-Chinchwad','Chakan','MIDC Industrial Cluster','Other Maharashtra'] },
              ].map(s => (
                <div key={s.id} style={{display:'flex',flexDirection:'column',gap:8}}>
                  <label style={{fontSize:13,fontWeight:600,color:'var(--foreground)',fontFamily:'var(--ff-body)'}}>{s.label}</label>
                  <select style={inputStyle}
                    value={formData[s.id]}
                    onChange={handleChange(s.id)}
                    onFocus={e=>{e.target.style.borderColor='var(--primary)';e.target.style.boxShadow='0 0 0 3px rgba(93,112,82,0.1)'}}
                    onBlur={e=>{e.target.style.borderColor='rgba(222,216,207,0.8)';e.target.style.boxShadow='none'}}>
                    <option value="" disabled>Select range</option>
                    {s.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              {/* Textarea */}
              <div style={{display:'flex',flexDirection:'column',gap:8,gridColumn:'1/-1'}}>
                <label style={{fontSize:13,fontWeight:600,color:'var(--foreground)',fontFamily:'var(--ff-body)'}}>
                  Message <span style={{color:'var(--destructive)', marginLeft: 2}}>*</span>
                </label>
                <textarea placeholder="Tell us about your energy consumption needs or any specific questions..."
                  style={{...(errors.message ? inputErrorStyle : inputStyle), borderRadius:'1.5rem', resize:'vertical', minHeight:120}}
                  value={formData.message}
                  onChange={handleChange('message')}
                  onFocus={e=>{e.target.style.borderColor=errors.message ? 'var(--destructive)' : 'var(--primary)';e.target.style.boxShadow=`0 0 0 3px ${errors.message ? 'rgba(168,84,72,0.1)' : 'rgba(93,112,82,0.1)'}`}}
                  onBlur={e=>{if(!errors.message){e.target.style.borderColor='rgba(222,216,207,0.8)';e.target.style.boxShadow='none'}}}
                />
                {errors.message && <span style={errorTextStyle}>{errors.message}</span>}
              </div>
            </div>

            {/* Form-level error */}
            {errors._form && (
              <p style={{
                color: 'var(--destructive)', fontSize: 13, textAlign: 'center',
                background: 'rgba(168,84,72,0.08)', padding: '10px 16px',
                borderRadius: 12, border: '1px solid rgba(168,84,72,0.2)',
                marginBottom: '1rem',
              }}>{errors._form}</p>
            )}

            <button onClick={handleSubmit} disabled={submitted || submitting} className="btn-organic" style={{
              width:'100%', padding:'16px', justifyContent: 'center',
              background: 'var(--primary)',
              color:'var(--primary-foreground)', fontSize:'1.1rem',
              border:'none', cursor: submitting ? 'wait' : 'pointer',
              boxShadow: 'var(--shadow-soft)',
              opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? 'Sending...' : 'Get Renewable Cost Analysis'}
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
        @keyframes confirmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes confirmPop {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes confirmSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .confirm-tick {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: tickDraw 0.4s ease 0.5s forwards;
        }
        @keyframes tickDraw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  )
}
