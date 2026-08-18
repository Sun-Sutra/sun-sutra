import { useState, useRef, useMemo, useEffect } from 'react'
import { useFadeIn, SectionLabel, SectionHeading, SectionBody, sectionPad, container } from './utils'
import { LineChart, ShieldCheck, Clock, X, Zap, TrendingDown, Activity, Info, CheckCircle2, AlertCircle, Leaf, Download, Loader2, Share2, Check, Sparkles, Building2, Gauge, Landmark, DollarSign, ChevronRight, ChevronLeft, Sliders, Sun, Wind, Layers, ArrowUpRight, Award, Compass, FileText } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts'
import UploadSection from './UploadSection'
import ReportPage from './report/ReportPage'
import buildReportData from './report/buildReportData'
import generatePdf from './report/generatePdf'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import posthog from 'posthog-js'
import '../styles/report-tokens.css'
import '../styles/report.css'

const trustItems = [
  { icon: <LineChart size={20} />, text: 'Detailed analysis of your energy consumption' },
  { icon: <ShieldCheck size={20} />, text: 'Accurate cost predictions based on your data' },
  { icon: <Clock size={20} />, text: 'Instant reports to optimize your savings' },
]

const recentAudits = [
  { location: 'Solapur Industrial Area', industry: 'Textile Mill', bill: '₹6.5L/mo', savings: '₹1.8L/mo', type: 'Solar Open Access' },
  { location: 'Chakan MIDC, Pune', industry: 'Injection Molding', bill: '₹14.0L/mo', savings: '₹4.2L/mo', type: 'Group Captive' },
  { location: 'Waluj, Chhatrapati Sambhajinagar', industry: 'Auto Components', bill: '₹8.2L/mo', savings: '₹2.4L/mo', type: 'Wind-Solar Hybrid' },
  { location: 'Tarapur MIDC, Palghar', industry: 'Chemical Processing', bill: '₹22.0L/mo', savings: '₹6.8L/mo', type: 'Solar Open Access' },
]

const inputStyle = {
  background: '#ffffff',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'rgba(222,216,207,0.8)',
  borderRadius: '12px',
  color: 'var(--foreground)',
  fontFamily: 'var(--ff-body)',
  fontSize: '0.95rem',
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
  transition: 'all 0.25s ease',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
}

