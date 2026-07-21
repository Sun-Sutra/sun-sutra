import { useState, useRef } from 'react'
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
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'rgba(222,216,207,0.8)',
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

const parseToKw = (val) => {
  if (val === undefined || val === null || val === '') return '';
  let str = String(val).toLowerCase().replace(/,/g, '').trim();
  const match = str.match(/([0-9]*\.?[0-9]+)/);
  if (!match) return '';
  let num = parseFloat(match[1]);
  if (isNaN(num)) return '';
  if (str.includes('hp') || str.includes('horsepower')) {
    num = num * 0.7457;
  } else if (str.includes('mw') || str.includes('megawatt')) {
    num = num * 1000;
  } else if (str.includes(' w') || str.includes('watts') || (str.endsWith('w') && !str.endsWith('kw') && !str.endsWith('mw') && !str.endsWith('hp'))) {
    num = num / 1000;
  }
  return Number(num.toFixed(3));
};

const cleanNumber = (val) => {
  if (val === undefined || val === null || val === '') return '';
  let str = String(val).replace(/₹|,|\s/g, '').trim();
  const match = str.match(/([0-9]*\.?[0-9]+)/);
  if (!match) return '';
  const num = parseFloat(match[1]);
  return isNaN(num) ? '' : num;
};

export default function Analysis() {
  const [formData, setFormData] = useState({
    consumerNumber: '',
    consumerName: '',
    discom: '',
    state: '',
    tariff: '',
    contractDemand: '',
    supplyVoltage: '',
    billingPeriod: '',
    unitsConsumed: '',
    sanctionedLoad: '',
    energyCharges: '',
    demandCharges: '',
    fixedCharges: '',
    wheelingCharges: '',
    electricityDuty: '',
    totalBill: '',
    totalLossPercentage: '',
    miscellaneousCharges: '',
  })
  const [errors, setErrors] = useState({})
  const ref = useFadeIn()
  const uploadRef = useRef(null)

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!String(formData.consumerNumber).trim()) newErrors.consumerNumber = 'Consumer number is required'
    if (!String(formData.consumerName).trim()) newErrors.consumerName = 'Consumer name is required'
    if (!String(formData.discom).trim()) newErrors.discom = 'DISCOM is required'
    if (!String(formData.state).trim()) newErrors.state = 'State is required'
    if (!String(formData.tariff).trim()) newErrors.tariff = 'Tariff is required'
    if (!String(formData.contractDemand).trim()) newErrors.contractDemand = 'Contract demand is required'
    if (!String(formData.supplyVoltage).trim()) newErrors.supplyVoltage = 'Supply voltage is required'
    if (!String(formData.billingPeriod).trim()) newErrors.billingPeriod = 'Billing period is required'
    if (!String(formData.unitsConsumed).trim()) newErrors.unitsConsumed = 'Units consumed is required'
    if (!String(formData.sanctionedLoad).trim()) newErrors.sanctionedLoad = 'Sanctioned load is required'
    if (!String(formData.energyCharges).trim()) newErrors.energyCharges = 'Energy charges are required'
    if (!String(formData.demandCharges).trim()) newErrors.demandCharges = 'Demand charges are required'
    if (!String(formData.electricityDuty).trim()) newErrors.electricityDuty = 'Electricity duty is required'
    if (!String(formData.totalBill).trim()) newErrors.totalBill = 'Total bill is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleExtractedData = (aiData) => {
    setFormData(prev => ({
      ...prev,
      consumerNumber: cleanNumber(aiData.consumerNumber) !== '' ? cleanNumber(aiData.consumerNumber) : prev.consumerNumber,
      consumerName: aiData.consumerName ? String(aiData.consumerName).trim() : prev.consumerName,
      discom: aiData.discom ? String(aiData.discom).trim() : prev.discom,
      state: aiData.state ? String(aiData.state).trim() : prev.state,
      tariff: cleanNumber(aiData.tariff) !== '' ? cleanNumber(aiData.tariff) : prev.tariff,
      contractDemand: parseToKw(aiData.contractDemand) !== '' ? parseToKw(aiData.contractDemand) : prev.contractDemand,
      supplyVoltage: aiData.supplyVoltage ? String(aiData.supplyVoltage).trim() : prev.supplyVoltage,
      billingPeriod: aiData.billingPeriod ? String(aiData.billingPeriod).trim() : prev.billingPeriod,
      unitsConsumed: cleanNumber(aiData.unitsConsumed) !== '' ? cleanNumber(aiData.unitsConsumed) : prev.unitsConsumed,
      sanctionedLoad: parseToKw(aiData.sanctionedLoad) !== '' ? parseToKw(aiData.sanctionedLoad) : prev.sanctionedLoad,
      energyCharges: cleanNumber(aiData.energyCharges) !== '' ? cleanNumber(aiData.energyCharges) : prev.energyCharges,
      demandCharges: cleanNumber(aiData.demandCharges) !== '' ? cleanNumber(aiData.demandCharges) : prev.demandCharges,
      fixedCharges: cleanNumber(aiData.fixedCharges) !== '' ? cleanNumber(aiData.fixedCharges) : prev.fixedCharges,
      wheelingCharges: cleanNumber(aiData.wheelingCharges) !== '' ? cleanNumber(aiData.wheelingCharges) : prev.wheelingCharges,
      electricityDuty: cleanNumber(aiData.electricityDuty) !== '' ? cleanNumber(aiData.electricityDuty) : prev.electricityDuty,
      totalBill: cleanNumber(aiData.totalBill) !== '' ? cleanNumber(aiData.totalBill) : prev.totalBill,
      totalLossPercentage: cleanNumber(aiData.totalLossPercentage) !== '' ? cleanNumber(aiData.totalLossPercentage) : prev.totalLossPercentage,
      miscellaneousCharges: cleanNumber(aiData.miscellaneousCharges) !== '' ? cleanNumber(aiData.miscellaneousCharges) : prev.miscellaneousCharges,
    }));
  };

  const handleAnalysis = async () => {
    if (!validate()) return
    // Upload bill image to Cloudflare R2 if user attached one (optional, non-blocking)
    if (uploadRef.current) {
      await uploadRef.current.uploadToR2()
    }
    // Button currently does nothing else — analysis output goes here later
    console.log('Get Analysis clicked with data:', formData)
  }

  const fields = [
    { label: 'Consumer Number', id: 'consumerNumber', type: 'number', placeholder: 'Enter consumer number' },
    { label: 'Consumer Name', id: 'consumerName', type: 'text', placeholder: 'Enter consumer name' },
    { label: 'DISCOM', id: 'discom', type: 'text', placeholder: 'Enter DISCOM' },
    { 
      label: 'State', id: 'state', type: 'select', placeholder: 'Select state',
      options: [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
      ]
    },
    { label: 'Tariff', id: 'tariff', type: 'number', placeholder: 'Enter tariff category' },
    { label: 'Contract Demand (kW)', id: 'contractDemand', type: 'number', placeholder: 'Enter contract demand' },
    { 
      label: 'Supply Voltage (HT/LT)', id: 'supplyVoltage', type: 'select', placeholder: 'Select supply voltage',
      options: ['HT', 'LT']
    },
    { label: 'Billing Period', id: 'billingPeriod', type: 'text', placeholder: 'Enter billing period' },
    { label: 'Units Consumed (kWh)', id: 'unitsConsumed', type: 'number', placeholder: 'Enter units consumed' },
    { label: 'Sanctioned Load (kW)', id: 'sanctionedLoad', type: 'number', placeholder: 'Enter sanctioned load' },
    { label: 'Energy Charges (₹)', id: 'energyCharges', type: 'number', placeholder: 'Enter energy charges' },
    { label: 'Demand Charges (₹)', id: 'demandCharges', type: 'number', placeholder: 'Enter demand charges' },
    { label: 'Fixed Charges (₹)', id: 'fixedCharges', type: 'number', placeholder: 'Enter fixed charges (optional)' },
    { label: 'Wheeling Charges (₹)', id: 'wheelingCharges', type: 'number', placeholder: 'Enter wheeling charges (optional)' },
    { label: 'Electricity Duty (₹)', id: 'electricityDuty', type: 'number', placeholder: 'Enter electricity duty' },
    { label: 'Total Bill (₹)', id: 'totalBill', type: 'number', placeholder: 'Enter total bill' },
    { label: 'Total Loss Percentage (%)', id: 'totalLossPercentage', type: 'number', placeholder: 'Enter total loss percentage (optional)' },
    { label: 'Miscellaneous Charges (₹)', id: 'miscellaneousCharges', type: 'number', placeholder: 'Enter miscellaneous charges (optional)' },
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

            <UploadSection ref={uploadRef} onExtracted={handleExtractedData} />

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'2rem'}} className="form-grid">
              {fields.map(f => (
                <div key={f.id} style={{display:'flex',flexDirection:'column',gap:8}}>
                  <label style={{fontSize:13,fontWeight:600,color:'var(--foreground)',fontFamily:'var(--ff-body)'}}>
                    {f.label}
                    {['consumerNumber', 'consumerName', 'discom', 'state', 'tariff', 'contractDemand', 'supplyVoltage', 'billingPeriod', 'unitsConsumed', 'sanctionedLoad', 'energyCharges', 'demandCharges', 'electricityDuty', 'totalBill'].includes(f.id) && <span style={{color:'var(--destructive)', marginLeft: 2}}>*</span>}
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
