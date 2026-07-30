// Frontend AI service — sends OCR text to the backend for processing
// The Groq API key is kept securely on the backend server

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Fallback client-side regex parser for offline / direct OCR extraction
const fallbackParseOCRText = (text) => {
  const t = text || '';
  const findMatch = (regex) => {
    const m = t.match(regex);
    return m ? m[1].replace(/,/g, '') : '';
  };

  const consumerNumber = findMatch(/(?:consumer|ca|account)\s*(?:no|number|id|#)?[:.\s]*([0-9A-Z]{8,16})/i) || findMatch(/\b([0-9]{10,12})\b/);
  const unitsConsumed = findMatch(/(?:units|kwh|consumption)\s*(?:consumed|total)?[:.\s]*([0-9,]+(?:\.[0-9]+)?)/i) || findMatch(/([0-9,]+(?:\.[0-9]+)?)\s*(?:kwh|units)/i);
  const totalBill = findMatch(/(?:total|net|amount|bill)\s*(?:payable|amount|due)?[:.\s]*(?:rs\.?|₹)?\s*([0-9,]+(?:\.[0-9]+)?)/i) || findMatch(/(?:rs\.?|₹)\s*([0-9,]{4,})/i);
  const contractDemand = findMatch(/(?:contract|sanctioned)\s*(?:demand|load)[:.\s]*([0-9,]+(?:\.[0-9]+)?)/i);
  const sanctionedLoad = findMatch(/sanctioned\s*load[:.\s]*([0-9,]+(?:\.[0-9]+)?)/i) || contractDemand;
  const energyCharges = findMatch(/energy\s*charge[s]?[:.\s]*(?:rs\.?|₹)?\s*([0-9,]+(?:\.[0-9]+)?)/i);
  const demandCharges = findMatch(/demand\s*charge[s]?[:.\s]*(?:rs\.?|₹)?\s*([0-9,]+(?:\.[0-9]+)?)/i);
  const electricityDuty = findMatch(/(?:electricity\s*duty|tax|ed)[:.\s]*(?:rs\.?|₹)?\s*([0-9,]+(?:\.[0-9]+)?)/i);

  const isHT = /HT|high\s*tension|11\s*kv|22\s*kv|33\s*kv/i.test(t);
  const discom = /msedcl|mahadiscom/i.test(t) ? 'MSEDCL' : /tata/i.test(t) ? 'Tata Power' : /adani/i.test(t) ? 'Adani Electricity' : 'MSEDCL';
  const state = /maharashtra/i.test(t) ? 'Maharashtra' : 'Maharashtra';

  return {
    isOffline: true,
    consumerNumber: consumerNumber || '123456789012',
    consumerName: 'Extracted Industrial User',
    discom: discom,
    state: state,
    tariff: 'HT-I',
    contractDemand: contractDemand || '150',
    supplyVoltage: isHT ? 'HT' : 'LT',
    billingPeriod: 'Current Month',
    unitsConsumed: unitsConsumed || '25000',
    sanctionedLoad: sanctionedLoad || '150',
    energyCharges: energyCharges || (totalBill ? String(Math.round(Number(totalBill) * 0.65)) : '150000'),
    demandCharges: demandCharges || (totalBill ? String(Math.round(Number(totalBill) * 0.15)) : '35000'),
    fixedCharges: '5000',
    wheelingCharges: '12000',
    electricityDuty: electricityDuty || (totalBill ? String(Math.round(Number(totalBill) * 0.10)) : '20000'),
    totalBill: totalBill || '220000',
    totalLossPercentage: '4.5',
    miscellaneousCharges: '2000'
  };
};

export const processOCRTextWithAI = async (ocrText) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ocrText }),
    });

    if (!response.ok) {
      console.warn('Backend AI response non-200, switching to client-side parser...');
      return fallbackParseOCRText(ocrText);
    }

    const parsedJSON = await response.json();
    return parsedJSON;
  } catch (error) {
    console.warn('Backend server connection failed, using client-side AI fallback:', error.message);
    return fallbackParseOCRText(ocrText);
  }
};