const inputErrorStyle = {
  ...inputStyle,
  borderColor: 'var(--destructive)',
  boxShadow: '0 0 0 3px rgba(168,84,72,0.15)',
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
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' or 'fullForm'
  const [wizardStep, setWizardStep] = useState(1); // 1: Facility, 2: Technical, 3: Charges
  
  // Simulator State
  const [simUnits, setSimUnits] = useState(35000);
  const [simTariff, setSimTariff] = useState(9.5);
  const [ppaType, setPpaType] = useState('hybrid'); // 'solar', 'wind', 'hybrid'

  // Full Form State
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
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSlow, setIsSlow] = useState(false)
  const [isOfflineParser, setIsOfflineParser] = useState(false)
  
  const { executeRecaptcha } = useGoogleReCaptcha()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if (navigator.connection) {
      const conn = navigator.connection
      const updateConn = () => {
        setIsSlow(conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')
      }
      conn.addEventListener('change', updateConn)
      updateConn()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const ref = useFadeIn()
  const reportContainerRef = useRef(null)
  const uploadRef = useRef(null)

  // Live Simulator Calculations
  const simCurrentBill = Math.round(simUnits * simTariff);
  const simPpaTariff = ppaType === 'solar' ? 6.8 : ppaType === 'wind' ? 7.1 : 6.5;
  const simMonthlySavings = Math.round(simUnits * (simTariff - simPpaTariff));
  const simAnnualSavings = simMonthlySavings * 12;

  // URL query parameter auto-loader for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
        setFormData(decoded);
        setActiveTab('fullForm');
        setWizardStep(3); // jump straight to step 3 for review
        
        const units = Number(decoded.unitsConsumed) || 0;
        const bill = Number(decoded.totalBill) || 0;
        if (units > 0 && bill > 0) {
          const effectiveRate = bill / units;
          const renTariff = effectiveRate > 7.35 ? 7.35 : effectiveRate * 0.8;
          const monthlySavings = (effectiveRate - renTariff) * units;
          const annualSavings = monthlySavings * 12;
          const co2 = (units * 12 * 0.71 / 1000).toFixed(0);
          const score = Math.min(100, Math.max(50, Math.round(70 + (monthlySavings / bill) * 100)));
          const isHT = decoded.supplyVoltage === 'HT';
          const isHighConsumption = units > 20000;
          const isPass = isHT && units > 10000;

          setAnalysisResult({
            currentBill: bill.toLocaleString('en-IN'),
            averageTariff: effectiveRate.toFixed(2),
            renewableTariff: renTariff.toFixed(2),
            monthlySavings: Math.max(0, Math.round(monthlySavings)).toLocaleString('en-IN'),
            annualSavings: Math.max(0, Math.round(annualSavings)).toLocaleString('en-IN'),
            co2,
            score,
            isEligible: isPass,
            solution: isHT ? (isHighConsumption ? 'Open Access Solar PPA' : 'Group Captive') : 'Rooftop Solar'
          });
        }
      } catch (e) {
        console.warn('Could not parse shared link data:', e);
      }
    }
  }, []);

  const handleShare = () => {
    try {
      const jsonStr = JSON.stringify(formData);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Failed to copy share link:', e);
    }
  };

  const chartData = useMemo(() => {
    if (!analysisResult) return [];
    const monthlyBill = Number(formData.totalBill) || 100000;
    const monthlySavingsVal = (Number(analysisResult.averageTariff) - Number(analysisResult.renewableTariff)) * (Number(formData.unitsConsumed) || 10000);
    const sunSutraMonthly = Math.max(0, monthlyBill - Math.max(0, monthlySavingsVal));
    
    let gridAcc = 0;
    let sunSutraAcc = 0;
    const points = [];
    
    for (let year = 1; year <= 10; year++) {
      const gridYearCost = (monthlyBill * 12) * Math.pow(1.05, year - 1);
      const sunSutraYearCost = (sunSutraMonthly * 12);
      gridAcc += gridYearCost;
      sunSutraAcc += sunSutraYearCost;
      
      points.push({
        year: `Year ${year}`,
        gridCost: Math.round(gridAcc),
        sunSutraCost: Math.round(sunSutraAcc),
      });
    }
    return points;
  }, [analysisResult, formData]);

  const discomBenchmarkData = [
    { discom: 'MSEDCL Industrial', rate: 9.85 },
    { discom: 'Tata Power HT', rate: 9.20 },
    { discom: 'Adani Electricity', rate: 9.50 },
    { discom: 'Sun Sutra PPA', rate: simPpaTariff, highlight: true },
  ];

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    if (step === 1) {
      if (!String(formData.consumerNumber).trim()) newErrors.consumerNumber = 'Consumer number required'
      if (!String(formData.consumerName).trim()) newErrors.consumerName = 'Consumer name required'
      if (!String(formData.discom).trim()) newErrors.discom = 'DISCOM required'
      if (!String(formData.state).trim()) newErrors.state = 'State required'
    } else if (step === 2) {
      if (!String(formData.tariff).trim()) newErrors.tariff = 'Tariff category required'
      if (!String(formData.contractDemand).trim()) newErrors.contractDemand = 'Contract demand required'
      if (!String(formData.supplyVoltage).trim()) newErrors.supplyVoltage = 'Voltage tier required'
      if (!String(formData.billingPeriod).trim()) newErrors.billingPeriod = 'Billing period required'
      if (!String(formData.unitsConsumed).trim()) newErrors.unitsConsumed = 'Units consumed required'
      if (!String(formData.sanctionedLoad).trim()) newErrors.sanctionedLoad = 'Sanctioned load required'
    } else if (step === 3) {
      if (!String(formData.energyCharges).trim()) newErrors.energyCharges = 'Energy charges required'
      if (!String(formData.demandCharges).trim()) newErrors.demandCharges = 'Demand charges required'
      if (!String(formData.electricityDuty).trim()) newErrors.electricityDuty = 'Duty required'
      if (!String(formData.totalBill).trim()) newErrors.totalBill = 'Total bill required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAll = () => {
    return validateStep(1) && validateStep(2) && validateStep(3);
  }

  const handleExtractedData = (aiData) => {
    setIsOfflineParser(!!aiData.isOffline);
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
    if (!validateAll()) return
    if (executeRecaptcha) {
      await executeRecaptcha('analysis_submit').catch(console.warn);
    }
    if (uploadRef.current) {
      await uploadRef.current.uploadToR2()
    }
    
    posthog.capture('analysis_completed', { form: 'Analysis', units: formData.unitsConsumed, bill: formData.totalBill })
    
    const units = Number(formData.unitsConsumed) || 0;
    const bill = Number(formData.totalBill) || 0;
    
    const effectiveRate = units > 0 ? bill / units : 0;
    const renTariff = effectiveRate > 7.35 ? 7.35 : effectiveRate * 0.8;
    const monthlySavings = (effectiveRate - renTariff) * units;
    const annualSavings = monthlySavings * 12;
    const co2 = (units * 12 * 0.71 / 1000).toFixed(0);
    const score = Math.min(100, Math.max(50, Math.round(70 + (monthlySavings / bill) * 100)));
    
    const isHT = formData.supplyVoltage === 'HT';
    const isHighConsumption = units > 20000;
    const isEligible = isHT && isHighConsumption;
    const isPass = isHT && units > 10000;

    setAnalysisResult({
      currentBill: bill.toLocaleString('en-IN'),
      averageTariff: effectiveRate.toFixed(2),
      renewableTariff: renTariff.toFixed(2),
      monthlySavings: Math.max(0, Math.round(monthlySavings)).toLocaleString('en-IN'),
      annualSavings: Math.max(0, Math.round(annualSavings)).toLocaleString('en-IN'),
      co2,
      score,
      isEligible: isPass,
      solution: isHT ? (isHighConsumption ? 'Open Access Solar PPA' : 'Group Captive') : 'Rooftop Solar'
    });
  }

  const fieldsSection1 = [
    { label: 'Consumer Number', id: 'consumerNumber', type: 'text', placeholder: 'e.g. 012345678912' },
    { label: 'Consumer Name', id: 'consumerName', type: 'text', placeholder: 'Company / Facility Name' },
    { label: 'DISCOM', id: 'discom', type: 'text', placeholder: 'e.g. MSEDCL / Tata Power' },
    { 
      label: 'State', id: 'state', type: 'select', placeholder: 'Select State',
      options: [
        'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Haryana', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Andhra Pradesh', 'Telangana', 'West Bengal', 'Punjab'
      ]
    },
  ]

  const fieldsSection2 = [
    { label: 'Tariff Category', id: 'tariff', type: 'text', placeholder: 'e.g. HT-I Industrial' },
    { 
      label: 'Supply Voltage', id: 'supplyVoltage', type: 'select', placeholder: 'Select Voltage',
      options: ['HT', 'LT']
    },
    { label: 'Contract Demand (kW)', id: 'contractDemand', type: 'number', placeholder: 'e.g. 200' },
    { label: 'Sanctioned Load (kW)', id: 'sanctionedLoad', type: 'number', placeholder: 'e.g. 250' },
    { label: 'Billing Period', id: 'billingPeriod', type: 'text', placeholder: 'e.g. July 2026' },
    { label: 'Units Consumed (kWh)', id: 'unitsConsumed', type: 'number', placeholder: 'e.g. 45000' },
  ]

  const fieldsSection3 = [
    { label: 'Energy Charges (₹)', id: 'energyCharges', type: 'number', placeholder: 'e.g. 250000' },
    { label: 'Demand Charges (₹)', id: 'demandCharges', type: 'number', placeholder: 'e.g. 45000' },
    { label: 'Electricity Duty (₹)', id: 'electricityDuty', type: 'number', placeholder: 'e.g. 28000' },
    { label: 'Fixed Charges (₹)', id: 'fixedCharges', type: 'number', placeholder: 'Optional' },
    { label: 'Wheeling Charges (₹)', id: 'wheelingCharges', type: 'number', placeholder: 'Optional' },
    { label: 'Total Bill Amount (₹)', id: 'totalBill', type: 'number', placeholder: 'e.g. 350000' },
  ]

  const renderFieldList = (fieldList) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
      {fieldList.map(f => (
        <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--ff-body)' }}>
            {f.label}
            {['consumerNumber', 'consumerName', 'discom', 'state', 'tariff', 'contractDemand', 'supplyVoltage', 'billingPeriod', 'unitsConsumed', 'sanctionedLoad', 'energyCharges', 'demandCharges', 'electricityDuty', 'totalBill'].includes(f.id) && <span style={{ color: 'var(--destructive)', marginLeft: 2 }}>*</span>}
          </label>
          {f.type === 'select' ? (
            <select
              style={errors[f.id] ? inputErrorStyle : inputStyle}
              value={formData[f.id]}
              onChange={handleChange(f.id)}
              onFocus={e => { e.target.style.borderColor = errors[f.id] ? 'var(--destructive)' : 'var(--primary)'; e.target.style.boxShadow = `0 0 0 3px ${errors[f.id] ? 'rgba(168,84,72,0.1)' : 'rgba(93,112,82,0.1)'}` }}
              onBlur={e => { if (!errors[f.id]) { e.target.style.borderColor = 'rgba(222,216,207,0.8)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)' } }}
            >
              <option value="" disabled>{f.placeholder}</option>
              {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input 
              type={f.type} 
              placeholder={f.placeholder}
              style={errors[f.id] ? inputErrorStyle : inputStyle}
              value={formData[f.id]}
              onChange={handleChange(f.id)}
              onFocus={e => { e.target.style.borderColor = errors[f.id] ? 'var(--destructive)' : 'var(--primary)'; e.target.style.boxShadow = `0 0 0 3px ${errors[f.id] ? 'rgba(168,84,72,0.1)' : 'rgba(93,112,82,0.1)'}` }}
              onBlur={e => { if (!errors[f.id]) { e.target.style.borderColor = 'rgba(222,216,207,0.8)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)' } }}
            />
          )}
          {errors[f.id] && <span style={errorTextStyle}>{errors[f.id]}</span>}
        </div>
      ))}
    </div>
  );

  return (
    <section id="analysis" style={{ padding: '20px 0 clamp(40px, 6vw, 80px)', overflow: 'hidden' }}>
      <div style={{ ...container, position: 'relative', zIndex: 1 }}>
        
        {/* Top Header & Interactive Mode Switcher */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>

          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--foreground)', marginBottom: '1rem', lineHeight: 1.15 }}>
            Instant Open Access Savings Audit
          </h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem', maxWidth: 680, margin: '0 auto 2rem' }}>
            Simulate your monthly tariff reduction live or upload your electricity bill for a precision 10-year PPA audit.
          </p>

          {/* Mode Switcher Buttons */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--surface)',
            padding: '6px',
            borderRadius: '9999px',
            border: '1px solid rgba(222,216,207,0.8)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <button
              onClick={() => setActiveTab('simulator')}
              style={{
                padding: '10px 24px',
                borderRadius: '9999px',
                border: 'none',
                background: activeTab === 'simulator' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'simulator' ? '#fff' : 'var(--foreground)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Sliders size={16} /> Instant Live Simulator
            </button>
            <button
              onClick={() => setActiveTab('fullForm')}
              style={{
                padding: '10px 24px',
                borderRadius: '9999px',
                border: 'none',
                background: activeTab === 'fullForm' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'fullForm' ? '#fff' : 'var(--foreground)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Building2 size={16} /> Precision Bill Audit (Wizard)
            </button>
          </div>
        </div>

        {/* Connection HUD / Notice Bar */}
        <div style={{
          marginTop: '-1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          flexWrap: 'wrap'
        }}>


          {/* Slow Network Alert */}
          {isSlow && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(234,179,8,0.08)',
              border: '1px solid rgba(234,179,8,0.2)',
              color: '#eab308',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308', animation: 'pulse 1.2s infinite' }} />
              SLOW CONNECTION DETECTED
            </div>
          )}

          {/* Local Offline Parser Warning */}
          {isOfflineParser && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.2)',
              color: '#f97316',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              ⚠️ LOCAL PARSER FALLBACK ACTIVE
            </div>
          )}
        </div>

        {/* MODE 1: INSTANT LIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '3rem',
            alignItems: 'stretch',
            marginBottom: '4rem'
          }} className="analysis-layout">
            
            {/* Controls Box */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: '2rem',
              padding: '2.5rem',
              border: '1px solid rgba(222,216,207,0.8)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--foreground)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sliders size={20} color="var(--primary)" /> Adjust Facility Load & Tariff
                </h3>

                {/* Slider 1: Units Consumed */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Monthly Consumption (kWh)</span>
                    <strong style={{ color: 'var(--primary)', fontFamily: 'var(--ff-display)', fontSize: '1.1rem' }}>{simUnits.toLocaleString('en-IN')} kWh</strong>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="2500"
                    value={simUnits}
                    onChange={(e) => setSimUnits(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                    <span>5k kWh (Small MSME)</span>
                    <span>50k kWh</span>
                    <span>200k kWh (Large Plant)</span>
                  </div>
                </div>

                {/* Slider 2: Current Grid Tariff */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Current Grid Tariff (₹/unit)</span>
                    <strong style={{ color: '#ef4444', fontFamily: 'var(--ff-display)', fontSize: '1.1rem' }}>₹{simTariff.toFixed(2)} / kWh</strong>
                  </div>
                  <input
                    type="range"
                    min="7.5"
                    max="14.0"
                    step="0.10"
                    value={simTariff}
                    onChange={(e) => setSimTariff(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                    <span>₹7.50 (LT Industrial)</span>
                    <span>₹9.85 (MSEDCL Standard)</span>
                    <span>₹14.00 (Peak Tariff)</span>
                  </div>
                </div>

                {/* PPA Energy Mix Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '10px' }}>
                    Select Preferred PPA Energy Mix
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'solar', label: 'Solar PPA', sub: '₹6.80/unit', icon: <Sun size={18} /> },
                      { id: 'wind', label: 'Wind PPA', sub: '₹7.10/unit', icon: <Wind size={18} /> },
                      { id: 'hybrid', label: 'Hybrid PPA', sub: '₹6.50/unit', icon: <Layers size={18} /> }
                    ].map(p => (
                      <div
                        key={p.id}
                        onClick={() => setPpaType(p.id)}
                        style={{
                          border: `2px solid ${ppaType === p.id ? 'var(--primary)' : 'rgba(222,216,207,0.8)'}`,
                          background: ppaType === p.id ? 'rgba(16,185,129,0.06)' : '#fff',
                          borderRadius: '12px',
                          padding: '12px 10px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ color: ppaType === p.id ? 'var(--primary)' : 'var(--muted-foreground)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                          {p.icon}
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--foreground)' }}>{p.label}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>{p.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div style={{ marginTop: '2rem' }}>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      unitsConsumed: String(simUnits),
                      totalBill: String(simCurrentBill),
                      tariff: 'HT-I',
                      supplyVoltage: simUnits > 15000 ? 'HT' : 'LT',
                      state: 'Maharashtra',
                      discom: 'MSEDCL',
                      consumerName: 'Simulated Facility',
                      consumerNumber: '999988887777',
                      contractDemand: String(Math.round(simUnits / 150)),
                      sanctionedLoad: String(Math.round(simUnits / 120)),
                      energyCharges: String(Math.round(simCurrentBill * 0.65)),
                      demandCharges: String(Math.round(simCurrentBill * 0.15)),
                      electricityDuty: String(Math.round(simCurrentBill * 0.10)),
                      fixedCharges: '5000',
                      billingPeriod: 'Current Month'
                    }));
                    setActiveTab('fullForm');
                    setWizardStep(3); // jump to step 3 review
                  }}
                  className="btn-organic"
                  style={{
                    width: '100%',
                    padding: '14px',
                    justifyContent: 'center',
                    background: 'var(--foreground)',
                    color: '#fff',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    gap: 8
                  }}
                >
                  Proceed to Precision Audit <ArrowUpRight size={18} />
                </button>
              </div>
            </div>

            {/* Live Results Panel */}
            <div style={{
              background: '#090d16',
              borderRadius: '2rem',
              padding: '2.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                  <Sparkles size={14} /> INSTANT SIMULATOR METRICS
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#8e8e8e', fontWeight: 600 }}>ESTIMATED ANNUAL SAVINGS</span>
                  <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#eab308', margin: '4px 0', fontFamily: 'var(--ff-display)' }}>
                    ₹{(simAnnualSavings / 100000).toFixed(2)} <span style={{ fontSize: '1.2rem' }}>Lakhs/yr</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#10b981' }}>~₹{simMonthlySavings.toLocaleString('en-IN')} saved every month</span>
                </div>

                {/* DISCOM Tariff Benchmark Bar Chart */}
                <div style={{ marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#8e8e8e', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
                    MAHARASHTRA INDUSTRIAL TARIFF BENCHMARK (₹/kWh)
                  </span>
                  <div style={{ width: '100%', height: 160 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={discomBenchmarkData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <XAxis type="number" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 12]} />
                        <YAxis dataKey="discom" type="category" stroke="#4b5563" tick={{ fill: '#d1d5db', fontSize: 11 }} width={110} />
                        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                        <Bar dataKey="rate" radius={[0, 6, 6, 0]}>
                          {discomBenchmarkData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.highlight ? '#10b981' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Current Monthly Bill</span>
                <strong style={{ fontSize: '1.1rem', color: '#fff' }}>₹{simCurrentBill.toLocaleString('en-IN')}</strong>
              </div>
            </div>

          </div>
        )}

        {/* MODE 2: PRECISION FORM AUDIT (3-STEP WIZARD) */}
        {activeTab === 'fullForm' && (
          <div ref={ref} style={{
            display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '4rem', alignItems: 'start',
            marginBottom: '4rem'
          }} className="analysis-layout">
            
            {/* Info Side Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div style={{
                background: 'var(--foreground)',
                color: '#fff',
                borderRadius: '2rem',
                padding: '2.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <h3 style={{ color: '#fff', fontSize: '1.5rem', fontFamily: 'var(--ff-display)', marginBottom: '1rem' }}>
                  3-Step Precision Audit
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Drag and drop your electricity bill to extract metrics instantly, or click through our quick step-by-step wizard.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {trustItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.9rem', color: '#e5e7eb' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Helper Card */}
              <div style={{
                background: 'var(--surface)',
                borderRadius: '1.5rem',
                padding: '1.75rem',
                border: '1px solid rgba(222,216,207,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                  <Zap size={22} />
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)' }}>Auto-Skip with OCR</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Uploading your bill auto-populates all 18 variables and takes you straight to final review!</p>
                </div>
              </div>

            </div>

            {/* Form Wizard Card Container */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: '2rem',
              padding: '2.5rem',
              border: '1px solid rgba(222,216,207,0.8)',
              boxShadow: 'var(--shadow-card)',
              position: 'relative', 
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'var(--primary)', zIndex: 2 }} />

              {/* Wizard Step Progress Tracker */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid rgba(222,216,207,0.5)', paddingBottom: '1.5rem' }}>
                {[
                  { step: 1, label: 'Facility', icon: <Building2 size={16} /> },
                  { step: 2, label: 'Voltage & Demand', icon: <Gauge size={16} /> },
                  { step: 3, label: 'Tariff & Charges', icon: <Landmark size={16} /> }
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => setWizardStep(s.step)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      opacity: wizardStep === s.step ? 1 : 0.5,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: wizardStep === s.step ? 'var(--primary)' : 'var(--muted)',
                      color: wizardStep === s.step ? '#fff' : 'var(--foreground)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}>
                      {s.step}
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: wizardStep === s.step ? 700 : 500, color: 'var(--foreground)' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Upload + Facility */}
              {wizardStep === 1 && (
                <div>
                  <UploadSection ref={uploadRef} onExtracted={handleExtractedData} />
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1rem', fontFamily: 'var(--ff-display)' }}>
                      Step 1 of 3: Consumer & Facility Identity
                    </h4>
                    {renderFieldList(fieldsSection1)}
                  </div>
                  <button
                    type="button"
                    onClick={() => { if (validateStep(1)) setWizardStep(2); }}
                    className="btn-organic"
                    style={{
                      width: '100%',
                      padding: '14px',
                      justifyContent: 'center',
                      background: 'var(--primary)',
                      color: '#fff',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      gap: 8,
                      marginTop: '1rem'
                    }}
                  >
                    Continue to Voltage Metrics <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* Step 2: Technical & Demand */}
              {wizardStep === 2 && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1rem', fontFamily: 'var(--ff-display)' }}>
                      Step 2 of 3: Technical & Demand Metrics
                    </h4>
                    {renderFieldList(fieldsSection2)}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="btn-organic"
                      style={{
                        flex: 1,
                        padding: '14px',
                        justifyContent: 'center',
                        background: 'var(--muted)',
                        color: 'var(--foreground)',
                        fontWeight: 700,
                        border: '1px solid rgba(222,216,207,0.8)',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        gap: 6
                      }}
                    >
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (validateStep(2)) setWizardStep(3); }}
                      className="btn-organic"
                      style={{
                        flex: 2,
                        padding: '14px',
                        justifyContent: 'center',
                        background: 'var(--primary)',
                        color: '#fff',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        gap: 8
                      }}
                    >
                      Continue to Tariff Breakdown <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Charges & Review */}
              {wizardStep === 3 && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1rem', fontFamily: 'var(--ff-display)' }}>
                      Step 3 of 3: Tariff & Charges Breakdown
                    </h4>
                    {renderFieldList(fieldsSection3)}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="btn-organic"
                      style={{
                        flex: 1,
                        padding: '14px',
                        justifyContent: 'center',
                        background: 'var(--muted)',
                        color: 'var(--foreground)',
                        fontWeight: 700,
                        border: '1px solid rgba(222,216,207,0.8)',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        gap: 6
                      }}
                    >
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button 
                      type="button"
                      onClick={handleAnalysis} 
                      className="btn-organic" 
                      style={{
                        flex: 2,
                        padding: '14px', 
                        justifyContent: 'center',
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)', 
                        fontSize: '1rem',
                        fontWeight: 700,
                        border: 'none', 
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(16,185,129,0.25)',
                        gap: 8
                      }}
                    >
                      Generate Full Energy Audit <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Live Recent Industry Audits Feed */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '1.5rem',
          padding: '2rem',
          border: '1px solid rgba(222,216,207,0.6)',
          marginTop: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <Award size={20} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--ff-display)', color: 'var(--foreground)' }}>
              Recent MSME Open Access Audits
            </h4>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {recentAudits.map((a, idx) => (
              <div key={idx} style={{
                background: 'var(--background)',
                border: '1px solid rgba(222,216,207,0.5)',
                borderRadius: '1rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>{a.location}</div>
                  <h5 style={{ margin: '4px 0 8px', fontSize: '1rem', color: 'var(--foreground)', fontWeight: 700 }}>{a.industry}</h5>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(222,216,207,0.4)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Bill: {a.bill}</span>
                  <strong style={{ color: '#10b981' }}>Saved: {a.savings}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Results Section (Sleek Dark Dashboard) */}
      {analysisResult && (
        <div style={{ ...container, marginTop: '5rem' }} ref={(el) => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
          
          <div style={{
            background: '#090d16',
            borderRadius: '2.5rem',
            padding: '3.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden',
            color: '#fff'
          }}>
            {/* Ambient Backlight Glow */}
            <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Dashboard Header & Floating Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={16} /> AUDIT REPORT READY
                </div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.2rem', color: '#fff', margin: 0 }}>
                  Renewable Energy ROI Profile
                </h3>
                <p style={{ color: '#8e8e8e', fontSize: '1rem', margin: '4px 0 0' }}>
                  Facility: <strong style={{ color: '#fff' }}>{formData.consumerName || 'Industrial Consumer'}</strong> | DISCOM: <strong style={{ color: '#fff' }}>{formData.discom || 'MSEDCL'}</strong>
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={async () => {
                    if (isGeneratingPdf || !reportContainerRef.current) return;
                    setIsGeneratingPdf(true);
                    try {
                      await generatePdf(
                        reportContainerRef.current.querySelector('.report-page') || reportContainerRef.current,
                        `Energy-Report-${formData.consumerName || 'Assessment'}.pdf`
                      );
                    } catch (err) {
                      console.error('PDF generation failed:', err);
                    } finally {
                      setIsGeneratingPdf(false);
                    }
                  }}
                  className="btn-organic"
                  style={{
                    padding: '12px 24px',
                    background: '#10b981',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: isGeneratingPdf ? 'wait' : 'pointer',
                    opacity: isGeneratingPdf ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                    gap: 8,
                  }}
                  disabled={isGeneratingPdf}
                  id="download-report-btn"
                >
                  {isGeneratingPdf ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating PDF…</>
                  ) : (
                    <><Download size={16} /> Download Full PDF</>    
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="btn-organic"
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    border: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    gap: 8,
                  }}
                >
                  {copied ? (
                    <><Check size={16} color="#10b981" /> Link Copied!</>
                  ) : (
                    <><Share2 size={16} /> Share Audit Link</>
                  )}
                </button>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#8e8e8e', fontWeight: 600 }}>ESTIMATED ANNUAL SAVINGS</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308', margin: '8px 0 4px', fontFamily: 'var(--ff-display)' }}>
                  ₹{analysisResult.annualSavings}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#10b981' }}>~₹{analysisResult.monthlySavings} / month</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#8e8e8e', fontWeight: 600 }}>EFFECTIVE TARIFF REDUCTION</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', margin: '8px 0 4px', fontFamily: 'var(--ff-display)' }}>
                  ₹{analysisResult.renewableTariff} <span style={{ fontSize: '1rem', color: '#6b7280', textDecoration: 'line-through' }}>₹{analysisResult.averageTariff}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>per kWh unit</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#8e8e8e', fontWeight: 600 }}>ANNUAL CARBON OFFSET</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', margin: '8px 0 4px', fontFamily: 'var(--ff-display)' }}>
                  {analysisResult.co2} <span style={{ fontSize: '1rem', fontWeight: 600 }}>tCO₂</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Equivalent clean power</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#8e8e8e', fontWeight: 600 }}>AUDIT ELIGIBILITY SCORE</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '8px 0 4px', fontFamily: 'var(--ff-display)' }}>
                  {analysisResult.score} <span style={{ fontSize: '1rem', color: '#6b7280' }}>/ 100</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: analysisResult.isEligible ? '#10b981' : '#eab308' }}>
                  {analysisResult.isEligible ? 'High Priority Open Access' : 'Group Captive Candidate'}
                </span>
              </div>
            </div>

            {/* Strategic Details & Recommended Solution Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              
              {/* Detailed Breakdown */}
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={18} color="#10b981"/> Billing Metrics Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                    <span style={{ color: '#8e8e8e' }}>Current Monthly Energy Spend</span>
                    <strong style={{ color: '#fff' }}>₹{analysisResult.currentBill}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                    <span style={{ color: '#8e8e8e' }}>Current Grid Tariff</span>
                    <strong style={{ color: '#ef4444' }}>₹{analysisResult.averageTariff} / kWh</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                    <span style={{ color: '#8e8e8e' }}>Projected Sun Sutra PPA Rate</span>
                    <strong style={{ color: '#10b981' }}>₹{analysisResult.renewableTariff} / kWh</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                    <span style={{ color: '#8e8e8e' }}>Estimated Monthly Net Savings</span>
                    <strong style={{ color: '#eab308' }}>₹{analysisResult.monthlySavings}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8e8e8e' }}>Supply Voltage Category</span>
                    <strong style={{ color: '#fff' }}>{formData.supplyVoltage || 'HT'}</strong>
                  </div>
                </div>
              </div>

              {/* Recommended Solution Card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingDown size={18} color="#10b981"/> Recommended Procurement Path
                  </h4>
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em' }}>PRIMARY RECOMMENDATION</span>
                    <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: '4px 0 0', fontFamily: 'var(--ff-display)' }}>
                      {analysisResult.solution}
                    </h3>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                    Based on your demand profile, Sun Sutra will aggregate your load with nearby MSMEs in Maharashtra to unlock bulk Open Access PPA rates.
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#10b981' }}>
                  <ShieldCheck size={16} /> Zero upfront capital expenditure required.
                </div>
              </div>

            </div>

            {/* 10-Year Cumulative Cost Projection Chart */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.25rem', fontFamily: 'var(--ff-display)', margin: 0 }}>
                    10-Year Cumulative Cost Trajectory
                  </h4>
                  <p style={{ color: '#8e8e8e', fontSize: '0.85rem', margin: '4px 0 0' }}>
                    Comparing compounding grid tariff escalation (5%/yr) vs. Sun Sutra flat PPA agreement
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ color: '#d1d5db' }}>Grid Cost (No Action)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ color: '#d1d5db' }}>Sun Sutra Open Access</span>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="analysisGridGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="analysisSunGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis 
                      stroke="#4b5563" 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                      }}
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                    />
                    <Area type="monotone" dataKey="gridCost" name="Grid Cost" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#analysisGridGrad)" />
                    <Area type="monotone" dataKey="sunSutraCost" name="Sun Sutra Cost" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#analysisSunGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hidden offscreen container for PDF rendering */}
      {analysisResult && (
        <div
          ref={reportContainerRef}
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            width: '210mm',
            zIndex: -1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <ReportPage data={buildReportData(formData, analysisResult)} />
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media(max-width:1024px){
          .analysis-layout{grid-template-columns:1fr!important;gap:3rem!important}
        }
        @media(max-width:640px){
          .analysis-layout > div:last-child { padding: 1.25rem !important; border-radius: 20px !important; }
          .wizard-steps-container { flex-direction: column !important; align-items: stretch !important; gap: 0.75rem !important; }
          .wizard-step-item { justify-content: flex-start !important; width: 100% !important; }
        }
      `}</style>
    </section>
  )
}
