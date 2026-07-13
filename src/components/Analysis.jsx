import { useState } from 'react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container, organicCardStyle } from './utils'
import { LineChart, ShieldCheck, Clock } from 'lucide-react'
import UploadSection from './UploadSection'

const trustItems = [
  { icon: <LineChart size={20} />, text: 'Detailed analysis of your energy consumption' },
  { icon: <ShieldCheck size={20} />, text: 'Accurate cost predictions based on your data' },
  { icon: <Clock size={20} />, text: 'Instant reports to optimize your savings' },
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

export default function Analysis() {
  const [formData, setFormData] = useState({
    state: '',
    monthlyBill: '',
    industry: '',
    consumerNumber: '',
    discom: '',
    htLt: '',
    tariffCategory: '',
    consumerCategory: '',
    connectedLoad: '',
    sanctionedLoad: '',
    contractDemand: '',
    monthlyConsumption: '',
    billingHistory: '',
    energyCharges: '',
    fixedDemandCharges: '',
    fac: '',
    electricityDuty: '',
    wheelingCharges: '',
  })
  const [errors, setErrors] = useState({})
  const ref = useFadeIn()

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    const cn = formData.consumerNumber.trim()
    if (!cn) {
      newErrors.consumerNumber = 'Consumer number is required'
    } else if (!/^\d{13}$/.test(cn)) {
      newErrors.consumerNumber = 'Consumer number must be exactly 13 digits'
    }

    if (!formData.monthlyBill.trim()) newErrors.monthlyBill = 'Monthly bill is required'
    if (!formData.discom.trim()) newErrors.discom = 'DISCOM is required'
    if (!formData.connectedLoad.trim()) newErrors.connectedLoad = 'Connected load is required'
    if (!formData.sanctionedLoad.trim()) newErrors.sanctionedLoad = 'Sanctioned load is required'
    if (!formData.contractDemand.trim()) newErrors.contractDemand = 'Contract demand is required'
    if (!formData.monthlyConsumption.trim()) newErrors.monthlyConsumption = 'Monthly consumption is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleExtractedData = (aiData) => {
    setFormData(prev => ({
      ...prev,
      state: aiData.state || prev.state,
      monthlyBill: aiData.monthlyBill || prev.monthlyBill,
      industry: aiData.industry || prev.industry,
      consumerNumber: aiData.consumerNumber || prev.consumerNumber,
      discom: aiData.discom || prev.discom,
      htLt: aiData.htLt || prev.htLt,
      tariffCategory: aiData.tariffCategory || prev.tariffCategory,
      consumerCategory: aiData.consumerCategory || prev.consumerCategory,
      connectedLoad: aiData.connectedLoad || prev.connectedLoad,
      sanctionedLoad: aiData.sanctionedLoad || prev.sanctionedLoad,
      contractDemand: aiData.contractDemand || prev.contractDemand,
      monthlyConsumption: aiData.monthlyConsumption || prev.monthlyConsumption,
      billingHistory: aiData.billingHistory || prev.billingHistory,
      energyCharges: aiData.energyCharges || prev.energyCharges,
      fixedDemandCharges: aiData.fixedDemandCharges || prev.fixedDemandCharges,
      fac: aiData.fac || prev.fac,
      electricityDuty: aiData.electricityDuty || prev.electricityDuty,
      wheelingCharges: aiData.wheelingCharges || prev.wheelingCharges,
    }));
  };

  const handleAnalysis = () => {
    if (!validate()) return
    // Button currently does nothing, you can output here later
    console.log("Get Analysis clicked with data:", formData)
  }

  const fields = [
    { 
      label: 'State', id: 'state', type: 'select', placeholder: 'Select state',
      options: [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
      ]
    },
    { label: 'Monthly Electricity Bill (₹)', id: 'monthlyBill', type: 'text', placeholder: 'e.g. 100000' },
    { 
      label: 'Industry', id: 'industry', type: 'select', placeholder: 'Select your industry',
      options: [
        'Textile processing',
        'Foundries/Metal processing',
        'Plastic manufacturing',
        'Cold storage',
        'Food processing',
        'Packaging',
        'Engineering workshop',
        'Others'
      ]
    },
    { label: 'Consumer Number', id: 'consumerNumber', type: 'text', placeholder: 'Enter consumer number' },
    { label: 'DISCOM', id: 'discom', type: 'text', placeholder: 'Enter DISCOM' },
    { label: 'HT/LT', id: 'htLt', type: 'text', placeholder: 'e.g. HT or LT' },
    { label: 'Tariff Category', id: 'tariffCategory', type: 'text', placeholder: 'Enter tariff category' },
    { label: 'Consumer Category', id: 'consumerCategory', type: 'text', placeholder: 'Enter consumer category' },
    { label: 'Connected Load', id: 'connectedLoad', type: 'text', placeholder: 'Enter connected load' },
    { label: 'Sanctioned Load', id: 'sanctionedLoad', type: 'text', placeholder: 'Enter sanctioned load' },
    { label: 'Contract Demand', id: 'contractDemand', type: 'text', placeholder: 'Enter contract demand' },
    { label: 'Monthly Consumption (kWh)', id: 'monthlyConsumption', type: 'text', placeholder: 'e.g. 5000' },
    { label: 'Billing History', id: 'billingHistory', type: 'text', placeholder: 'Enter billing history' },
    { label: 'Energy Charges', id: 'energyCharges', type: 'text', placeholder: 'Enter energy charges' },
    { label: 'Fixed/Demand Charges', id: 'fixedDemandCharges', type: 'text', placeholder: 'Enter fixed/demand charges' },
    { label: 'FAC', id: 'fac', type: 'text', placeholder: 'Enter FAC' },
    { label: 'Electricity Duty', id: 'electricityDuty', type: 'text', placeholder: 'Enter electricity duty' },
    { label: 'Wheeling Charges (if shown)', id: 'wheelingCharges', type: 'text', placeholder: 'Enter wheeling charges' },
  ]

  return (
    <section id="analysis" style={{...sectionPad, background: 'var(--background)', overflow: 'hidden'}}>
      <div className="blob-bg blob-2" style={{ top: '10%', right: '0%', width: 500, height: 500 }} />
      <div style={{...container, position: 'relative', zIndex: 1}}>
        <div ref={ref} style={{
          display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'6rem', alignItems:'start',
        }} className="analysis-layout">
          {/* Info */}
          <div style={{paddingTop:'2rem'}}>
            <SectionLabel>Energy Analysis</SectionLabel>
            <SectionHeading>Analyze Your Power Consumption</SectionHeading>
            <SectionBody style={{marginBottom:'3rem'}}>
              Provide your billing details below, and we'll generate a comprehensive analysis of your energy usage and potential savings.
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

            <UploadSection onExtracted={handleExtractedData} />

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'2rem'}} className="form-grid">
              {fields.map(f => (
                <div key={f.id} style={{display:'flex',flexDirection:'column',gap:8}}>
                  <label style={{fontSize:13,fontWeight:600,color:'var(--foreground)',fontFamily:'var(--ff-body)'}}>
                    {f.label}
                    {['consumerNumber', 'monthlyBill', 'discom', 'connectedLoad', 'sanctionedLoad', 'contractDemand', 'monthlyConsumption'].includes(f.id) && <span style={{color:'var(--destructive)', marginLeft: 2}}>*</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      style={errors[f.id] ? inputErrorStyle : inputStyle}
                      value={formData[f.id]}
                      onChange={handleChange(f.id)}
                      onFocus={e=>{e.target.style.borderColor = errors[f.id] ? 'var(--destructive)' : 'var(--primary)';e.target.style.boxShadow=`0 0 0 3px ${errors[f.id] ? 'rgba(168,84,72,0.1)' : 'rgba(93,112,82,0.1)'}`}}
                      onBlur={e=>{if(!errors[f.id]){e.target.style.borderColor='rgba(222,216,207,0.8)';e.target.style.boxShadow='none'}}}
                    >
                      <option value="" disabled>{f.placeholder}</option>
                      {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} placeholder={f.placeholder}
                      style={errors[f.id] ? inputErrorStyle : inputStyle}
                      value={formData[f.id]}
                      onChange={handleChange(f.id)}
                      onFocus={e=>{e.target.style.borderColor = errors[f.id] ? 'var(--destructive)' : 'var(--primary)';e.target.style.boxShadow=`0 0 0 3px ${errors[f.id] ? 'rgba(168,84,72,0.1)' : 'rgba(93,112,82,0.1)'}`}}
                      onBlur={e=>{if(!errors[f.id]){e.target.style.borderColor='rgba(222,216,207,0.8)';e.target.style.boxShadow='none'}}}
                    />
                  )}
                  {errors[f.id] && <span style={errorTextStyle}>{errors[f.id]}</span>}
                </div>
              ))}
            </div>

            <button onClick={handleAnalysis} className="btn-organic" style={{
              width:'100%', padding:'16px', justifyContent: 'center',
              background: 'var(--primary)',
              color:'var(--primary-foreground)', fontSize:'1.1rem',
              border:'none', cursor: 'pointer',
              boxShadow: 'var(--shadow-soft)',
            }}>
              Get Analysis
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){
          .analysis-layout{grid-template-columns:1fr!important;gap:3rem!important}
        }
        @media(max-width:640px){
          .form-grid{grid-template-columns:1fr!important}
          .analysis-layout > div:last-child { padding: 2rem !important; }
        }
      `}</style>
    </section>
  )
}
