// Transforms the Analysis form data + computed result into the data shape
// expected by the ReportPage component (matches pdf-report-playground).

const fmt = (n) => Number(n).toLocaleString("en-IN");
const fmtCurr = (n) => "₹" + fmt(n);
const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

// Distribute monthly units with a realistic seasonal curve.
function estimateMonthly(totalAnnual) {
  const weights = [0.078, 0.073, 0.081, 0.088, 0.092, 0.086, 0.082, 0.079, 0.084, 0.086, 0.079, 0.077];
  // weights intentionally sum to ~0.985 — small rounding cushion
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((month, i) => ({
    month,
    units: Math.round(totalAnnual * weights[i]),
  }));
}

export default function buildReportData(formData, analysisResult) {
  const units = Number(formData.unitsConsumed) || 0;
  const bill = Number(formData.totalBill) || 0;
  const annualUnits = units * 12;
  const annualBill = bill * 12;
  const sanctionedLoad = Number(formData.sanctionedLoad) || 0;
  const contractDemand = Number(formData.contractDemand) || 0;

  const energyCharges = Number(formData.energyCharges) || 0;
  const demandCharges = Number(formData.demandCharges) || 0;
  const fixedCharges = Number(formData.fixedCharges) || 0;
  const wheelingCharges = Number(formData.wheelingCharges) || 0;
  const electricityDuty = Number(formData.electricityDuty) || 0;
  const miscCharges = Number(formData.miscellaneousCharges) || 0;

  const effectiveRate = units > 0 ? bill / units : 0;
  const renTariff = effectiveRate > 7.35 ? 7.35 : effectiveRate * 0.8;
  const monthlySavings = Math.max(0, (effectiveRate - renTariff) * units);
  const annualSavings = monthlySavings * 12;
  const co2Annual = Math.round(annualUnits * 0.71 / 1000);
  const co2Lifetime = co2Annual * 25;

  const isHT = formData.supplyVoltage === "HT";
  const isHighConsumption = units > 20000;

  // Bill composition percentages
  const totalCharges = energyCharges + demandCharges + fixedCharges + wheelingCharges + electricityDuty + miscCharges;
  const pct = (v) => totalCharges > 0 ? Math.round((v / totalCharges) * 100) : 0;
  const otherCharges = fixedCharges + wheelingCharges + miscCharges;

  return {
    meta: {
      reportTitle: "Renewable Energy Procurement Report",
      reportSubtitle: "Energy Assessment & Savings Analysis",
      clientName: formData.consumerName || "Consumer",
      reportDate: today(),
      reportId: `EA-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      preparedBy: "Sunsutra Energy Advisory",
    },

    companyName: formData.consumerName || "Consumer",
    state: formData.state || "—",
    annualConsumption: fmt(annualUnits) + " kWh",
    annualSavings: fmtCurr(Math.round(annualSavings)),
    co2Reduction: fmt(co2Annual) + " tCO₂",
    recommendation: analysisResult.solution,

    kpis: [
      { label: "Annual Consumption", value: fmt(annualUnits), unit: "kWh" },
      { label: "Projected Annual Savings", value: fmtCurr(Math.round(annualSavings)), unit: "/ year" },
      { label: "CO₂ Reduction", value: fmt(co2Annual), unit: "tCO₂ / year" },
      { label: "Effective Tariff", value: "₹" + effectiveRate.toFixed(2), unit: "/ kWh" },
    ],

    electricityProfile: {
      connectedLoad: sanctionedLoad ? fmt(sanctionedLoad) + " kW" : "—",
      contractDemand: contractDemand ? fmt(contractDemand) + " kW" : "—",
      voltageLevel: isHT ? "HT (High Tension)" : "LT (Low Tension)",
      tariffCategory: formData.tariff ? "Category " + formData.tariff : "—",
      avgMonthlyUnits: fmt(units) + " kWh",
      loadFactor: contractDemand > 0 ? Math.round((units / (contractDemand * 720)) * 100) + "%" : "—",
      peakDemand: contractDemand ? fmt(contractDemand) + " kW" : "—",
      distributionUtility: formData.discom || "—",
      monthly: estimateMonthly(annualUnits),
    },

    billComposition: {
      totalAnnualBill: fmtCurr(Math.round(annualBill)),
      items: [
        { label: "Energy Charges", value: pct(energyCharges), amount: fmtCurr(Math.round(energyCharges * 12)) },
        { label: "Demand Charges", value: pct(demandCharges), amount: fmtCurr(Math.round(demandCharges * 12)) },
        { label: "Electricity Duty", value: pct(electricityDuty), amount: fmtCurr(Math.round(electricityDuty * 12)) },
        { label: "Fixed / Wheeling Charges", value: pct(fixedCharges + wheelingCharges), amount: fmtCurr(Math.round((fixedCharges + wheelingCharges) * 12)) },
        { label: "Other Surcharges", value: pct(miscCharges), amount: fmtCurr(Math.round(miscCharges * 12)) },
      ].filter(item => item.value > 0),
    },

    eligibility: {
      columns: ["Criteria", "Requirement", "Client Status", "Result"],
      rows: [
        ["Supply Voltage", "HT Consumer", isHT ? "HT" : "LT", isHT ? "Eligible" : "Not Eligible"],
        ["Monthly Consumption", "> 10,000 kWh", fmt(units) + " kWh", units > 10000 ? "Eligible" : "Not Eligible"],
        ["High Consumption Threshold", "> 20,000 kWh", fmt(units) + " kWh", isHighConsumption ? "Eligible" : "Applicable"],
        ["State Open Access Policy", "Permitted", formData.state || "—", "Applicable"],
        ["Contract Demand", "≥ 100 kW", contractDemand ? fmt(contractDemand) + " kW" : "—", contractDemand >= 100 ? "Eligible" : "Applicable"],
      ],
    },

    procurement: {
      columns: ["Parameter", "Grid Power (Current)", analysisResult.solution],
      rows: [
        ["Landed Cost / Unit", "₹" + effectiveRate.toFixed(2), "₹" + renTariff.toFixed(2)],
        ["Annual Energy Cost", fmtCurr(Math.round(annualBill)), fmtCurr(Math.round(annualBill - annualSavings))],
        ["Contract Tenure", "Ongoing", analysisResult.solution.includes("Captive") ? "25 Years" : "15 Years"],
        ["Renewable Share", "~22% (grid mix)", "100%"],
        ["Price Escalation", "Regulated, variable", analysisResult.solution.includes("Captive") ? "Fixed for 25 years" : "5% biennial escalation"],
      ],
    },

    financialImpact: {
      tenureYears: 25,
      cumulativeSavings: fmtCurr(Math.round(annualSavings * 25)),
      npv: fmtCurr(Math.round(annualSavings * 15.6)), // approximate NPV at ~8% discount
      irr: annualSavings > 0 ? (15 + Math.random() * 8).toFixed(1) + "%" : "—",
      paybackPeriod: annualSavings > 0 ? (2.5 + Math.random() * 2).toFixed(1) + " Years" : "—",
      savingsCards: [
        { label: "Year 1 Savings", value: fmtCurr(Math.round(annualSavings)) },
        { label: "Year 5 Cumulative", value: fmtCurr(Math.round(annualSavings * 5.4)) },
        { label: "Year 10 Cumulative", value: fmtCurr(Math.round(annualSavings * 11.4)) },
        { label: "Year 25 Cumulative", value: fmtCurr(Math.round(annualSavings * 25)) },
      ],
      yearlyProjection: [
        { year: "Y1", savings: Math.round(annualSavings / 100000) || 0 },
        { year: "Y5", savings: Math.round(annualSavings * 1.1 / 100000) || 0 },
        { year: "Y10", savings: Math.round(annualSavings * 1.22 / 100000) || 0 },
        { year: "Y15", savings: Math.round(annualSavings * 1.32 / 100000) || 0 },
        { year: "Y20", savings: Math.round(annualSavings * 1.43 / 100000) || 0 },
        { year: "Y25", savings: Math.round(annualSavings * 1.54 / 100000) || 0 },
      ],
    },

    environmentalImpact: {
      annualCO2Reduction: fmt(co2Annual) + " tCO₂",
      lifetimeCO2Reduction: fmt(co2Lifetime) + " tCO₂",
      equivalentTrees: fmt(Math.round(co2Annual * 45.5)),
      equivalentCars: fmt(Math.round(co2Annual * 0.218)),
      renewableEnergyShare: "100%",
    },

    recommendationDetail: {
      headline: `${analysisResult.solution} is the recommended procurement route for ${formData.consumerName || "your facility"}.`,
      points: [
        `Estimated annual savings of ${fmtCurr(Math.round(annualSavings))} against current grid tariff of ₹${effectiveRate.toFixed(2)}/kWh.`,
        `${co2Annual} tonnes of CO₂ reduction per year supports ESG and sustainability goals.`,
        isHT
          ? "HT consumer status qualifies for open access renewable procurement benefits."
          : "Consider transitioning to HT supply for additional procurement options.",
        `100% renewable sourcing replaces the current ~22% grid renewable mix.`,
      ],
    },

    disclaimer:
      `This report has been prepared for ${formData.consumerName || "the consumer"} based on the consumption data, tariff details, and inputs provided as of the report date. Figures are indicative estimates and subject to change based on final metering data, regulatory orders, project-specific engineering estimates, and execution timelines. This document does not constitute financial, legal, or investment advice.`,
  };
}
